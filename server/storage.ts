import { 
  User, InsertUser, 
  PhoneNumber, InsertPhoneNumber, 
  Order, InsertOrder,
  Payment, InsertPayment,
  Kyc, InsertKyc,
  Activity, InsertActivity,
  Setting
} from "@shared/schema";
import { nanoid } from "nanoid";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByReferralCode(referralCode: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<User>): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  getReferredUsers(referralCode: string): Promise<User[]>;
  
  // Phone number methods
  createPhoneNumber(phoneNumber: InsertPhoneNumber): Promise<PhoneNumber>;
  getPhoneNumber(id: number): Promise<PhoneNumber | undefined>;
  getAllPhoneNumbers(): Promise<PhoneNumber[]>;
  getAvailablePhoneNumbers(): Promise<PhoneNumber[]>;
  updatePhoneNumber(id: number, data: Partial<PhoneNumber>): Promise<PhoneNumber | undefined>;
  deletePhoneNumber(id: number): Promise<boolean>;
  
  // Order methods
  createOrder(order: InsertOrder): Promise<Order>;
  getOrder(id: number): Promise<Order | undefined>;
  getUserOrders(userId: number): Promise<Order[]>;
  updateOrder(id: number, data: Partial<Order>): Promise<Order | undefined>;
  
  // Payment methods
  createPayment(payment: InsertPayment): Promise<Payment>;
  getPayment(id: number): Promise<Payment | undefined>;
  getUserPayments(userId: number): Promise<Payment[]>;
  updatePayment(id: number, data: Partial<Payment>): Promise<Payment | undefined>;
  getPendingPayments(): Promise<Payment[]>;
  
  // KYC methods
  createKyc(kyc: InsertKyc): Promise<Kyc>;
  getKyc(id: number): Promise<Kyc | undefined>;
  getUserKyc(userId: number): Promise<Kyc | undefined>;
  updateKyc(id: number, data: Partial<Kyc>): Promise<Kyc | undefined>;
  getPendingKyc(): Promise<Kyc[]>;
  
  // Activity methods
  createActivity(activity: InsertActivity): Promise<Activity>;
  getUserActivities(userId: number): Promise<Activity[]>;
  
  // Settings methods
  getSetting(key: string): Promise<string | undefined>;
  setSetting(key: string, value: string): Promise<boolean>;
  getAllSettings(): Promise<Setting[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private phoneNumbers: Map<number, PhoneNumber>;
  private orders: Map<number, Order>;
  private payments: Map<number, Payment>;
  private kycRecords: Map<number, Kyc>;
  private activities: Map<number, Activity>;
  private settings: Map<string, string>;
  
  currentUserId: number;
  currentPhoneNumberId: number;
  currentOrderId: number;
  currentPaymentId: number;
  currentKycId: number;
  currentActivityId: number;

  constructor() {
    this.users = new Map();
    this.phoneNumbers = new Map();
    this.orders = new Map();
    this.payments = new Map();
    this.kycRecords = new Map();
    this.activities = new Map();
    this.settings = new Map();
    
    this.currentUserId = 1;
    this.currentPhoneNumberId = 1;
    this.currentOrderId = 1;
    this.currentPaymentId = 1;
    this.currentKycId = 1;
    this.currentActivityId = 1;
    
    // Initialize default settings
    this.initializeDefaultSettings();
  }

  private initializeDefaultSettings(): void {
    this.settings.set("REFERRALS_NEEDED", "20");
    this.settings.set("ADMIN_CODE", "vesta1212");
    this.settings.set("KYC_REQUIRED_FOR_REFERRAL", "true");
    this.settings.set("LOCAL_PAYMENT_ACCOUNT", "8121320468");
    this.settings.set("OPAY_ENABLED", "true");
    this.settings.set("KENO_ENABLED", "true");
    this.settings.set("SITE_NAME", "EtherDoxShefZySMS");
    this.settings.set("SITE_DESCRIPTION", "WhatsApp Number Service");
    this.settings.set("CONTACT_EMAIL", "support@etherdoxshefzysms.com");
    this.settings.set("MAINTENANCE_MODE", "false");
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }

  async getUserByReferralCode(referralCode: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.referralCode === referralCode
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    
    // Check if user was referred by someone
    let isAdmin = false;
    
    if (insertUser.referredBy === await this.getSetting("ADMIN_CODE")) {
      isAdmin = true;
      insertUser.referredBy = undefined; // Clear the admin code as referral
    } else if (insertUser.referredBy) {
      const referrer = await this.getUserByReferralCode(insertUser.referredBy);
      
      if (referrer) {
        // Increment referrer's count
        const updatedReferrer = {
          ...referrer,
          referralCount: referrer.referralCount + 1
        };
        this.users.set(referrer.id, updatedReferrer);
      }
    }
    
    // Generate a unique referral code
    const referralCode = nanoid(8);
    
    const user: User = {
      id,
      ...insertUser,
      referralCode,
      referralCount: 0,
      isAdmin,
      isVerified: false,
      isBanned: false,
      kycStatus: "pending",
      balance: 0,
      createdAt: new Date()
    };
    
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, data: Partial<User>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) {
      return undefined;
    }
    
    const updatedUser = { ...user, ...data };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async getReferredUsers(referralCode: string): Promise<User[]> {
    return Array.from(this.users.values()).filter(
      (user) => user.referredBy === referralCode
    );
  }

  // Phone number methods
  async createPhoneNumber(phoneNumber: InsertPhoneNumber): Promise<PhoneNumber> {
    const id = this.currentPhoneNumberId++;
    const newPhoneNumber: PhoneNumber = {
      id,
      ...phoneNumber,
      isAvailable: true,
      createdAt: new Date()
    };
    
    this.phoneNumbers.set(id, newPhoneNumber);
    return newPhoneNumber;
  }

  async getPhoneNumber(id: number): Promise<PhoneNumber | undefined> {
    return this.phoneNumbers.get(id);
  }

  async getAllPhoneNumbers(): Promise<PhoneNumber[]> {
    return Array.from(this.phoneNumbers.values());
  }

  async getAvailablePhoneNumbers(): Promise<PhoneNumber[]> {
    return Array.from(this.phoneNumbers.values()).filter(
      (phoneNumber) => phoneNumber.isAvailable
    );
  }

  async updatePhoneNumber(id: number, data: Partial<PhoneNumber>): Promise<PhoneNumber | undefined> {
    const phoneNumber = await this.getPhoneNumber(id);
    if (!phoneNumber) {
      return undefined;
    }
    
    const updatedPhoneNumber = { ...phoneNumber, ...data };
    this.phoneNumbers.set(id, updatedPhoneNumber);
    return updatedPhoneNumber;
  }

  async deletePhoneNumber(id: number): Promise<boolean> {
    return this.phoneNumbers.delete(id);
  }

  // Order methods
  async createOrder(order: InsertOrder): Promise<Order> {
    const id = this.currentOrderId++;
    const newOrder: Order = {
      id,
      ...order,
      status: "pending",
      code: undefined,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.orders.set(id, newOrder);
    
    // Mark phone number as unavailable if not a referral reward
    if (!order.isReferralReward) {
      const phoneNumber = await this.getPhoneNumber(order.phoneNumberId);
      if (phoneNumber) {
        await this.updatePhoneNumber(phoneNumber.id, { isAvailable: false });
      }
    }
    
    return newOrder;
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getUserOrders(userId: number): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(
      (order) => order.userId === userId
    );
  }

  async updateOrder(id: number, data: Partial<Order>): Promise<Order | undefined> {
    const order = await this.getOrder(id);
    if (!order) {
      return undefined;
    }
    
    const updatedOrder = { ...order, ...data, updatedAt: new Date() };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  // Payment methods
  async createPayment(payment: InsertPayment): Promise<Payment> {
    const id = this.currentPaymentId++;
    const newPayment: Payment = {
      id,
      ...payment,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.payments.set(id, newPayment);
    return newPayment;
  }

  async getPayment(id: number): Promise<Payment | undefined> {
    return this.payments.get(id);
  }

  async getUserPayments(userId: number): Promise<Payment[]> {
    return Array.from(this.payments.values()).filter(
      (payment) => payment.userId === userId
    );
  }

  async updatePayment(id: number, data: Partial<Payment>): Promise<Payment | undefined> {
    const payment = await this.getPayment(id);
    if (!payment) {
      return undefined;
    }
    
    const updatedPayment = { ...payment, ...data, updatedAt: new Date() };
    this.payments.set(id, updatedPayment);
    
    // If payment status changed to "completed" and has an order, update order status
    if (data.status === "completed" && payment.orderId) {
      const order = await this.getOrder(payment.orderId);
      if (order) {
        await this.updateOrder(order.id, { status: "completed" });
      }
    }
    
    return updatedPayment;
  }

  async getPendingPayments(): Promise<Payment[]> {
    return Array.from(this.payments.values()).filter(
      (payment) => payment.status === "pending"
    );
  }

  // KYC methods
  async createKyc(kyc: InsertKyc): Promise<Kyc> {
    const id = this.currentKycId++;
    const newKyc: Kyc = {
      id,
      ...kyc,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.kycRecords.set(id, newKyc);
    return newKyc;
  }

  async getKyc(id: number): Promise<Kyc | undefined> {
    return this.kycRecords.get(id);
  }

  async getUserKyc(userId: number): Promise<Kyc | undefined> {
    return Array.from(this.kycRecords.values()).find(
      (kyc) => kyc.userId === userId
    );
  }

  async updateKyc(id: number, data: Partial<Kyc>): Promise<Kyc | undefined> {
    const kyc = await this.getKyc(id);
    if (!kyc) {
      return undefined;
    }
    
    const updatedKyc = { ...kyc, ...data, updatedAt: new Date() };
    this.kycRecords.set(id, updatedKyc);
    
    // If KYC status is updated to approved, update user's KYC status
    if (data.status === "approved") {
      const user = await this.getUser(kyc.userId);
      if (user) {
        await this.updateUser(user.id, { kycStatus: "approved", isVerified: true });
      }
    } else if (data.status === "rejected") {
      const user = await this.getUser(kyc.userId);
      if (user) {
        await this.updateUser(user.id, { kycStatus: "rejected" });
      }
    }
    
    return updatedKyc;
  }

  async getPendingKyc(): Promise<Kyc[]> {
    return Array.from(this.kycRecords.values()).filter(
      (kyc) => kyc.status === "pending"
    );
  }

  // Activity methods
  async createActivity(activity: InsertActivity): Promise<Activity> {
    const id = this.currentActivityId++;
    const newActivity: Activity = {
      id,
      ...activity,
      createdAt: new Date()
    };
    
    this.activities.set(id, newActivity);
    return newActivity;
  }

  async getUserActivities(userId: number): Promise<Activity[]> {
    return Array.from(this.activities.values())
      .filter(activity => activity.userId === userId)
      .sort((a, b) => {
        // Sort by created date, newest first
        return b.createdAt.getTime() - a.createdAt.getTime();
      });
  }

  // Settings methods
  async getSetting(key: string): Promise<string | undefined> {
    return this.settings.get(key);
  }

  async setSetting(key: string, value: string): Promise<boolean> {
    this.settings.set(key, value);
    return true;
  }

  async getAllSettings(): Promise<Setting[]> {
    return Array.from(this.settings.entries()).map(([key, value]) => ({
      id: 0, // Not relevant for in-memory storage
      key,
      value
    }));
  }
}

export const storage = new MemStorage();
