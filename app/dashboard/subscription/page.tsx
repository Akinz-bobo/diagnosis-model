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
import { Check, X, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { getCurrentUser } from "@/lib/auth";
import { getSubscription } from "@/lib/actions/subscriptions";
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

export default async function SubscriptionPage() {
  const user = await getCurrentUser();
  const subscription = await getSubscription(user?.id || "");

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
      current: subscription?.plan === "free",
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
      current: subscription?.plan === "pro",
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
      current: subscription?.plan === "enterprise",
    },
  ];

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Subscription"
        text="Manage your subscription and billing information."
        breadcrumb={[
          { title: "Dashboard", href: "/dashboard" },
          { title: "Subscription", href: "/dashboard/subscription" },
        ]}
      />

      <div className="grid gap-6">
        <div className="grid gap-4 md:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={cn(
                "flex flex-col",
                plan.popular && "border-teal-600 shadow-md"
              )}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{plan.name}</CardTitle>
                  {plan.popular && (
                    <Badge className="bg-teal-600">Popular</Badge>
                  )}
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="mb-4">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-sm text-muted-foreground ml-1">
                    {plan.period}
                  </span>
                </div>

                <ul className="space-y-2 text-sm">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      {feature.included ? (
                        <Check className="mr-2 h-4 w-4 text-teal-600" />
                      ) : (
                        <X className="mr-2 h-4 w-4 text-slate-400" />
                      )}
                      <span
                        className={cn(
                          !feature.included && "text-muted-foreground"
                        )}
                      >
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                {plan.current ? (
                  <Button className="w-full" variant="outline" disabled>
                    Current Plan
                  </Button>
                ) : (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-teal-600 hover:bg-teal-700">
                        {plan.name === "Enterprise"
                          ? "Contact Sales"
                          : "Upgrade"}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Upgrade to {plan.name}</DialogTitle>
                        <DialogDescription>
                          {plan.name === "Enterprise"
                            ? "Please fill out this form to contact our sales team."
                            : `Upgrade to the ${plan.name} plan to get more features and higher limits.`}
                        </DialogDescription>
                      </DialogHeader>
                      <SubscriptionForm
                        userId={user?.id || ""}
                        plan={plan.name.toLowerCase()}
                      />
                    </DialogContent>
                  </Dialog>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>

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
                          {subscription?.plan || "Free"} Plan
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {subscription?.plan === "free"
                            ? "100 API calls per month"
                            : subscription?.plan === "pro"
                            ? "1,000 API calls per month"
                            : "Unlimited API calls"}
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
                        {subscription?.paymentMethod ? (
                          <>
                            <p className="font-medium">Visa ending in 4242</p>
                            <p className="text-xs text-muted-foreground">
                              Expires 12/2025
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="font-medium">No payment method</p>
                            <p className="text-xs text-muted-foreground">
                              Add a payment method to upgrade your plan
                            </p>
                          </>
                        )}
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            {subscription?.paymentMethod ? "Update" : "Add"}
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>
                              {subscription?.paymentMethod
                                ? "Update Payment Method"
                                : "Add Payment Method"}
                            </DialogTitle>
                            <DialogDescription>
                              {subscription?.paymentMethod
                                ? "Update your payment method information."
                                : "Add a payment method to upgrade your plan."}
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
                  {subscription?.plan !== "free" ? (
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
