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
  const [service, setService] = useState("WhatsApp");
  const [numbers, setNumbers] = useState("");
  const [stockCount, setStockCount] = useState("1");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingNumber, setEditingNumber] = useState<PhoneNumber | null>(null);
  const [bulkMode, setBulkMode] = useState(false);

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

    let phoneNumbersList: string[] = [];
    
    if (bulkMode) {
      // Handle bulk mode
      const baseNumber = numbers.trim();
      const count = parseInt(stockCount);
      
      if (!baseNumber.match(/^\+?[0-9]+$/)) {
        toast({
          title: "Invalid Base Number",
          description: "Please enter a valid phone number with country code",
          variant: "destructive",
        });
        return;
      }
      
      if (isNaN(count) || count <= 0 || count > 100) {
        toast({
          title: "Invalid Count",
          description: "Please enter a valid count between 1 and 100",
          variant: "destructive",
        });
        return;
      }
      
      // Extract the numerical part to increment
      const baseDigits = baseNumber.replace(/\D/g, '');
      const countryCode = baseNumber.replace(baseDigits, '');
      
      // Show generation notification
      toast({
        title: "Generating Numbers",
        description: `Creating ${count} sequential numbers starting from ${baseNumber}`,
      });
      
      // Generate sequential numbers
      for (let i = 0; i < count; i++) {
        const incrementedDigits = (parseInt(baseDigits) + i).toString().padStart(baseDigits.length, '0');
        phoneNumbersList.push(`${countryCode}${incrementedDigits}`);
      }
    } else {
      // Regular mode - split numbers by line
      phoneNumbersList = numbers
        .split("\n")
        .map(n => n.trim())
        .filter(n => n.length > 0);
    }

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
          service: service,
          notes
        });
      }
      
      // Reset form
      setCountry("");
      setPrice("");
      setNumbers("");
      setNotes("");
      if (bulkMode) {
        setStockCount("1");
      }
      
      // Invalidate and refetch the phone numbers query
      queryClient.invalidateQueries({ queryKey: ['/api/admin/phone-numbers'] });
      
      toast({
        title: "Numbers Added",
        description: `Successfully added ${phoneNumbersList.length} phone numbers to inventory`
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
        <Card className="bg-black border border-purple-600/30 backdrop-blur-md shadow-lg overflow-hidden">
          <CardContent className="p-6 bg-gradient-to-br from-black via-purple-950/20 to-black">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-800/30 text-purple-300 border border-purple-600/20 shadow-inner">
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
                <p className="text-sm text-purple-300 font-medium">Total Stock</p>
                <p className="text-xl font-bold vibrant-gradient-text">
                  {isLoading ? "Loading..." : totalAvailable}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black border border-indigo-600/30 backdrop-blur-md shadow-lg overflow-hidden">
          <CardContent className="p-6 bg-gradient-to-br from-black via-indigo-950/20 to-black">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-indigo-800/30 text-indigo-300 border border-indigo-600/20 shadow-inner">
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
                <p className="text-sm text-indigo-300 font-medium">Numbers Sold</p>
                <p className="text-xl font-bold vibrant-gradient-text">
                  {isLoading ? "Loading..." : totalSold}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black border border-fuchsia-600/30 backdrop-blur-md shadow-lg overflow-hidden">
          <CardContent className="p-6 bg-gradient-to-br from-black via-fuchsia-950/20 to-black">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-fuchsia-800/30 text-fuchsia-300 border border-fuchsia-600/20 shadow-inner">
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
                <p className="text-sm text-fuchsia-300 font-medium">Countries</p>
                <p className="text-xl font-bold vibrant-gradient-text">
                  {isLoading ? "Loading..." : Object.keys(countryStats).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stock Inventory */}
      <Card className="mb-6 bg-black border border-purple-600/30 backdrop-blur-md shadow-lg overflow-hidden">
        <CardHeader className="px-6 py-4 border-b border-purple-600/30 bg-gradient-to-r from-purple-900/40 to-black">
          <CardTitle className="text-lg font-medium text-white">Current Inventory</CardTitle>
        </CardHeader>
        <CardContent className="p-0 bg-gradient-to-b from-black to-purple-950/10">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <svg
                className="animate-spin h-8 w-8 text-purple-500"
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
              <p className="text-gray-400">No phone numbers in inventory yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-900/60 border-b border-purple-600/20">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider"
                    >
                      Country
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider"
                    >
                      Number
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider"
                    >
                      Service
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider"
                    >
                      Price
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-black divide-y divide-purple-900/20">
                  {phoneNumbers.map((pn) => (
                    <tr key={pn.id} className="hover:bg-purple-900/10">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <i className={`${getCountryIcon(pn.country)} text-purple-400 mr-2`}></i>
                          <div className="text-sm font-medium text-purple-100">
                            {editingNumber?.id === pn.id ? (
                              <Input
                                value={editingNumber.country}
                                onChange={e => setEditingNumber({
                                  ...editingNumber,
                                  country: e.target.value
                                })}
                                className="w-40 bg-gray-900 border-purple-600/30 text-white"
                              />
                            ) : (
                              pn.country
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-100">
                        {pn.number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-md bg-indigo-900/40 text-indigo-300 border border-indigo-700/30">
                          {pn.service || "WhatsApp"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-100">
                        {editingNumber?.id === pn.id ? (
                          <Input
                            type="number"
                            value={editingNumber.price}
                            onChange={e => setEditingNumber({
                              ...editingNumber,
                              price: parseFloat(e.target.value)
                            })}
                            className="w-24 bg-gray-900 border-purple-600/30 text-white"
                          />
                        ) : (
                          `₦${pn.price.toFixed(2)}`
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
                            <SelectTrigger className="w-32 bg-gray-900 border-purple-600/30 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-900 text-white border-purple-600/30">
                              <SelectItem value="true">In Stock</SelectItem>
                              <SelectItem value="false">Out of Stock</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-md ${
                              pn.isAvailable
                                ? "bg-green-900/40 text-green-300 border border-green-700/30"
                                : "bg-red-900/40 text-red-300 border border-red-700/30"
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
                                isAvailable: editingNumber.isAvailable,
                                service: editingNumber.service
                              })}
                              className="bg-purple-700 hover:bg-purple-600 text-white border-none"
                            >
                              Save
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => setEditingNumber(null)}
                              className="border-purple-600/50 text-purple-300 hover:bg-purple-900/30"
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
                              className="border-purple-600/50 text-purple-300 hover:bg-purple-900/30"
                            >
                              Edit
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive" 
                              onClick={() => handleDeletePhoneNumber(pn.id)}
                              className="bg-red-900/80 hover:bg-red-800 text-white border-none"
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
      <Card className="bg-black/95 border border-purple-600/30 backdrop-blur-md shadow-lg overflow-hidden">
        <CardHeader className="px-6 py-4 border-b border-purple-600/30 bg-gradient-to-r from-purple-900/40 to-black">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-medium text-white">Add New Numbers</CardTitle>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-300">Bulk Mode</span>
              <button 
                type="button"
                onClick={() => setBulkMode(!bulkMode)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${bulkMode ? 'bg-gradient-to-r from-purple-600 to-fuchsia-500' : 'bg-gray-800'}`}
                aria-pressed={bulkMode}
              >
                <span className="sr-only">Toggle bulk mode</span>
                <span 
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${bulkMode ? 'translate-x-5' : 'translate-x-0'}`}
                />
              </button>
              <span className={`text-xs ${bulkMode ? 'text-fuchsia-300 font-bold' : 'text-gray-400'}`}>
                {bulkMode ? 'ON' : 'OFF'}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 bg-gradient-to-b from-black to-purple-950/20">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="country" className="text-gray-200">Country</Label>
                <Select
                  value={country}
                  onValueChange={setCountry}
                >
                  <SelectTrigger id="country" className="w-full bg-gray-900 border-purple-600/30 text-white">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 text-white border-purple-600/30">
                    <SelectItem value="United States">United States</SelectItem>
                    <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                    <SelectItem value="Canada">Canada</SelectItem>
                    <SelectItem value="Australia">Australia</SelectItem>
                    <SelectItem value="Germany">Germany</SelectItem>
                    <SelectItem value="South Africa">South Africa</SelectItem>
                    <SelectItem value="Nigeria">Nigeria</SelectItem>
                    <SelectItem value="Ghana">Ghana</SelectItem>
                    <SelectItem value="Kenya">Kenya</SelectItem>
                    <SelectItem value="India">India</SelectItem>
                    <SelectItem value="France">France</SelectItem>
                    <SelectItem value="Spain">Spain</SelectItem>
                    <SelectItem value="Italy">Italy</SelectItem>
                    <SelectItem value="Japan">Japan</SelectItem>
                    <SelectItem value="China">China</SelectItem>
                    <SelectItem value="Brazil">Brazil</SelectItem>
                    <SelectItem value="Mexico">Mexico</SelectItem>
                    <SelectItem value="Russia">Russia</SelectItem>
                    <SelectItem value="Indonesia">Indonesia</SelectItem>
                    <SelectItem value="Pakistan">Pakistan</SelectItem>
                    <SelectItem value="Bangladesh">Bangladesh</SelectItem>
                    <SelectItem value="Philippines">Philippines</SelectItem>
                    <SelectItem value="Vietnam">Vietnam</SelectItem>
                    <SelectItem value="Turkey">Turkey</SelectItem>
                    <SelectItem value="Egypt">Egypt</SelectItem>
                    <SelectItem value="South Korea">South Korea</SelectItem>
                    <SelectItem value="Thailand">Thailand</SelectItem>
                    <SelectItem value="Argentina">Argentina</SelectItem>
                    <SelectItem value="Colombia">Colombia</SelectItem>
                    <SelectItem value="Malaysia">Malaysia</SelectItem>
                    <SelectItem value="Saudi Arabia">Saudi Arabia</SelectItem>
                    <SelectItem value="Singapore">Singapore</SelectItem>
                    <SelectItem value="United Arab Emirates">United Arab Emirates</SelectItem>
                    <SelectItem value="Cameroon">Cameroon</SelectItem>
                    <SelectItem value="Uganda">Uganda</SelectItem>
                    <SelectItem value="Tanzania">Tanzania</SelectItem>
                    <SelectItem value="Zambia">Zambia</SelectItem>
                    <SelectItem value="Zimbabwe">Zimbabwe</SelectItem>
                    <SelectItem value="Morocco">Morocco</SelectItem>
                    <SelectItem value="Algeria">Algeria</SelectItem>
                    <SelectItem value="Tunisia">Tunisia</SelectItem>
                    <SelectItem value="Libya">Libya</SelectItem>
                    <SelectItem value="Ethiopia">Ethiopia</SelectItem>
                    <SelectItem value="Somalia">Somalia</SelectItem>
                    <SelectItem value="Sudan">Sudan</SelectItem>
                    <SelectItem value="Angola">Angola</SelectItem>
                    <SelectItem value="Mozambique">Mozambique</SelectItem>
                    <SelectItem value="Namibia">Namibia</SelectItem>
                    <SelectItem value="Botswana">Botswana</SelectItem>
                    <SelectItem value="Côte d'Ivoire">Côte d'Ivoire</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="price" className="text-gray-200">Price (₦)</Label>
                <div className="mt-1 relative rounded-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-purple-300 sm:text-sm">₦</span>
                  </div>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    className="pl-7 bg-gray-900 border-purple-600/30 text-white"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="service-type" className="text-gray-200">Service Type</Label>
                <Select
                  value={service}
                  onValueChange={setService}
                >
                  <SelectTrigger id="service-type" className="w-full bg-gray-900 border-purple-600/30 text-white">
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 text-white border-purple-600/30">
                    <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                    <SelectItem value="Telegram">Telegram</SelectItem>
                    <SelectItem value="Signal">Signal</SelectItem>
                    <SelectItem value="WeChat">WeChat</SelectItem>
                    <SelectItem value="Viber">Viber</SelectItem>
                    <SelectItem value="Line">Line</SelectItem>
                    <SelectItem value="KakaoTalk">KakaoTalk</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {bulkMode && (
                <div>
                  <Label htmlFor="stock-count" className="text-gray-200">Total in Stock</Label>
                  <Input
                    id="stock-count"
                    type="number"
                    min="1"
                    placeholder="Number of items to add"
                    className="bg-gray-900 border-purple-600/30 text-white"
                    value={stockCount}
                    onChange={(e) => setStockCount(e.target.value)}
                  />
                  <p className="mt-1 text-sm text-purple-300">
                    This will create multiple entries with sequential numbers
                  </p>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="phone-numbers" className="text-gray-200">
                {bulkMode ? "Base Phone Number" : "Phone Numbers (One per line)"}
              </Label>
              <Textarea
                id="phone-numbers"
                rows={bulkMode ? 2 : 6}
                placeholder={bulkMode ? "+1234567890" : "+1234567890\n+0987654321"}
                value={numbers}
                onChange={(e) => setNumbers(e.target.value)}
                className="bg-gray-900 border-purple-600/30 text-white"
              />
              <p className="mt-1 text-sm text-purple-300">
                {bulkMode ? 
                  "Enter a base number. System will generate sequential numbers." : 
                  "Enter each number on a new line. Include country code."}
              </p>
            </div>

            <div>
              <Label htmlFor="notes" className="text-gray-200">Notes (Optional)</Label>
              <Input
                id="notes"
                placeholder="Any additional information about these numbers"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="bg-gray-900 border-purple-600/30 text-white"
              />
            </div>

            <div>
              <Button
                onClick={handleAddNumbers}
                disabled={isSubmitting || !country || !price || !numbers}
                className="bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-white border-none"
              >
                {isSubmitting ? "Adding..." : bulkMode ? `Add ${stockCount} Numbers` : "Add to Inventory"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default StockManagement;
