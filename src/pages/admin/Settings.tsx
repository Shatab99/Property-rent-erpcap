import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building2, Upload, Save, Key, Shield, Palette } from "lucide-react";

export default function Settings() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Configure your property rental agency settings
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Agency Information */}
        <Card className="admin-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Agency Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="agency-name">Agency Name</Label>
              <Input id="agency-name" placeholder="Property Solutions Inc." />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="agency-logo">Agency Logo</Label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                  <Building2 className="h-8 w-8 text-muted-foreground" />
                </div>
                <Button variant="outline">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Logo
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" placeholder="+1 (555) 123-4567" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Contact Email</Label>
                <Input id="email" type="email" placeholder="contact@agency.com" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Business Address</Label>
              <Textarea id="address" placeholder="123 Business Ave, Suite 100&#10;City, State 12345" rows={3} />
            </div>
          </CardContent>
        </Card>

        {/* Payment Settings */}
        <Card className="admin-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Payment Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Supported Payment Methods</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch id="credit-cards" defaultChecked />
                  <Label htmlFor="credit-cards">Credit/Debit Cards</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="bank-transfer" defaultChecked />
                  <Label htmlFor="bank-transfer">Bank Transfer</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="paypal" />
                  <Label htmlFor="paypal">PayPal</Label>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="stripe-key">Stripe Publishable Key</Label>
              <Input id="stripe-key" placeholder="pk_live_..." type="password" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="paypal-client">PayPal Client ID</Label>
              <Input id="paypal-client" placeholder="Client ID" type="password" />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="admin-card">
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium">Email Notifications</Label>
                <div className="space-y-2 mt-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="new-inquiries" defaultChecked />
                    <Label htmlFor="new-inquiries">New inquiries</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="new-users" defaultChecked />
                    <Label htmlFor="new-users">New user registrations</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="property-updates" />
                    <Label htmlFor="property-updates">Property status updates</Label>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <Label className="text-base font-medium">SMS Notifications</Label>
                <div className="space-y-2 mt-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="urgent-inquiries" />
                    <Label htmlFor="urgent-inquiries">Urgent inquiries</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="payment-alerts" defaultChecked />
                    <Label htmlFor="payment-alerts">Payment alerts</Label>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Property Preferences */}
        <Card className="admin-card">
          <CardHeader>
            <CardTitle>Property Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currency">Default Currency</Label>
                <Select defaultValue="usd">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usd">USD ($)</SelectItem>
                    <SelectItem value="eur">EUR (€)</SelectItem>
                    <SelectItem value="gbp">GBP (£)</SelectItem>
                    <SelectItem value="cad">CAD ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rent-duration">Default Rent Duration</Label>
                <Select defaultValue="monthly">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Property Types</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch id="apartments" defaultChecked />
                  <Label htmlFor="apartments">Apartments</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="houses" defaultChecked />
                  <Label htmlFor="houses">Houses</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="commercial" defaultChecked />
                  <Label htmlFor="commercial">Commercial Spaces</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="land" />
                  <Label htmlFor="land">Land/Lots</Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="admin-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input id="current-password" type="password" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input id="new-password" type="password" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input id="confirm-password" type="password" />
            </div>
          </CardContent>
        </Card>

        {/* Website Preferences */}
        <Card className="admin-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Website Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="theme-mode">Theme Mode</Label>
              <Select defaultValue="light">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="favicon">Favicon</Label>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </div>
                <Button variant="outline" size="sm">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Favicon
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact-email">Support Email</Label>
              <Input id="contact-email" placeholder="support@agency.com" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button className="admin-button-primary">
          <Save className="mr-2 h-4 w-4" />
          Save All Settings
        </Button>
      </div>
    </div>
  );
}