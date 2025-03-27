import express, { type Request, Response } from "express";
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertPhoneNumberSchema, 
  insertOrderSchema, 
  insertPaymentSchema,
  insertKycSchema,
  insertActivitySchema
} from "@shared/schema";
import { ZodError } from "zod";
import crypto from "crypto";
import { nanoid } from "nanoid";

declare global {
  namespace Express {
    interface Request {
      userId?: number;
      isAdmin?: boolean;
    }
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  const router = express.Router();
  const httpServer = createServer(app);
  
  // Health check endpoint for Koyeb
  router.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Simple authentication middleware
  const authenticate = async (req: Request, res: Response, next: Function) => {
    // In a real app, use JWT or session-based auth
    // For this implementation, we'll use a simple token stored in a header
    const authToken = req.headers.authorization?.split(' ')[1];
    
    if (!authToken) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    try {
      // In a real app, verify JWT signature. Here we just parse the token
      const tokenParts = authToken.split(':');
      
      if (tokenParts.length !== 2) {
        return res.status(401).json({ message: "Invalid authentication token" });
      }
      
      const [userId, userHash] = tokenParts;
      const user = await storage.getUser(parseInt(userId));
      
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      
      // Very simple "signature" validation
      const expectedHash = crypto
        .createHash('sha256')
        .update(`${user.id}:${user.email}:${user.password.substring(0, 10)}`)
        .digest('hex')
        .substring(0, 10);
      
      if (userHash !== expectedHash) {
        return res.status(401).json({ message: "Invalid authentication token" });
      }
      
      // Add user info to request
      req.userId = user.id;
      req.isAdmin = user.isAdmin;
      
      next();
    } catch (error) {
      console.error("Auth error:", error);
      return res.status(401).json({ message: "Invalid authentication token" });
    }
  };

  // Admin middleware
  const requireAdmin = (req: Request, res: Response, next: Function) => {
    if (!req.isAdmin) {
      return res.status(403).json({ message: "Admin privileges required" });
    }
    next();
  };

  // Error handling middleware
  const handleErrors = (fn: Function) => {
    return async (req: Request, res: Response, next: Function) => {
      try {
        await fn(req, res, next);
      } catch (error) {
        console.error("Error:", error);
        
        if (error instanceof ZodError) {
          return res.status(400).json({ 
            message: "Validation error", 
            errors: error.errors 
          });
        }
        
        res.status(500).json({ message: "Internal server error" });
      }
    };
  };

  // Authentication Routes
  router.post('/auth/register', handleErrors(async (req: Request, res: Response) => {
    const userData = insertUserSchema.parse(req.body);
    
    // Check if user with email already exists
    const existingEmail = await storage.getUserByEmail(userData.email);
    if (existingEmail) {
      return res.status(400).json({ message: "Email already in use" });
    }
    
    // Check if username is taken
    const existingUsername = await storage.getUserByUsername(userData.username);
    if (existingUsername) {
      return res.status(400).json({ message: "Username already taken" });
    }
    
    // Check if referral code is valid when provided
    if (userData.referredBy) {
      // Check if it's the admin code
      const adminCode = await storage.getSetting("ADMIN_CODE");
      
      if (userData.referredBy !== adminCode) {
        const referrer = await storage.getUserByReferralCode(userData.referredBy);
        if (!referrer) {
          return res.status(400).json({ message: "Invalid referral code" });
        }
      }
    }
    
    // Hash password in a real app
    // For demo, we'll just prefix it to simulate hashing
    userData.password = `hashed_${userData.password}`;
    
    const newUser = await storage.createUser(userData);
    
    // Create a simple auth token
    const hash = crypto
      .createHash('sha256')
      .update(`${newUser.id}:${newUser.email}:${newUser.password.substring(0, 10)}`)
      .digest('hex')
      .substring(0, 10);
      
    const token = `${newUser.id}:${hash}`;
    
    // Create activity record
    await storage.createActivity({
      userId: newUser.id,
      action: "User registration",
      status: "Completed"
    });
    
    // Don't return password in response
    const { password, ...userWithoutPassword } = newUser;
    
    res.status(201).json({ 
      message: "User registered successfully",
      user: userWithoutPassword,
      token
    });
  }));

  router.post('/auth/login', handleErrors(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    
    const user = await storage.getUserByEmail(email);
    
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    
    // In a real app, use bcrypt to compare passwords
    // Here we'll just check our simulated hash
    if (user.password !== `hashed_${password}`) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    
    if (user.isBanned) {
      return res.status(403).json({ message: "Account has been banned" });
    }
    
    // Create a simple auth token
    const hash = crypto
      .createHash('sha256')
      .update(`${user.id}:${user.email}:${user.password.substring(0, 10)}`)
      .digest('hex')
      .substring(0, 10);
      
    const token = `${user.id}:${hash}`;
    
    // Create activity record
    await storage.createActivity({
      userId: user.id,
      action: "User login",
      status: "Completed"
    });
    
    // Don't return password in response
    const { password: pwd, ...userWithoutPassword } = user;
    
    res.json({ 
      message: "Login successful",
      user: userWithoutPassword,
      token
    });
  }));

  // User Routes
  router.get('/user/profile', authenticate, handleErrors(async (req: Request, res: Response) => {
    const user = await storage.getUser(req.userId!);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Don't return password in response
    const { password, ...userWithoutPassword } = user;
    
    res.json(userWithoutPassword);
  }));

  router.get('/user/activities', authenticate, handleErrors(async (req: Request, res: Response) => {
    const activities = await storage.getUserActivities(req.userId!);
    res.json(activities);
  }));

  router.get('/user/referrals', authenticate, handleErrors(async (req: Request, res: Response) => {
    const user = await storage.getUser(req.userId!);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const referrals = await storage.getReferredUsers(user.referralCode);
    
    // Map referrals to remove sensitive information
    const sanitizedReferrals = referrals.map(referral => {
      const { password, ...userWithoutPassword } = referral;
      return userWithoutPassword;
    });
    
    res.json(sanitizedReferrals);
  }));

  // Phone Number Routes
  router.get('/phone-numbers', authenticate, handleErrors(async (req: Request, res: Response) => {
    const phoneNumbers = await storage.getAvailablePhoneNumbers();
    res.json(phoneNumbers);
  }));

  // Order Routes
  router.post('/orders', authenticate, handleErrors(async (req: Request, res: Response) => {
    const orderData = insertOrderSchema.parse({
      ...req.body,
      userId: req.userId
    });
    
    const user = await storage.getUser(req.userId!);
    const phoneNumber = await storage.getPhoneNumber(orderData.phoneNumberId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    if (!phoneNumber) {
      return res.status(404).json({ message: "Phone number not found" });
    }
    
    if (!phoneNumber.isAvailable) {
      return res.status(400).json({ message: "Phone number is not available" });
    }
    
    // Check if it's a referral reward
    if (orderData.isReferralReward) {
      // Get referrals needed from settings
      const referralsNeededStr = await storage.getSetting("REFERRALS_NEEDED") || "20";
      const referralsNeeded = parseInt(referralsNeededStr);
      
      if (user.referralCount < referralsNeeded) {
        return res.status(400).json({ 
          message: `Not enough referrals. Need ${referralsNeeded} referrals to claim a free number.`,
          current: user.referralCount,
          needed: referralsNeeded
        });
      }
      
      // Check if KYC is required for referral rewards
      const kycRequired = (await storage.getSetting("KYC_REQUIRED_FOR_REFERRAL") || "true") === "true";
      
      if (kycRequired && user.kycStatus !== "approved") {
        return res.status(400).json({ message: "KYC verification required to claim referral rewards" });
      }
      
      // Deduct from referral count
      await storage.updateUser(user.id, {
        referralCount: user.referralCount - referralsNeeded
      });
      
      // Create the order with 0 amount
      orderData.totalAmount = 0;
    } else {
      // Not a referral reward, check balance
      if (user.balance < phoneNumber.price) {
        return res.status(400).json({ 
          message: "Insufficient balance", 
          balance: user.balance,
          required: phoneNumber.price
        });
      }
      
      // Deduct from balance
      await storage.updateUser(user.id, {
        balance: user.balance - phoneNumber.price
      });
      
      // Set the price from the phone number
      orderData.totalAmount = phoneNumber.price;
    }
    
    // Create the order
    const newOrder = await storage.createOrder(orderData);
    
    // Create activity record
    await storage.createActivity({
      userId: user.id,
      action: orderData.isReferralReward 
        ? "Claimed free number with referrals" 
        : "Purchased WhatsApp number",
      status: "Pending"
    });
    
    res.status(201).json(newOrder);
  }));

  router.get('/orders', authenticate, handleErrors(async (req: Request, res: Response) => {
    const orders = await storage.getUserOrders(req.userId!);
    res.json(orders);
  }));

  router.get('/orders/:id', authenticate, handleErrors(async (req: Request, res: Response) => {
    const orderId = parseInt(req.params.id);
    const order = await storage.getOrder(orderId);
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    // Only allow users to view their own orders unless admin
    if (order.userId !== req.userId && !req.isAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }
    
    res.json(order);
  }));

  // Payment Routes
  router.post('/payments', authenticate, handleErrors(async (req: Request, res: Response) => {
    const paymentData = insertPaymentSchema.parse({
      ...req.body,
      userId: req.userId
    });
    
    const user = await storage.getUser(req.userId!);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // For order payments, verify the order
    if (paymentData.orderId) {
      const order = await storage.getOrder(paymentData.orderId);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      if (order.userId !== user.id) {
        return res.status(403).json({ message: "Order doesn't belong to user" });
      }
      
      if (order.status !== "pending") {
        return res.status(400).json({ message: "Order is not pending payment" });
      }
    }
    
    // Generate a reference for the payment
    paymentData.reference = `PAY-${nanoid(8)}`;
    
    // Create the payment
    const newPayment = await storage.createPayment(paymentData);
    
    // Create activity record
    await storage.createActivity({
      userId: user.id,
      action: paymentData.orderId 
        ? "Payment submitted for order" 
        : "Added funds to account",
      status: "Pending"
    });
    
    res.status(201).json(newPayment);
  }));

  router.get('/payments', authenticate, handleErrors(async (req: Request, res: Response) => {
    const payments = await storage.getUserPayments(req.userId!);
    res.json(payments);
  }));

  // KYC Routes
  router.post('/kyc', authenticate, handleErrors(async (req: Request, res: Response) => {
    const kycData = insertKycSchema.parse({
      ...req.body,
      userId: req.userId
    });
    
    const user = await storage.getUser(req.userId!);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Check if user already has submitted KYC
    const existingKyc = await storage.getUserKyc(user.id);
    
    if (existingKyc) {
      return res.status(400).json({ 
        message: "KYC already submitted", 
        status: existingKyc.status 
      });
    }
    
    // Create the KYC record
    const newKyc = await storage.createKyc(kycData);
    
    // Update user KYC status
    await storage.updateUser(user.id, { kycStatus: "pending" });
    
    // Create activity record
    await storage.createActivity({
      userId: user.id,
      action: "Submitted KYC documents",
      status: "Pending"
    });
    
    res.status(201).json(newKyc);
  }));

  router.get('/kyc', authenticate, handleErrors(async (req: Request, res: Response) => {
    const kyc = await storage.getUserKyc(req.userId!);
    
    if (!kyc) {
      return res.status(404).json({ message: "KYC not found" });
    }
    
    res.json(kyc);
  }));

  // Admin Routes
  router.get('/admin/users', authenticate, requireAdmin, handleErrors(async (req: Request, res: Response) => {
    const users = await storage.getAllUsers();
    
    // Remove passwords from response
    const sanitizedUsers = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    
    res.json(sanitizedUsers);
  }));

  router.patch('/admin/users/:id', authenticate, requireAdmin, handleErrors(async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id);
    const user = await storage.getUser(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Don't allow modifying self through this endpoint
    if (userId === req.userId) {
      return res.status(400).json({ message: "Cannot modify own account through this endpoint" });
    }
    
    // Only allow specific fields to be updated
    const allowedFields = ["balance", "isAdmin", "isBanned", "referralCount"];
    const updates: Partial<typeof user> = {};
    
    for (const field of allowedFields) {
      if (field in req.body) {
        updates[field as keyof typeof user] = req.body[field];
      }
    }
    
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }
    
    const updatedUser = await storage.updateUser(userId, updates);
    
    if (!updatedUser) {
      return res.status(500).json({ message: "Failed to update user" });
    }
    
    // Create activity record
    await storage.createActivity({
      userId: req.userId!,
      action: `Admin updated user ${userId}`,
      status: "Completed"
    });
    
    // Remove password from response
    const { password, ...userWithoutPassword } = updatedUser;
    
    res.json(userWithoutPassword);
  }));

  router.post('/admin/phone-numbers', authenticate, requireAdmin, handleErrors(async (req: Request, res: Response) => {
    const phoneNumberData = insertPhoneNumberSchema.parse(req.body);
    
    const newPhoneNumber = await storage.createPhoneNumber(phoneNumberData);
    
    // Create activity record
    await storage.createActivity({
      userId: req.userId!,
      action: `Added new phone number: ${newPhoneNumber.number}`,
      status: "Completed"
    });
    
    res.status(201).json(newPhoneNumber);
  }));

  router.get('/admin/phone-numbers', authenticate, requireAdmin, handleErrors(async (req: Request, res: Response) => {
    const phoneNumbers = await storage.getAllPhoneNumbers();
    res.json(phoneNumbers);
  }));

  router.patch('/admin/phone-numbers/:id', authenticate, requireAdmin, handleErrors(async (req: Request, res: Response) => {
    const phoneNumberId = parseInt(req.params.id);
    const phoneNumber = await storage.getPhoneNumber(phoneNumberId);
    
    if (!phoneNumber) {
      return res.status(404).json({ message: "Phone number not found" });
    }
    
    // Only allow specific fields to be updated
    const allowedFields = ["price", "isAvailable", "country"];
    const updates: Partial<typeof phoneNumber> = {};
    
    for (const field of allowedFields) {
      if (field in req.body) {
        updates[field as keyof typeof phoneNumber] = req.body[field];
      }
    }
    
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }
    
    const updatedPhoneNumber = await storage.updatePhoneNumber(phoneNumberId, updates);
    
    if (!updatedPhoneNumber) {
      return res.status(500).json({ message: "Failed to update phone number" });
    }
    
    // Create activity record
    await storage.createActivity({
      userId: req.userId!,
      action: `Updated phone number: ${updatedPhoneNumber.number}`,
      status: "Completed"
    });
    
    res.json(updatedPhoneNumber);
  }));

  router.delete('/admin/phone-numbers/:id', authenticate, requireAdmin, handleErrors(async (req: Request, res: Response) => {
    const phoneNumberId = parseInt(req.params.id);
    const phoneNumber = await storage.getPhoneNumber(phoneNumberId);
    
    if (!phoneNumber) {
      return res.status(404).json({ message: "Phone number not found" });
    }
    
    const success = await storage.deletePhoneNumber(phoneNumberId);
    
    if (!success) {
      return res.status(500).json({ message: "Failed to delete phone number" });
    }
    
    // Create activity record
    await storage.createActivity({
      userId: req.userId!,
      action: `Deleted phone number: ${phoneNumber.number}`,
      status: "Completed"
    });
    
    res.json({ message: "Phone number deleted successfully" });
  }));

  router.get('/admin/orders', authenticate, requireAdmin, handleErrors(async (req: Request, res: Response) => {
    // In a real app, you'd implement pagination and filtering
    const allOrders = [];
    
    // Iterate through all users and get their orders
    const users = await storage.getAllUsers();
    
    for (const user of users) {
      const userOrders = await storage.getUserOrders(user.id);
      allOrders.push(...userOrders);
    }
    
    // Sort by creation date, newest first
    allOrders.sort((a, b) => {
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
    
    res.json(allOrders);
  }));

  router.patch('/admin/orders/:id', authenticate, requireAdmin, handleErrors(async (req: Request, res: Response) => {
    const orderId = parseInt(req.params.id);
    const order = await storage.getOrder(orderId);
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    // Only allow specific fields to be updated
    const allowedFields = ["status", "code"];
    const updates: Partial<typeof order> = {};
    
    for (const field of allowedFields) {
      if (field in req.body) {
        updates[field as keyof typeof order] = req.body[field];
      }
    }
    
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }
    
    const updatedOrder = await storage.updateOrder(orderId, updates);
    
    if (!updatedOrder) {
      return res.status(500).json({ message: "Failed to update order" });
    }
    
    // If order was completed, update the user's activity
    if (updates.status === "completed") {
      const user = await storage.getUser(order.userId);
      
      if (user) {
        await storage.createActivity({
          userId: user.id,
          action: order.isReferralReward 
            ? "Claimed free number with referrals" 
            : "Purchased WhatsApp number",
          status: "Completed"
        });
      }
    }
    
    // Create admin activity record
    await storage.createActivity({
      userId: req.userId!,
      action: `Updated order ${orderId} status to ${updates.status}`,
      status: "Completed"
    });
    
    res.json(updatedOrder);
  }));

  router.get('/admin/payments', authenticate, requireAdmin, handleErrors(async (req: Request, res: Response) => {
    const pendingOnly = req.query.pending === "true";
    let allPayments = [];
    
    if (pendingOnly) {
      allPayments = await storage.getPendingPayments();
    } else {
      // In a real app, you'd implement pagination and filtering
      
      // Iterate through all users and get their payments
      const users = await storage.getAllUsers();
      
      for (const user of users) {
        const userPayments = await storage.getUserPayments(user.id);
        allPayments.push(...userPayments);
      }
    }
    
    // Sort by creation date, newest first
    allPayments.sort((a, b) => {
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
    
    res.json(allPayments);
  }));

  router.patch('/admin/payments/:id', authenticate, requireAdmin, handleErrors(async (req: Request, res: Response) => {
    const paymentId = parseInt(req.params.id);
    const payment = await storage.getPayment(paymentId);
    
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    
    // Only allow status to be updated
    if (!("status" in req.body)) {
      return res.status(400).json({ message: "Status field is required" });
    }
    
    const updates: Partial<typeof payment> = {
      status: req.body.status
    };
    
    const updatedPayment = await storage.updatePayment(paymentId, updates);
    
    if (!updatedPayment) {
      return res.status(500).json({ message: "Failed to update payment" });
    }
    
    // If payment was completed and NOT attached to an order, add the amount to the user's balance
    if (updates.status === "completed" && !payment.orderId) {
      const user = await storage.getUser(payment.userId);
      
      if (user) {
        await storage.updateUser(user.id, {
          balance: user.balance + payment.amount
        });
        
        // Create user activity record
        await storage.createActivity({
          userId: user.id,
          action: "Added funds to account",
          status: "Completed"
        });
      }
    }
    
    // Create admin activity record
    await storage.createActivity({
      userId: req.userId!,
      action: `Updated payment ${paymentId} status to ${updates.status}`,
      status: "Completed"
    });
    
    res.json(updatedPayment);
  }));

  router.get('/admin/kyc', authenticate, requireAdmin, handleErrors(async (req: Request, res: Response) => {
    const pendingOnly = req.query.pending === "true";
    let kycRecords = [];
    
    if (pendingOnly) {
      kycRecords = await storage.getPendingKyc();
    } else {
      // In a real app, you'd implement pagination and filtering
      const users = await storage.getAllUsers();
      
      for (const user of users) {
        const userKyc = await storage.getUserKyc(user.id);
        if (userKyc) {
          kycRecords.push(userKyc);
        }
      }
    }
    
    // Sort by creation date, newest first
    kycRecords.sort((a, b) => {
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
    
    res.json(kycRecords);
  }));

  router.patch('/admin/kyc/:id', authenticate, requireAdmin, handleErrors(async (req: Request, res: Response) => {
    const kycId = parseInt(req.params.id);
    const kyc = await storage.getKyc(kycId);
    
    if (!kyc) {
      return res.status(404).json({ message: "KYC record not found" });
    }
    
    // Only allow status to be updated
    if (!("status" in req.body)) {
      return res.status(400).json({ message: "Status field is required" });
    }
    
    const updates: Partial<typeof kyc> = {
      status: req.body.status
    };
    
    const updatedKyc = await storage.updateKyc(kycId, updates);
    
    if (!updatedKyc) {
      return res.status(500).json({ message: "Failed to update KYC record" });
    }
    
    // Create admin activity record
    await storage.createActivity({
      userId: req.userId!,
      action: `Updated KYC ${kycId} status to ${updates.status}`,
      status: "Completed"
    });
    
    // Create user activity record
    await storage.createActivity({
      userId: kyc.userId,
      action: "KYC verification",
      status: updates.status === "approved" ? "Approved" : "Rejected"
    });
    
    res.json(updatedKyc);
  }));

  router.get('/admin/settings', authenticate, requireAdmin, handleErrors(async (req: Request, res: Response) => {
    const settings = await storage.getAllSettings();
    res.json(settings);
  }));

  router.patch('/admin/settings', authenticate, requireAdmin, handleErrors(async (req: Request, res: Response) => {
    const updates = req.body;
    
    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No settings to update" });
    }
    
    const updated = [];
    
    for (const [key, value] of Object.entries(updates)) {
      if (typeof value === "string") {
        await storage.setSetting(key, value);
        updated.push(key);
      }
    }
    
    if (updated.length === 0) {
      return res.status(400).json({ message: "No valid settings to update" });
    }
    
    // Create admin activity record
    await storage.createActivity({
      userId: req.userId!,
      action: `Updated system settings: ${updated.join(", ")}`,
      status: "Completed"
    });
    
    const settings = await storage.getAllSettings();
    res.json(settings);
  }));

  router.post('/admin/broadcast', authenticate, requireAdmin, handleErrors(async (req: Request, res: Response) => {
    const { message, title } = req.body;
    
    if (!message || !title) {
      return res.status(400).json({ message: "Message and title are required" });
    }
    
    // In a real app, you would send notifications to all users
    // For this demo, we'll just create an activity record
    
    await storage.createActivity({
      userId: req.userId!,
      action: `Broadcast message: ${title}`,
      status: "Completed"
    });
    
    res.json({ message: "Broadcast sent successfully" });
  }));

  // Register the API routes
  app.use('/api', router);

  return httpServer;
}
