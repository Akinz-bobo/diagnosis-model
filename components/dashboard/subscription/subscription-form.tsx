"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { upgradeSubscription } from "@/lib/actions/subscriptions";
import { Loader2 } from "lucide-react";
import { DialogFooter } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const enterpriseContactSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  company: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
});

const upgradeSchema = z.object({
  billingCycle: z.enum(["monthly", "yearly"]),
  paymentMethodId: z.string().optional(),
});

type EnterpriseContactValues = z.infer<typeof enterpriseContactSchema>;
type UpgradeValues = z.infer<typeof upgradeSchema>;

interface SubscriptionFormProps {
  userId: string;
  plan: string;
}

export function SubscriptionForm({ userId, plan }: SubscriptionFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const isEnterprise = plan === "enterprise";

  const enterpriseForm = useForm<EnterpriseContactValues>({
    resolver: zodResolver(enterpriseContactSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      message: "",
    },
  });

  const upgradeForm = useForm<UpgradeValues>({
    resolver: zodResolver(upgradeSchema),
    defaultValues: {
      billingCycle: "monthly",
      paymentMethodId: "pm_1234567890",
    },
  });

  async function onEnterpriseSubmit(data: EnterpriseContactValues) {
    setIsLoading(true);

    try {
      // Simulate API request
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Request submitted",
        description: "Our sales team will contact you shortly.",
      });

      // Close the dialog by refreshing the page
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function onUpgradeSubmit(data: UpgradeValues) {
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("plan", plan);
      if (data.paymentMethodId) {
        formData.append("paymentMethodId", data.paymentMethodId);
      }

      const result = await upgradeSubscription(formData);

      if (result.success) {
        toast({
          title: "Subscription upgraded",
          description: `Your subscription has been upgraded to the ${plan} plan.`,
        });
        // Close the dialog by refreshing the page
        window.location.reload();
      } else {
        toast({
          title: "Error",
          description:
            result.error || "Failed to upgrade subscription. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (isEnterprise) {
    return (
      <Form {...enterpriseForm}>
        <form
          onSubmit={enterpriseForm.handleSubmit(onEnterpriseSubmit)}
          className="space-y-4"
        >
          <FormField
            control={enterpriseForm.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={enterpriseForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="your.email@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={enterpriseForm.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company</FormLabel>
                <FormControl>
                  <Input placeholder="Your company name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={enterpriseForm.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us about your needs and requirements"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter>
            <Button
              type="submit"
              className="bg-teal-600 hover:bg-teal-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                  Submitting...
                </>
              ) : (
                "Submit Request"
              )}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    );
  }

  return (
    <Form {...upgradeForm}>
      <form
        onSubmit={upgradeForm.handleSubmit(onUpgradeSubmit)}
        className="space-y-4"
      >
        <FormField
          control={upgradeForm.control}
          name="billingCycle"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Billing Cycle</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="monthly" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Monthly - $49/month
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="yearly" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Yearly - $490/year{" "}
                      <span className="text-teal-600 font-medium">
                        (Save 17%)
                      </span>
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="rounded-lg border p-4 bg-muted/50">
          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>$49.00</span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground mb-4">
            <span>Billed monthly</span>
            <span></span>
          </div>
          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span>$49.00</span>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="submit"
            className="bg-teal-600 hover:bg-teal-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
              </>
            ) : (
              "Upgrade Subscription"
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
