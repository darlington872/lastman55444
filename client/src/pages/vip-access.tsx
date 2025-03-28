import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/ui/sidebar";
import { Star, Shield, Lock, CheckCircle, MessageCircle, Smartphone, CreditCard, Phone } from "lucide-react";

const VIPAccess: React.FC = () => {
  const [location] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState<string>("bank");
  const [amount] = useState<number>(2000);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  
  // Payment submission handler
  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulating API request
    setTimeout(() => {
      setIsSubmitting(false);
      setShowConfirmation(true);
      toast({
        title: "Payment Initiated",
        description: "Your payment request has been submitted and is awaiting admin verification.",
        variant: "default",
      });
    }, 2000);
  };
  
  return (
    <div className="min-h-screen flex font-sans antialiased">
      <Sidebar isOpen={false} onClose={() => {}} />
      
      <div className="flex-1 overflow-hidden bg-black">
        <div className="overflow-auto h-screen">
          <div className="container mx-auto px-4 py-6">
            {/* Site Name */}
            <div className="text-center mb-8">
              <h1 className="text-5xl lg:text-6xl font-extrabold mb-4 vibrant-gradient-text">
                ETHERVOXSMS
              </h1>
              <p className="text-xl text-purple-300 mb-4">VIP Access Program</p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <div className="glowing-card p-6">
                  <div className="flex items-center mb-6 justify-center">
                    <Star className="h-10 w-10 text-yellow-400 mr-3" />
                    <h2 className="text-3xl font-bold text-center text-yellow-300">VIP Access Program</h2>
                  </div>
                  
                  <p className="text-lg text-center text-white mb-8">
                    Upgrade to VIP status to unlock premium WhatsApp numbers and exclusive platform benefits
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-purple-900/30 p-5 rounded-lg border border-purple-500/30 text-center">
                      <MessageCircle className="h-10 w-10 mx-auto mb-3 text-green-400" />
                      <h3 className="font-bold text-xl text-white mb-2">Premium Numbers</h3>
                      <p className="text-gray-300 text-sm">Access verified WhatsApp numbers from all countries</p>
                    </div>
                    
                    <div className="bg-purple-900/30 p-5 rounded-lg border border-purple-500/30 text-center">
                      <Shield className="h-10 w-10 mx-auto mb-3 text-blue-400" />
                      <h3 className="font-bold text-xl text-white mb-2">Verified Access</h3>
                      <p className="text-gray-300 text-sm">All numbers are admin-verified for authenticity</p>
                    </div>
                    
                    <div className="bg-purple-900/30 p-5 rounded-lg border border-purple-500/30 text-center">
                      <Smartphone className="h-10 w-10 mx-auto mb-3 text-purple-400" />
                      <h3 className="font-bold text-xl text-white mb-2">List Your Numbers</h3>
                      <p className="text-gray-300 text-sm">Earn by listing your own WhatsApp numbers</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Current status display */}
              <div className="mb-10">
                <div className="vip-access-card p-6">
                  <h3 className="text-2xl font-bold mb-6 text-center text-yellow-300">
                    Current Status: {user ? "Regular Member" : "Not Logged In"}
                  </h3>
                  
                  <div className="flex justify-center mb-8">
                    <div className="w-full max-w-md">
                      <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                          <div>
                            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-yellow-300 bg-yellow-900/30">
                              Regular Access
                            </span>
                          </div>
                          <div>
                            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-purple-300 bg-purple-900/30">
                              VIP Access
                            </span>
                          </div>
                        </div>
                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-800">
                          <div style={{ width: "30%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-purple-500 to-blue-500"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4 mb-8">
                    <p className="text-center text-lg text-white mb-6">
                      Unlock VIP access for just <span className="text-yellow-300 font-bold">₦2,000</span> one-time payment
                    </p>
                    
                    <div className="bg-purple-900/40 p-4 rounded-lg border border-yellow-500/30">
                      <h4 className="text-lg font-bold text-yellow-200 mb-3">VIP Benefits Include:</h4>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-white">Access to premium virtual WhatsApp numbers from all 90+ countries</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-white">List your own numbers and earn commission from each purchase</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-white">Priority verification process for all your listings</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-white">Premium customer support with faster response time</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-white">Bulk purchase discounts and special member-only offers</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Payment Section */}
              {!showConfirmation ? (
                <Card className="border-yellow-500/30 bg-black/60 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-yellow-300">Complete Your VIP Payment</CardTitle>
                    <CardDescription>Select your preferred payment method</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="bank" className="w-full" onValueChange={setPaymentMethod}>
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="bank">Bank Transfer</TabsTrigger>
                        <TabsTrigger value="card">Card Payment</TabsTrigger>
                        <TabsTrigger value="crypto">Cryptocurrency</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="bank" className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <Label htmlFor="amount">Amount (₦)</Label>
                          <Input id="amount" value={amount.toLocaleString()} readOnly className="bg-purple-900/20 border-purple-500/30" />
                        </div>
                        
                        <div className="p-4 bg-yellow-900/20 rounded-lg border border-yellow-500/30 text-yellow-200 text-sm">
                          <h4 className="font-bold mb-2">Bank Transfer Instructions:</h4>
                          <p className="mb-3">Please transfer the exact amount to the following account:</p>
                          <div className="grid grid-cols-3 gap-2 mb-1">
                            <span className="font-semibold">Bank Name:</span>
                            <span className="col-span-2">EtherVox Bank</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2 mb-1">
                            <span className="font-semibold">Account Number:</span>
                            <span className="col-span-2">0123456789</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2 mb-1">
                            <span className="font-semibold">Account Name:</span>
                            <span className="col-span-2">EtherVox SMS Services</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2 mb-1">
                            <span className="font-semibold">Reference:</span>
                            <span className="col-span-2">VIP-{user?.username || 'User'}</span>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="card" className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <Label htmlFor="cardNumber">Card Number</Label>
                          <Input id="cardNumber" placeholder="1234 5678 9012 3456" className="bg-purple-900/20 border-purple-500/30" />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="expiry">Expiry Date</Label>
                            <Input id="expiry" placeholder="MM/YY" className="bg-purple-900/20 border-purple-500/30" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cvv">CVV</Label>
                            <Input id="cvv" placeholder="123" className="bg-purple-900/20 border-purple-500/30" />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="name">Name on Card</Label>
                          <Input id="name" placeholder="John Doe" className="bg-purple-900/20 border-purple-500/30" />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="amount">Amount (₦)</Label>
                          <Input id="amount" value={amount.toLocaleString()} readOnly className="bg-purple-900/20 border-purple-500/30" />
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="crypto" className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <Label>Select Cryptocurrency</Label>
                          <RadioGroup defaultValue="btc" className="grid grid-cols-2 gap-4">
                            <div className="flex items-center space-x-2 bg-purple-900/20 p-3 rounded-lg border border-purple-500/30">
                              <RadioGroupItem value="btc" id="btc" />
                              <Label htmlFor="btc" className="cursor-pointer">Bitcoin (BTC)</Label>
                            </div>
                            <div className="flex items-center space-x-2 bg-purple-900/20 p-3 rounded-lg border border-purple-500/30">
                              <RadioGroupItem value="eth" id="eth" />
                              <Label htmlFor="eth" className="cursor-pointer">Ethereum (ETH)</Label>
                            </div>
                            <div className="flex items-center space-x-2 bg-purple-900/20 p-3 rounded-lg border border-purple-500/30">
                              <RadioGroupItem value="usdt" id="usdt" />
                              <Label htmlFor="usdt" className="cursor-pointer">Tether (USDT)</Label>
                            </div>
                            <div className="flex items-center space-x-2 bg-purple-900/20 p-3 rounded-lg border border-purple-500/30">
                              <RadioGroupItem value="bnb" id="bnb" />
                              <Label htmlFor="bnb" className="cursor-pointer">Binance Coin (BNB)</Label>
                            </div>
                          </RadioGroup>
                        </div>
                        
                        <div className="p-4 bg-yellow-900/20 rounded-lg border border-yellow-500/30 text-yellow-200 text-sm">
                          <h4 className="font-bold mb-2">Crypto Payment Instructions:</h4>
                          <p className="mb-3">Send the equivalent of ₦{amount.toLocaleString()} to the wallet address below:</p>
                          <div className="bg-black/30 p-2 rounded font-mono text-xs mb-3 break-all">
                            bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh
                          </div>
                          <p>After sending, please submit the transaction hash/ID below.</p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="txHash">Transaction Hash/ID</Label>
                          <Input id="txHash" placeholder="0x1234..." className="bg-purple-900/20 border-purple-500/30" />
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-4">
                    <Button 
                      onClick={handleSubmit} 
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-yellow-600 to-yellow-400 hover:from-yellow-500 hover:to-yellow-300 text-black font-bold"
                    >
                      {isSubmitting ? "Processing..." : "Submit Payment"}
                    </Button>
                    
                    <p className="text-xs text-center text-gray-400">
                      By submitting, you agree to our terms and conditions for VIP membership.
                      <br />Admin verification is required to complete the process.
                    </p>
                  </CardFooter>
                </Card>
              ) : (
                // Confirmation message
                <Card className="border-green-500/30 bg-black/60 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex justify-center mb-2">
                      <CheckCircle className="h-16 w-16 text-green-500" />
                    </div>
                    <CardTitle className="text-green-300 text-center">Payment Request Submitted</CardTitle>
                    <CardDescription className="text-center">Thank you for joining our VIP program</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-white mb-6">
                      Your payment request has been submitted and is now awaiting admin verification. 
                      This usually takes 1-24 hours to process.
                    </p>
                    
                    <div className="p-4 bg-purple-900/20 rounded-lg border border-purple-500/30 text-purple-200 text-sm mb-6">
                      <h4 className="font-bold mb-2">Payment Details:</h4>
                      <div className="grid grid-cols-2 gap-2 mb-1">
                        <span className="font-semibold">Amount:</span>
                        <span>₦{amount.toLocaleString()}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mb-1">
                        <span className="font-semibold">Method:</span>
                        <span>{paymentMethod === "bank" ? "Bank Transfer" : paymentMethod === "card" ? "Card Payment" : "Cryptocurrency"}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mb-1">
                        <span className="font-semibold">Reference ID:</span>
                        <span>{Math.random().toString(36).substring(2, 10).toUpperCase()}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mb-1">
                        <span className="font-semibold">Status:</span>
                        <span className="text-yellow-300">Pending Verification</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-400 text-sm">
                      You will receive a notification once your payment is verified by an admin.
                      After verification, you'll have full access to all VIP features.
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-center space-x-4">
                    <Button 
                      variant="outline" 
                      className="border-purple-500/30 text-purple-300 hover:bg-purple-900/20"
                      onClick={() => setShowConfirmation(false)}
                    >
                      Make Another Payment
                    </Button>
                    
                    <Link to="/dashboard">
                      <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500">
                        Go to Dashboard
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              )}
              
              {/* Return to login/dashboard buttons */}
              <div className="mt-8 text-center">
                {user ? (
                  <Link to="/dashboard">
                    <Button variant="link" className="text-purple-300 hover:text-purple-200">
                      <Phone className="mr-2 h-4 w-4" /> Return to Dashboard
                    </Button>
                  </Link>
                ) : (
                  <div className="space-x-4">
                    <Link to="/login">
                      <Button variant="link" className="text-purple-300 hover:text-purple-200">
                        Login to your account
                      </Button>
                    </Link>
                    <Link to="/register">
                      <Button variant="link" className="text-purple-300 hover:text-purple-200">
                        Register new account
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VIPAccess;