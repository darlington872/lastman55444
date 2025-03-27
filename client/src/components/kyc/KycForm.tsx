import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSubmitKyc } from "@/hooks/useKyc";

const kycSchema = z.object({
  fullName: z.string().min(2, { message: "Full name is required" }),
  address: z.string().min(5, { message: "Address is required" }),
  city: z.string().min(2, { message: "City is required" }),
  postalCode: z.string().min(3, { message: "Postal code is required" }),
  country: z.string().min(2, { message: "Country is required" }),
  idType: z.string().min(1, { message: "ID type is required" }),
  idFront: z.string().min(1, { message: "Front ID image is required" }),
  idBack: z.string().min(1, { message: "Back ID image is required" }),
  selfie: z.string().min(1, { message: "Selfie image is required" }),
  agree: z.boolean().refine(val => val === true, {
    message: "You must confirm that the information is accurate",
  }),
});

type KycFormValues = z.infer<typeof kycSchema>;

const KycForm: React.FC = () => {
  const { mutate: submitKyc, isPending } = useSubmitKyc();
  const [idFrontPreview, setIdFrontPreview] = useState<string | null>(null);
  const [idBackPreview, setIdBackPreview] = useState<string | null>(null);
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);

  const form = useForm<KycFormValues>({
    resolver: zodResolver(kycSchema),
    defaultValues: {
      fullName: "",
      address: "",
      city: "",
      postalCode: "",
      country: "",
      idType: "",
      idFront: "",
      idBack: "",
      selfie: "",
      agree: false,
    },
  });

  // In a real application, we would upload these images to a server
  // For this implementation, we'll use base64 encoding which isn't ideal for production
  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    fieldName: "idFront" | "idBack" | "selfie"
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      
      // Update form value
      form.setValue(fieldName, base64String);
      
      // Set preview
      if (fieldName === "idFront") {
        setIdFrontPreview(base64String);
      } else if (fieldName === "idBack") {
        setIdBackPreview(base64String);
      } else if (fieldName === "selfie") {
        setSelfiePreview(base64String);
      }
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = (values: KycFormValues) => {
    // Remove the agree field before submission
    const { agree, ...kycData } = values;
    submitKyc(kycData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-purple-300">Full Legal Name</FormLabel>
              <FormControl>
                <Input 
                  placeholder="As shown on your ID" 
                  {...field} 
                  className="border-purple-800/30 bg-purple-900/10 text-white placeholder:text-purple-500/70 focus:ring-purple-500/50"
                />
              </FormControl>
              <FormMessage className="text-pink-400" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-purple-300">Address</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Your current address" 
                  {...field} 
                  className="border-purple-800/30 bg-purple-900/10 text-white placeholder:text-purple-500/70 focus:ring-purple-500/50"
                />
              </FormControl>
              <FormMessage className="text-pink-400" />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-purple-300">City</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    className="border-purple-800/30 bg-purple-900/10 text-white placeholder:text-purple-500/70 focus:ring-purple-500/50"
                  />
                </FormControl>
                <FormMessage className="text-pink-400" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="postalCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-purple-300">Postal Code</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    className="border-purple-800/30 bg-purple-900/10 text-white placeholder:text-purple-500/70 focus:ring-purple-500/50"
                  />
                </FormControl>
                <FormMessage className="text-pink-400" />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-purple-300">Country</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="border-purple-800/30 bg-purple-900/10 text-white">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-gray-900 border border-purple-800/30 text-white">
                  <SelectItem value="us" className="focus:bg-purple-900/20">United States</SelectItem>
                  <SelectItem value="gb" className="focus:bg-purple-900/20">United Kingdom</SelectItem>
                  <SelectItem value="ca" className="focus:bg-purple-900/20">Canada</SelectItem>
                  <SelectItem value="au" className="focus:bg-purple-900/20">Australia</SelectItem>
                  <SelectItem value="de" className="focus:bg-purple-900/20">Germany</SelectItem>
                  <SelectItem value="fr" className="focus:bg-purple-900/20">France</SelectItem>
                  <SelectItem value="ng" className="focus:bg-purple-900/20">Nigeria</SelectItem>
                  <SelectItem value="za" className="focus:bg-purple-900/20">South Africa</SelectItem>
                  <SelectItem value="in" className="focus:bg-purple-900/20">India</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage className="text-pink-400" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="idType"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-purple-300">ID Document Type</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="border-purple-800/30 bg-purple-900/10 text-white">
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-gray-900 border border-purple-800/30 text-white">
                  <SelectItem value="passport" className="focus:bg-purple-900/20">Passport</SelectItem>
                  <SelectItem value="driving_license" className="focus:bg-purple-900/20">Driving License</SelectItem>
                  <SelectItem value="id_card" className="focus:bg-purple-900/20">National ID Card</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage className="text-pink-400" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="idFront"
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <FormLabel className="text-purple-300">ID Document (Front)</FormLabel>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border border-purple-800/30 border-dashed rounded-md bg-purple-900/10">
                {idFrontPreview ? (
                  <div className="text-center">
                    <img
                      src={idFrontPreview}
                      alt="ID Front"
                      className="mx-auto h-36 object-cover mb-3 rounded-md border border-purple-500/20"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIdFrontPreview(null);
                        onChange("");
                      }}
                      className="border-purple-500/30 text-purple-400 hover:bg-purple-900/20 hover:text-purple-300"
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-purple-500/50"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-purple-300 justify-center">
                      <label
                        htmlFor="id-front"
                        className="relative cursor-pointer rounded-md font-medium text-purple-400 hover:text-purple-300 focus-within:outline-none"
                      >
                        <span className="underline decoration-dotted">Upload file</span>
                        <input
                          id="id-front"
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, "idFront")}
                          {...field}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-purple-400/70">PNG, JPG, PDF up to 5MB</p>
                  </div>
                )}
              </div>
              <FormMessage className="text-pink-400" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="idBack"
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <FormLabel className="text-purple-300">ID Document (Back)</FormLabel>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border border-purple-800/30 border-dashed rounded-md bg-purple-900/10">
                {idBackPreview ? (
                  <div className="text-center">
                    <img
                      src={idBackPreview}
                      alt="ID Back"
                      className="mx-auto h-36 object-cover mb-3 rounded-md border border-purple-500/20"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIdBackPreview(null);
                        onChange("");
                      }}
                      className="border-purple-500/30 text-purple-400 hover:bg-purple-900/20 hover:text-purple-300"
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-purple-500/50"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-purple-300 justify-center">
                      <label
                        htmlFor="id-back"
                        className="relative cursor-pointer rounded-md font-medium text-purple-400 hover:text-purple-300 focus-within:outline-none"
                      >
                        <span className="underline decoration-dotted">Upload file</span>
                        <input
                          id="id-back"
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, "idBack")}
                          {...field}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-purple-400/70">PNG, JPG, PDF up to 5MB</p>
                  </div>
                )}
              </div>
              <FormMessage className="text-pink-400" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="selfie"
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <FormLabel className="text-purple-300">Selfie with ID</FormLabel>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border border-purple-800/30 border-dashed rounded-md bg-purple-900/10">
                {selfiePreview ? (
                  <div className="text-center">
                    <img
                      src={selfiePreview}
                      alt="Selfie"
                      className="mx-auto h-36 object-cover mb-3 rounded-md border border-purple-500/20"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelfiePreview(null);
                        onChange("");
                      }}
                      className="border-purple-500/30 text-purple-400 hover:bg-purple-900/20 hover:text-purple-300"
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-purple-500/50"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-purple-300 justify-center">
                      <label
                        htmlFor="selfie-input"
                        className="relative cursor-pointer rounded-md font-medium text-purple-400 hover:text-purple-300 focus-within:outline-none"
                      >
                        <span className="underline decoration-dotted">Upload file</span>
                        <input
                          id="selfie-input"
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, "selfie")}
                          {...field}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-purple-400/70">PNG, JPG up to 5MB</p>
                  </div>
                )}
              </div>
              <FormMessage className="text-pink-400" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="agree"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-3 border border-purple-800/20 bg-purple-900/10">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="border-purple-500 data-[state=checked]:bg-purple-500 data-[state=checked]:text-white"
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-purple-300">
                  I confirm that the information provided is accurate and authentic
                </FormLabel>
                <FormMessage className="text-pink-400" />
              </div>
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full mt-4 bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white border-none h-12 text-lg font-bold" 
          disabled={isPending}
        >
          {isPending ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 relative animate-spin">
                <div className="absolute inset-0 rounded-full border-2 border-t-transparent border-r-transparent border-white"></div>
              </div>
              <span>Processing...</span>
            </div>
          ) : (
            <span>Submit Verification</span>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default KycForm;
