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

  const confirmPurchase = () => {
    if (!selectedNumber) return;
    
    purchasePhoneNumber(
      { phoneNumberId: selectedNumber.id, paymentMethod: "balance" },
      {
        onSuccess: () => {
          setSelectedNumber(null);
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
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h2 className="text-lg font-medium text-gray-800">Your Balance</h2>
              <p className="text-3xl font-bold text-gray-800 my-2">
                ₦{isUserLoading ? "..." : user?.balance.toFixed(2)}
              </p>
              <p className="text-sm text-gray-500">Need more funds? Add to your balance</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button onClick={() => setShowAddFundsDialog(true)}>
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
        </CardContent>
      </Card>
      
      {/* Available Numbers */}
      <Card className="mb-6">
        <CardHeader className="px-6 py-4 border-b border-gray-200">
          <CardTitle className="text-lg font-medium text-gray-800">Available Numbers</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {isPhoneNumbersLoading ? (
            <div className="flex justify-center py-8">
              <svg
                className="animate-spin h-8 w-8 text-primary-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          ) : !phoneNumbers || phoneNumbers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No phone numbers available at the moment. Please check back later.</p>
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
        </CardContent>
      </Card>
      
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
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Purchase</DialogTitle>
              <DialogDescription>
                You are about to purchase a WhatsApp number from {selectedNumber.country}.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm text-gray-700">
                <span className="font-medium">Price:</span> ₦{selectedNumber.price.toFixed(2)}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-medium">Your balance:</span> ₦{user?.balance.toFixed(2)}
              </p>
              <p className="text-sm text-gray-700 mt-4">
                This amount will be deducted from your account balance. After purchase, the admin will provide you with the WhatsApp number and verification code.
              </p>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setSelectedNumber(null)}
              >
                Cancel
              </Button>
              <Button
                onClick={confirmPurchase}
                disabled={isPurchasePending}
              >
                {isPurchasePending ? "Processing..." : "Confirm Purchase"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Add Funds Dialog */}
      <Dialog
        open={showAddFundsDialog}
        onOpenChange={(open) => {
          if (!open) setShowAddFundsDialog(false);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Funds</DialogTitle>
            <DialogDescription>
              Add funds to your account to purchase WhatsApp numbers.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₦)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                min="1"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="payment-method">Payment Method</Label>
              <Select
                value={paymentMethod}
                onValueChange={setPaymentMethod}
              >
                <SelectTrigger id="payment-method">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="local_transfer">Local Bank Transfer</SelectItem>
                  <SelectItem value="opay">Opay</SelectItem>
                  <SelectItem value="keno">Keno</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reference">Payment Reference (Optional)</Label>
              <Input
                id="reference"
                placeholder="Transaction ID or reference"
                value={paymentReference}
                onChange={(e) => setPaymentReference(e.target.value)}
              />
            </div>
            
            <div className="pt-2">
              <p className="text-sm text-gray-700">
                <span className="font-medium">Payment Account:</span> 8121320468
              </p>
              <p className="text-sm text-gray-700 mt-2">
                After making your payment, submit this form. The admin will verify your payment and add the funds to your account.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddFundsDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddFunds}
              disabled={isPaymentPending || !amount || !paymentMethod}
            >
              {isPaymentPending ? "Processing..." : "Submit Payment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default StorePage;
