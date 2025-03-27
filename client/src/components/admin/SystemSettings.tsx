import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useSettings, useUpdateSettings, SystemSettings } from "@/hooks/useSettings";
import { useToast } from "@/hooks/use-toast";

const SystemSettingsComponent: React.FC = () => {
  const { toast } = useToast();
  const { data: settings, isLoading } = useSettings();
  const { mutate: updateSettings, isPending } = useUpdateSettings();
  
  const [formData, setFormData] = useState<Partial<SystemSettings>>({
    REFERRALS_NEEDED: "20",
    ADMIN_CODE: "vesta1212",
    KYC_REQUIRED_FOR_REFERRAL: "true",
    LOCAL_PAYMENT_ACCOUNT: "8121320468",
    OPAY_ENABLED: "true",
    KENO_ENABLED: "true",
    SITE_NAME: "EtherDoxShefZySMS",
    SITE_DESCRIPTION: "WhatsApp Number Service",
    CONTACT_EMAIL: "support@etherdoxshefzysms.com",
    MAINTENANCE_MODE: "false",
  });

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleInputChange = (key: keyof SystemSettings, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleToggleChange = (key: keyof SystemSettings, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [key]: checked ? "true" : "false" }));
  };

  const handleSaveReferralSettings = () => {
    updateSettings(
      {
        REFERRALS_NEEDED: formData.REFERRALS_NEEDED,
        ADMIN_CODE: formData.ADMIN_CODE,
        KYC_REQUIRED_FOR_REFERRAL: formData.KYC_REQUIRED_FOR_REFERRAL,
      },
      {
        onSuccess: () => {
          toast({
            title: "Referral Settings Saved",
            description: "Your referral system settings have been updated successfully.",
          });
        },
      }
    );
  };

  const handleSavePaymentSettings = () => {
    updateSettings(
      {
        LOCAL_PAYMENT_ACCOUNT: formData.LOCAL_PAYMENT_ACCOUNT,
        OPAY_ENABLED: formData.OPAY_ENABLED,
        KENO_ENABLED: formData.KENO_ENABLED,
      },
      {
        onSuccess: () => {
          toast({
            title: "Payment Settings Saved",
            description: "Your payment settings have been updated successfully.",
          });
        },
      }
    );
  };

  const handleSaveGeneralSettings = () => {
    updateSettings(
      {
        SITE_NAME: formData.SITE_NAME,
        SITE_DESCRIPTION: formData.SITE_DESCRIPTION,
        CONTACT_EMAIL: formData.CONTACT_EMAIL,
        MAINTENANCE_MODE: formData.MAINTENANCE_MODE,
      },
      {
        onSuccess: () => {
          toast({
            title: "General Settings Saved",
            description: "Your general settings have been updated successfully.",
          });
        },
      }
    );
  };

  if (isLoading) {
    return (
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
    );
  }

  return (
    <div className="space-y-6">
      {/* Referral Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Referral System Settings</CardTitle>
          <CardDescription>
            Configure how the referral system works on your platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="referrals-needed">Referrals Required for Free Number</Label>
              <Input
                id="referrals-needed"
                type="number"
                min="1"
                value={formData.REFERRALS_NEEDED}
                onChange={(e) => handleInputChange("REFERRALS_NEEDED", e.target.value)}
              />
              <p className="text-sm text-gray-500">
                Number of successful referrals a user needs to earn a free WhatsApp number
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin-code">Admin Referral Code</Label>
              <Input
                id="admin-code"
                value={formData.ADMIN_CODE}
                onChange={(e) => handleInputChange("ADMIN_CODE", e.target.value)}
              />
              <p className="text-sm text-gray-500">
                Special code to grant admin privileges during registration
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="kyc-referral"
                checked={formData.KYC_REQUIRED_FOR_REFERRAL === "true"}
                onCheckedChange={(checked) =>
                  handleToggleChange("KYC_REQUIRED_FOR_REFERRAL", checked)
                }
              />
              <Label htmlFor="kyc-referral">
                Require KYC verification before users can claim referral rewards
              </Label>
            </div>

            <Button
              onClick={handleSaveReferralSettings}
              disabled={isPending}
            >
              {isPending ? "Saving..." : "Save Referral Settings"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Payment Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Settings</CardTitle>
          <CardDescription>
            Configure payment methods and account numbers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="local-payment-account">Local Payment Account Number</Label>
              <Input
                id="local-payment-account"
                value={formData.LOCAL_PAYMENT_ACCOUNT}
                onChange={(e) => handleInputChange("LOCAL_PAYMENT_ACCOUNT", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="opay-enabled"
                  checked={formData.OPAY_ENABLED === "true"}
                  onCheckedChange={(checked) => handleToggleChange("OPAY_ENABLED", checked)}
                />
                <Label htmlFor="opay-enabled">Enable Opay as payment method</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="keno-enabled"
                  checked={formData.KENO_ENABLED === "true"}
                  onCheckedChange={(checked) => handleToggleChange("KENO_ENABLED", checked)}
                />
                <Label htmlFor="keno-enabled">Enable Keno as payment method</Label>
              </div>
            </div>

            <Button
              onClick={handleSavePaymentSettings}
              disabled={isPending}
            >
              {isPending ? "Saving..." : "Save Payment Settings"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>
            Configure general site settings and appearance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="site-name">Site Name</Label>
              <Input
                id="site-name"
                value={formData.SITE_NAME}
                onChange={(e) => handleInputChange("SITE_NAME", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="site-description">Site Description</Label>
              <Input
                id="site-description"
                value={formData.SITE_DESCRIPTION}
                onChange={(e) => handleInputChange("SITE_DESCRIPTION", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact-email">Contact Email</Label>
              <Input
                id="contact-email"
                type="email"
                value={formData.CONTACT_EMAIL}
                onChange={(e) => handleInputChange("CONTACT_EMAIL", e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="maintenance-mode"
                checked={formData.MAINTENANCE_MODE === "true"}
                onCheckedChange={(checked) =>
                  handleToggleChange("MAINTENANCE_MODE", checked)
                }
              />
              <Label htmlFor="maintenance-mode">
                Put the site in maintenance mode (only admins can access)
              </Label>
            </div>

            <Button
              onClick={handleSaveGeneralSettings}
              disabled={isPending}
            >
              {isPending ? "Saving..." : "Save General Settings"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemSettingsComponent;
