import React, { useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useUserProfile } from "@/hooks/useUser";
import { usePhoneNumbers } from "@/hooks/usePhoneNumbers";
import { useOrdersWithPhoneNumbers, usePurchasePhoneNumber } from "@/hooks/useOrders";
import { useCreatePayment } from "@/hooks/usePayments";
import { PhoneNumber } from "@shared/schema";
import PhoneNumberCard from "@/components/store/PhoneNumberCard";
import OrderTable from "@/components/store/OrderTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const StorePage: React.FC = () => {
  const { toast } = useToast();
  const { data: user, isLoading: isUserLoading } = useUserProfile();
  const { data: phoneNumbers, isLoading: isPhoneNumbersLoading } = usePhoneNumbers();
  const { data: orders, isLoading: isOrdersLoading } = useOrdersWithPhoneNumbers();
  const { mutate: purchasePhoneNumber, isPending: isPurchasePending } = usePurchasePhoneNumber();
  const { mutate: createPayment, isPending: isPaymentPending } = useCreatePayment();
  
  const [selectedNumber, setSelectedNumber] = useState<PhoneNumber | null>(null);
  const [showAddFundsDialog, setShowAddFundsDialog] = useState(false);
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentReference, setPaymentReference] = useState("");

  const handleBuyNumber = (phoneNumber: PhoneNumber) => {
    if (!user) return;
    
    // Check if user has enough balance
    if (user.balance < phoneNumber.price) {
      toast({
        title: "Insufficient balance",
        description: `You need $${phoneNumber.price.toFixed(2)} to purchase this number. Your current balance is $${user.balance.toFixed(2)}.`,
        variant: "destructive",
      });
      setShowAddFundsDialog(true);
      return;
    }
    
    setSelectedNumber(phoneNumber);
  };

  // Track WhatsApp redirect info
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [whatsappRedirect, setWhatsappRedirect] = useState<{
    url: string;
    number: string;
    message: string;
  } | null>(null);

  const confirmPurchase = () => {
    if (!selectedNumber) return;
    
    purchasePhoneNumber(
      { phoneNumberId: selectedNumber.id, paymentMethod: "balance" },
      {
        onSuccess: (data: any) => {
          // Check if the response includes WhatsApp redirect info
          if (data.whatsappRedirect) {
            setWhatsappRedirect(data.whatsappRedirect);
            setPurchaseSuccess(true);
          } else {
            setSelectedNumber(null);
          }
        },
      }
    );
  };

  const handleAddFunds = () => {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount to add to your balance.",
        variant: "destructive",
      });
      return;
    }
    
    if (!paymentMethod) {
      toast({
        title: "Payment method required",
        description: "Please select a payment method.",
        variant: "destructive",
      });
      return;
    }
    
    createPayment(
      {
        amount: parsedAmount,
        method: paymentMethod,
        reference: paymentReference || undefined,
      },
      {
        onSuccess: () => {
          setShowAddFundsDialog(false);
          setAmount("");
          setPaymentMethod("");
          setPaymentReference("");
        },
      }
    );
  };

  return (
    <DashboardLayout title="Buy WhatsApp Numbers">
      {/* Balance Info */}
      <div className="vibrant-card-alt mb-6 p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between relative z-10">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="h-5 w-5 text-purple-400"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              Your Current Balance
            </h2>
            <p className="text-4xl font-bold my-3 neon-text">
              ₦{isUserLoading ? "..." : user?.balance.toFixed(2)}
            </p>
            <p className="text-sm text-purple-300">Need more funds? Add to your balance</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button 
              onClick={() => setShowAddFundsDialog(true)}
              className="bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white border-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Add Funds
            </Button>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl"></div>
      </div>
      
      {/* Available Numbers */}
      <div className="vibrant-card mb-6 overflow-hidden">
        <div className="px-6 py-4 border-b border-purple-900/20 flex items-center justify-between">
          <h2 className="text-lg font-bold vibrant-gradient-text flex items-center gap-2">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5"
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            Available Numbers
          </h2>
        </div>
        <div className="p-6">
          {isPhoneNumbersLoading ? (
            <div className="flex justify-center py-10">
              <div className="w-12 h-12 relative">
                <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-purple-500 animate-spin"></div>
                <div className="absolute inset-3 rounded-full border-t-2 border-r-2 border-pink-500 animate-spin"></div>
                <div className="absolute inset-6 rounded-full border-t-2 border-r-2 border-indigo-500 animate-spin"></div>
              </div>
            </div>
          ) : !phoneNumbers || phoneNumbers.length === 0 ? (
            <div className="text-center py-10 px-4">
              <div className="w-16 h-16 mx-auto mb-4 bg-purple-900/20 rounded-full flex items-center justify-center">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-8 w-8 text-purple-400"
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M7 8h.01" />
                  <path d="M12 8h.01" />
                  <path d="M17 8h.01" />
                  <path d="M7 12h.01" />
                  <path d="M12 12h.01" />
                  <path d="M17 12h.01" />
                  <path d="M7 16h.01" />
                  <path d="M12 16h.01" />
                  <path d="M17 16h.01" />
                </svg>
              </div>
              <p className="text-purple-300">No phone numbers available</p>
              <p className="text-sm text-purple-400/70 mt-2">Please check back later or contact admin</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {phoneNumbers.filter(pn => pn.isAvailable).map((phoneNumber) => (
                <PhoneNumberCard
                  key={phoneNumber.id}
                  phoneNumber={phoneNumber}
                  onBuy={handleBuyNumber}
                  disabled={isPurchasePending}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Order History */}
      <OrderTable
        orders={orders || []}
        isLoading={isOrdersLoading}
      />
      
      {/* Purchase Confirmation Dialog */}
      {selectedNumber && (
        <Dialog
          open={!!selectedNumber}
          onOpenChange={(open) => {
            if (!open) setSelectedNumber(null);
          }}
        >
          <DialogContent className="bg-black border border-purple-800/30 text-white">
            <DialogHeader>
              <DialogTitle className="vibrant-gradient-text text-xl">Confirm Purchase</DialogTitle>
              <DialogDescription className="text-purple-300">
                You are about to purchase a WhatsApp number from {selectedNumber.country}.
              </DialogDescription>
            </DialogHeader>
            <div className="py-6 border-t border-b border-purple-900/20 my-2">
              <div className="flex flex-col space-y-3">
                <div className="flex justify-between items-center py-1 px-3 bg-purple-900/20 rounded-lg">
                  <span className="text-sm text-purple-300">Price:</span>
                  <span className="text-lg font-bold rainbow-text">₦{selectedNumber.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center py-1 px-3 bg-purple-900/20 rounded-lg">
                  <span className="text-sm text-purple-300">Your Balance:</span>
                  <span className="text-lg font-bold vibrant-gradient-text">₦{user?.balance.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="mt-4 p-3 rounded-lg border border-purple-500/20 bg-purple-900/10">
                <p className="text-sm text-purple-200">
                  This amount will be deducted from your account balance. After purchase, the admin will provide you with the WhatsApp number and verification code.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setSelectedNumber(null)}
                className="border-purple-500/30 text-purple-400 hover:bg-purple-900/20 hover:text-purple-300"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmPurchase}
                disabled={isPurchasePending}
                className="bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white border-none"
              >
                {isPurchasePending ? (
                  <div className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </div>
                ) : "Confirm Purchase"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* WhatsApp Redirect Dialog */}
      <Dialog
        open={purchaseSuccess}
        onOpenChange={(open) => {
          if (!open) {
            setPurchaseSuccess(false);
            setWhatsappRedirect(null);
            setSelectedNumber(null);
          }
        }}
      >
        <DialogContent className="bg-black border border-purple-800/30 text-white">
          <DialogHeader>
            <DialogTitle className="vibrant-gradient-text text-xl">Purchase Successful!</DialogTitle>
            <DialogDescription className="text-purple-300">
              Your WhatsApp number order has been processed successfully.
            </DialogDescription>
          </DialogHeader>
          <div className="py-6 space-y-4 border-t border-b border-purple-900/20 my-2">
            <div className="flex flex-col space-y-3">
              <div className="flex items-center justify-center mb-2">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
              </div>
              
              <p className="text-center text-purple-200">
                Connect with our service team on WhatsApp to complete your order
              </p>
              
              <div className="p-4 rounded-lg border border-purple-500/20 bg-purple-900/10">
                <div className="flex items-center gap-2 mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="#25D366"
                    className="flex-shrink-0"
                  >
                    <path 
                      d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
                    />
                  </svg>
                  <span className="font-bold text-green-400">WhatsApp Number:</span>
                </div>
                <p className="text-lg font-bold text-white mb-4 ml-7">{whatsappRedirect?.number}</p>
                
                <div className="flex items-center gap-2 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                  <span className="font-bold text-purple-400">Message Preview:</span>
                </div>
                <p className="text-sm text-purple-200 bg-purple-900/30 p-3 rounded border border-purple-700/20 ml-7">
                  {whatsappRedirect?.message}
                </p>
              </div>
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setPurchaseSuccess(false);
                setWhatsappRedirect(null);
                setSelectedNumber(null);
              }}
              className="border-purple-500/30 text-purple-400 hover:bg-purple-900/20 hover:text-purple-300 w-full sm:w-auto order-2 sm:order-1"
            >
              Close
            </Button>
            <a 
              href={whatsappRedirect?.url || '#'} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full sm:w-auto order-1 sm:order-2"
            >
              <Button
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white border-none w-full flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="#ffffff"
                  className="flex-shrink-0"
                >
                  <path 
                    d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
                  />
                </svg>
                Open WhatsApp
              </Button>
            </a>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Funds Dialog */}
      <Dialog
        open={showAddFundsDialog}
        onOpenChange={(open) => {
          if (!open) setShowAddFundsDialog(false);
        }}
      >
        <DialogContent className="bg-black border border-purple-800/30 text-white">
          <DialogHeader>
            <DialogTitle className="vibrant-gradient-text text-xl">Add Funds</DialogTitle>
            <DialogDescription className="text-purple-300">
              Add funds to your account to purchase WhatsApp numbers.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-5 py-4 border-t border-purple-900/20 my-2">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-purple-200">Amount (₦)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                min="1"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="border-purple-800/30 bg-purple-900/10 text-white placeholder:text-purple-500/70 focus:ring-purple-500/50"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="payment-method" className="text-purple-200">Payment Method</Label>
              <Select
                value={paymentMethod}
                onValueChange={setPaymentMethod}
              >
                <SelectTrigger 
                  id="payment-method"
                  className="border-purple-800/30 bg-purple-900/10 text-white"
                >
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border border-purple-800/30 text-white">
                  <SelectItem value="local_transfer" className="focus:bg-purple-900/20">Local Bank Transfer</SelectItem>
                  <SelectItem value="opay" className="focus:bg-purple-900/20">Opay</SelectItem>
                  <SelectItem value="keno" className="focus:bg-purple-900/20">Keno</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reference" className="text-purple-200">Payment Reference (Optional)</Label>
              <Input
                id="reference"
                placeholder="Transaction ID or reference"
                value={paymentReference}
                onChange={(e) => setPaymentReference(e.target.value)}
                className="border-purple-800/30 bg-purple-900/10 text-white placeholder:text-purple-500/70 focus:ring-purple-500/50"
              />
            </div>
            
            <div className="p-3 rounded-lg border border-purple-500/20 bg-purple-900/10">
              <p className="text-sm text-purple-200 flex items-center gap-2">
                <span className="font-medium neon-text">Payment Account:</span> 
                <span className="rainbow-text font-bold">8121320468</span>
              </p>
              <p className="text-sm text-purple-300 mt-2">
                <span className="text-white font-medium">Bank username:</span> Keno Darlington Avwunudiogba
              </p>
              <p className="text-xs text-purple-400/70 mt-3">
                After making your payment, submit this form. The admin will verify your payment and add the funds to your account.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddFundsDialog(false)}
              className="border-purple-500/30 text-purple-400 hover:bg-purple-900/20 hover:text-purple-300"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddFunds}
              disabled={isPaymentPending || !amount || !paymentMethod}
              className="bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white border-none"
            >
              {isPaymentPending ? (
                <div className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </div>
              ) : "Submit Payment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default StorePage;
