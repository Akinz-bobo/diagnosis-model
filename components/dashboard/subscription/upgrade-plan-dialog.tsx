"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, Crown, Star } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import type { UserSubscription, SubscriptionPlan } from "@/lib/types";

interface UpgradePlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPlan: UserSubscription;
  availablePlans: SubscriptionPlan[];
  onUpgrade: (plan: SubscriptionPlan) => void;
}

export function UpgradePlanDialog({
  open,
  onOpenChange,
  currentPlan,
  availablePlans,
  onUpgrade,
}: UpgradePlanDialogProps) {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleUpgrade = async () => {
    if (!selectedPlan) return;

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      onUpgrade(selectedPlan);
      onOpenChange(false);

      toast({
        title: "Plan upgraded successfully",
        description: `You've been upgraded to the ${selectedPlan.name} plan.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upgrade plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getPlanIcon = (planName: string) => {
    switch (planName) {
      case "pro":
        return <Zap className="h-5 w-5 text-blue-600" />;
      case "enterprise":
        return <Crown className="h-5 w-5 text-purple-600" />;
      default:
        return <Star className="h-5 w-5 text-teal-600" />;
    }
  };

  const getPlanColor = (planName: string) => {
    switch (planName) {
      case "pro":
        return "border-blue-200 bg-blue-50/50";
      case "enterprise":
        return "border-purple-200 bg-purple-50/50";
      default:
        return "border-teal-200 bg-teal-50/50";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upgrade Your Plan</DialogTitle>
          <DialogDescription>
            Choose a plan that fits your needs. You can change or cancel
            anytime.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 md:grid-cols-2 py-4">
          {availablePlans.map((plan) => (
            <Card
              key={plan.id}
              className={`cursor-pointer transition-all ${
                selectedPlan?.id === plan.id
                  ? `ring-2 ring-teal-500 ${getPlanColor(plan.name)}`
                  : "hover:shadow-md"
              }`}
              onClick={() => setSelectedPlan(plan)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getPlanIcon(plan.name)}
                    <CardTitle className="capitalize">{plan.name}</CardTitle>
                  </div>
                  {plan.name === "pro" && (
                    <Badge className="bg-blue-100 text-blue-800">Popular</Badge>
                  )}
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-3xl font-bold">
                  ${plan.price}
                  <span className="text-sm font-normal text-muted-foreground">
                    /{plan.billing_cycle === "monthly" ? "month" : "year"}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">
                      {plan.allowed_calls === -1
                        ? "Unlimited"
                        : plan.allowed_calls.toLocaleString()}{" "}
                      API calls
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">
                      {plan.features.team_allowed === "unlimited"
                        ? "Unlimited"
                        : plan.features.team_allowed}{" "}
                      team members
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">
                      {plan.features.api_keys_allowed === "unlimited"
                        ? "Unlimited"
                        : plan.features.api_keys_allowed}{" "}
                      API keys
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm capitalize">
                      {plan.features.support_level} support
                    </span>
                  </div>
                  {plan.features.analytics_dashboard && (
                    <div className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Advanced analytics</span>
                    </div>
                  )}
                  {plan.features.priority_queue && (
                    <div className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Priority processing</span>
                    </div>
                  )}
                  {plan.features.developer_support && (
                    <div className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Developer support</span>
                    </div>
                  )}
                </div>

                {selectedPlan?.id === plan.id && (
                  <div className="pt-2 border-t">
                    <div className="text-sm text-muted-foreground">
                      <strong>Upgrade from {currentPlan.plan_name}:</strong>
                      <ul className="mt-1 space-y-1">
                        <li>
                          •{" "}
                          {plan.allowed_calls === -1
                            ? "Unlimited"
                            : (
                                plan.allowed_calls - currentPlan.allowed_calls
                              ).toLocaleString()}{" "}
                          more API calls
                        </li>
                        <li>• Enhanced support level</li>
                        {plan.features.analytics_dashboard &&
                          !currentPlan.features.analytics_dashboard && (
                            <li>• Access to analytics dashboard</li>
                          )}
                      </ul>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleUpgrade}
            disabled={!selectedPlan || isLoading}
            className="bg-teal-600 hover:bg-teal-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Upgrading...
              </>
            ) : (
              `Upgrade to ${selectedPlan?.name || "Selected Plan"}`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
