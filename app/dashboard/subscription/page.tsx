"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";
import { Check, X, CreditCard, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { SubscriptionForm } from "@/components/dashboard/subscription/subscription-form";
import { PaymentMethodForm } from "@/components/dashboard/subscription/payment-method-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserRoleGate } from "@/components/auth/user-role-gate";
import { AdminSubscriptionView } from "@/components/dashboard/subscription/admin-subscription-view";
import { UserSubscriptionView } from "@/components/dashboard/subscription/user-subscription-view";
import { useCurrentUserQuery } from "@/hooks/use-user";
import { useSubscriptionsQuery } from "@/hooks/use-subscription";

export default function SubscriptionPage() {
  const {
    data: user,
    isLoading: userLoading,
    isError: userError,
  } = useCurrentUserQuery();
  const {
    data: subscriptions = [],
    isLoading: subLoading,
    isError: subError,
  } = useSubscriptionsQuery();

  // Find the current user's subscription (assuming one per user)
  const subscription = subscriptions.find((s) => s.user_id === user?.id);

  // Map UserProfile to User type expected by the views
  const mappedUser = user
    ? {
        ...user,
        name: user.full_name || user.email || "User",
        image: user.image ?? undefined,
      }
    : null;

  if (userLoading || subLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  if (userError || subError) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <X className="h-8 w-8 text-destructive mb-2" />
        <p className="text-lg font-medium mb-1">
          Failed to load subscription data
        </p>
        <p className="text-sm text-muted-foreground">Please try again later.</p>
      </div>
    );
  }

  const plans = [
    {
      name: "Free",
      description: "For individuals getting started with eVet",
      price: "$0",
      period: "forever",
      features: [
        { text: "100 API calls per month", included: true },
        { text: "10 diagnoses per month", included: true },
        { text: "Basic support", included: true },
        { text: "1 API key", included: true },
        { text: "Unlimited team members", included: false },
        { text: "Advanced analytics", included: false },
        { text: "Priority support", included: false },
      ],
      current: subscription?.plan_name === "free",
    },
    {
      name: "Pro",
      description: "For veterinary practices and small teams",
      price: "$49",
      period: "per month",
      features: [
        { text: "1,000 API calls per month", included: true },
        { text: "100 diagnoses per month", included: true },
        { text: "Priority support", included: true },
        { text: "5 API keys", included: true },
        { text: "Unlimited team members", included: true },
        { text: "Advanced analytics", included: true },
        { text: "Custom integrations", included: false },
      ],
      current: subscription?.plan_name === "pro",
      popular: true,
    },
    {
      name: "Enterprise",
      description: "For large organizations with custom needs",
      price: "Contact us",
      period: "custom pricing",
      features: [
        { text: "Unlimited API calls", included: true },
        { text: "Unlimited diagnoses", included: true },
        { text: "24/7 dedicated support", included: true },
        { text: "Unlimited API keys", included: true },
        { text: "Unlimited team members", included: true },
        { text: "Advanced analytics", included: true },
        { text: "Custom integrations", included: true },
      ],
      current: subscription?.plan_name === "enterprise",
    },
  ];

  return (
    <DashboardShell>
      <UserRoleGate allowedRoles={["admin"]}>
        <AdminSubscriptionView user={mappedUser} />
      </UserRoleGate>

      <UserRoleGate allowedRoles={["user", "org_admin"]}>
        <UserSubscriptionView user={mappedUser} />
      </UserRoleGate>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Billing Information</CardTitle>
            <CardDescription>
              Manage your billing information and payment methods
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Current Plan</h3>
                  <div className="rounded-lg border p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium capitalize">
                          {subscription?.plan_name || "Free"} Plan
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {subscription?.plan_name === "free"
                            ? "100 API calls per month"
                            : subscription?.plan_name === "pro"
                            ? "1,000 API calls per month"
                            : subscription?.plan_name === "enterprise"
                            ? "Unlimited API calls"
                            : ""}
                        </p>
                      </div>
                      <Badge variant="outline" className="capitalize">
                        {subscription?.status || "Active"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Payment Method</h3>
                  <div className="rounded-lg border p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        {/* Replace with real payment method info if available */}
                        <p className="font-medium">No payment method</p>
                        <p className="text-xs text-muted-foreground">
                          Add a payment method to upgrade your plan
                        </p>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            Add
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add Payment Method</DialogTitle>
                            <DialogDescription>
                              Add a payment method to upgrade your plan.
                            </DialogDescription>
                          </DialogHeader>
                          <PaymentMethodForm userId={user?.id || ""} />
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Billing History</h3>
                <div className="rounded-lg border">
                  {subscription?.plan_name !== "free" ? (
                    <div className="divide-y">
                      <div className="flex items-center justify-between p-4">
                        <div>
                          <p className="font-medium">Pro Plan - Monthly</p>
                          <p className="text-xs text-muted-foreground">
                            Dec 1, 2023
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">$49.00</p>
                          <p className="text-xs text-green-600">Paid</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-4">
                        <div>
                          <p className="font-medium">Pro Plan - Monthly</p>
                          <p className="text-xs text-muted-foreground">
                            Nov 1, 2023
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">$49.00</p>
                          <p className="text-xs text-green-600">Paid</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-sm text-muted-foreground">
                        No billing history available
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
