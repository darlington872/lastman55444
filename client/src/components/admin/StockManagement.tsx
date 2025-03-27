import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useAdminPhoneNumbers } from "@/hooks/usePhoneNumbers";
import { PhoneNumber } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const StockManagement: React.FC = () => {
  const { data: phoneNumbers, isLoading } = useAdminPhoneNumbers();
  const { toast } = useToast();
  
  const [country, setCountry] = useState("");
  const [price, setPrice] = useState("");
  const [numbers, setNumbers] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingNumber, setEditingNumber] = useState<PhoneNumber | null>(null);

  // Count available numbers by country
  const countryStats = React.useMemo(() => {
    if (!phoneNumbers) return {};
    
    const stats: Record<string, { total: number, available: number }> = {};
    
    phoneNumbers.forEach(pn => {
      if (!stats[pn.country]) {
        stats[pn.country] = { total: 0, available: 0 };
      }
      
      stats[pn.country].total += 1;
      if (pn.isAvailable) {
        stats[pn.country].available += 1;
      }
    });
    
    return stats;
  }, [phoneNumbers]);

  const totalAvailable = React.useMemo(() => {
    if (!phoneNumbers) return 0;
    return phoneNumbers.filter(pn => pn.isAvailable).length;
  }, [phoneNumbers]);

  const totalSold = React.useMemo(() => {
    if (!phoneNumbers) return 0;
    return phoneNumbers.filter(pn => !pn.isAvailable).length;
  }, [phoneNumbers]);

  const handleAddNumbers = async () => {
    if (!country || !price || !numbers) {
      toast({
        title: "Missing Information",
        description: "Country, price, and phone numbers are required",
        variant: "destructive",
      });
      return;
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      toast({
        title: "Invalid Price",
        description: "Price must be a positive number",
        variant: "destructive",
      });
      return;
    }

    // Split numbers by line
    const phoneNumbersList = numbers
      .split("\n")
      .map(n => n.trim())
      .filter(n => n.length > 0);

    if (phoneNumbersList.length === 0) {
      toast({
        title: "No Valid Numbers",
        description: "Please enter at least one phone number",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Create each phone number
      for (const number of phoneNumbersList) {
        await apiRequest("POST", "/api/admin/phone-numbers", {
          number,
          country,
          price: parsedPrice,
        });
      }
      
      // Reset form
      setCountry("");
      setPrice("");
      setNumbers("");
      setNotes("");
      
      // Invalidate and refetch the phone numbers query
      queryClient.invalidateQueries({ queryKey: ['/api/admin/phone-numbers'] });
      
      toast({
        title: "Numbers Added",
        description: `Successfully added ${phoneNumbersList.length} phone numbers to inventory`,
      });
    } catch (error) {
      toast({
        title: "Error Adding Numbers",
        description: error instanceof Error ? error.message : "An error occurred while adding numbers",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePhoneNumber = async (id: number) => {
    try {
      await apiRequest("DELETE", `/api/admin/phone-numbers/${id}`, {});
      
      // Invalidate and refetch the phone numbers query
      queryClient.invalidateQueries({ queryKey: ['/api/admin/phone-numbers'] });
      
      toast({
        title: "Number Deleted",
        description: "Phone number has been removed from inventory",
      });
    } catch (error) {
      toast({
        title: "Error Deleting Number",
        description: error instanceof Error ? error.message : "An error occurred while deleting the number",
        variant: "destructive",
      });
    }
  };

  const handleUpdatePhoneNumber = async (id: number, updates: Partial<PhoneNumber>) => {
    try {
      await apiRequest("PATCH", `/api/admin/phone-numbers/${id}`, updates);
      
      // Invalidate and refetch the phone numbers query
      queryClient.invalidateQueries({ queryKey: ['/api/admin/phone-numbers'] });
      
      setEditingNumber(null);
      
      toast({
        title: "Number Updated",
        description: "Phone number has been updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error Updating Number",
        description: error instanceof Error ? error.message : "An error occurred while updating the number",
        variant: "destructive",
      });
    }
  };

  const getCountryIcon = (country: string) => {
    const lowerCountry = country.toLowerCase();
    
    if (lowerCountry.includes("united states") || lowerCountry === "usa" || lowerCountry === "us") {
      return "fas fa-globe-americas";
    } else if (lowerCountry.includes("united kingdom") || lowerCountry === "uk" || lowerCountry === "gb") {
      return "fas fa-globe-europe";
    } else if (lowerCountry.includes("canada") || lowerCountry === "ca") {
      return "fas fa-globe-americas";
    } else if (lowerCountry.includes("australia") || lowerCountry === "au") {
      return "fas fa-globe-asia";
    } else if (lowerCountry.includes("germany") || lowerCountry === "de") {
      return "fas fa-globe-europe";
    } else if (lowerCountry.includes("south africa") || lowerCountry === "za") {
      return "fas fa-globe-africa";
    }
    
    return "fas fa-globe";
  };

  return (
    <>
      {/* Stock Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-warning-100 text-warning-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500 font-medium">Total Stock</p>
                <p className="text-xl font-semibold text-gray-800">
                  {isLoading ? "Loading..." : totalAvailable}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-success-100 text-success-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500 font-medium">Numbers Sold</p>
                <p className="text-xl font-semibold text-gray-800">
                  {isLoading ? "Loading..." : totalSold}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-primary-100 text-primary-800">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500 font-medium">Countries</p>
                <p className="text-xl font-semibold text-gray-800">
                  {isLoading ? "Loading..." : Object.keys(countryStats).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stock Inventory */}
      <Card className="mb-6">
        <CardHeader className="px-6 py-4 border-b border-gray-200">
          <CardTitle className="text-lg font-medium text-gray-800">Current Inventory</CardTitle>
        </CardHeader>
        <CardContent className="px-6 py-4">
          {isLoading ? (
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
              <p className="text-gray-500">No phone numbers in inventory yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Country
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Number
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Price
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {phoneNumbers.map((pn) => (
                    <tr key={pn.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <i className={`${getCountryIcon(pn.country)} text-gray-500 mr-2`}></i>
                          <div className="text-sm font-medium text-gray-900">
                            {editingNumber?.id === pn.id ? (
                              <Input
                                value={editingNumber.country}
                                onChange={e => setEditingNumber({
                                  ...editingNumber,
                                  country: e.target.value
                                })}
                                className="w-40"
                              />
                            ) : (
                              pn.country
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        {pn.number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        {editingNumber?.id === pn.id ? (
                          <Input
                            type="number"
                            value={editingNumber.price}
                            onChange={e => setEditingNumber({
                              ...editingNumber,
                              price: parseFloat(e.target.value)
                            })}
                            className="w-24"
                          />
                        ) : (
                          `$${pn.price.toFixed(2)}`
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingNumber?.id === pn.id ? (
                          <Select
                            value={editingNumber.isAvailable ? "true" : "false"}
                            onValueChange={value => setEditingNumber({
                              ...editingNumber,
                              isAvailable: value === "true"
                            })}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="true">In Stock</SelectItem>
                              <SelectItem value="false">Out of Stock</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              pn.isAvailable
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {pn.isAvailable ? "In Stock" : "Out of Stock"}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {editingNumber?.id === pn.id ? (
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              onClick={() => handleUpdatePhoneNumber(pn.id, {
                                country: editingNumber.country,
                                price: editingNumber.price,
                                isAvailable: editingNumber.isAvailable
                              })}
                            >
                              Save
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => setEditingNumber(null)}
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => setEditingNumber(pn)}
                            >
                              Edit
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive" 
                              onClick={() => handleDeletePhoneNumber(pn.id)}
                            >
                              Remove
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add New Numbers Form */}
      <Card>
        <CardHeader className="px-6 py-4 border-b border-gray-200">
          <CardTitle className="text-lg font-medium text-gray-800">Add New Numbers</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="country">Country</Label>
                <Select
                  value={country}
                  onValueChange={setCountry}
                >
                  <SelectTrigger id="country" className="w-full">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="United States">United States</SelectItem>
                    <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                    <SelectItem value="Canada">Canada</SelectItem>
                    <SelectItem value="Australia">Australia</SelectItem>
                    <SelectItem value="Germany">Germany</SelectItem>
                    <SelectItem value="South Africa">South Africa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="price">Price (USD)</Label>
                <div className="mt-1 relative rounded-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    className="pl-7"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="phone-numbers">Phone Numbers (One per line)</Label>
              <Textarea
                id="phone-numbers"
                rows={6}
                placeholder="+1234567890&#10;+0987654321"
                value={numbers}
                onChange={(e) => setNumbers(e.target.value)}
              />
              <p className="mt-1 text-sm text-gray-500">
                Enter each number on a new line. Include country code.
              </p>
            </div>

            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Input
                id="notes"
                placeholder="Any additional information about these numbers"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <div>
              <Button
                onClick={handleAddNumbers}
                disabled={isSubmitting || !country || !price || !numbers}
              >
                {isSubmitting ? "Adding..." : "Add to Inventory"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default StockManagement;
