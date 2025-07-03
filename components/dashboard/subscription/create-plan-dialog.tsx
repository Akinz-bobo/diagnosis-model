"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import type { SubscriptionPlan } from "@/lib/types";

const createPlanSchema = z.object({
  name: z.string().min(2, "Plan name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().min(0, "Price must be 0 or greater"),
  billing_cycle: z.enum(["monthly", "yearly"]),
  allowed_calls: z
    .number()
    .min(-1, "Allowed calls must be -1 (unlimited) or greater"),
  team_allowed: z.string(),
  api_keys_allowed: z.string(),
  support_level: z.string(),
  real_time_api_usage_tracking: z.boolean(),
  developer_support: z.boolean(),
  unlimited_diagnosis: z.boolean(),
  unlimited_api_calls: z.boolean(),
  analytics_dashboard: z.boolean(),
  priority_queue: z.boolean(),
});

type CreatePlanValues = z.infer<typeof createPlanSchema>;

interface CreatePlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPlanCreated: (plan: SubscriptionPlan) => void;
}

export function CreatePlanDialog({
  open,
  onOpenChange,
  onPlanCreated,
}: CreatePlanDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<CreatePlanValues>({
    resolver: zodResolver(createPlanSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      billing_cycle: "monthly",
      allowed_calls: 100,
      team_allowed: "1",
      api_keys_allowed: "1",
      support_level: "community",
      real_time_api_usage_tracking: false,
      developer_support: false,
      unlimited_diagnosis: false,
      unlimited_api_calls: false,
      analytics_dashboard: false,
      priority_queue: false,
    },
  });

  async function onSubmit(data: CreatePlanValues) {
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newPlan: SubscriptionPlan = {
        id: `plan-${Date.now()}`,
        name: data.name,
        description: data.description,
        price: data.price,
        billing_cycle: data.billing_cycle,
        features: {
          team_allowed: data.team_allowed,
          api_keys_allowed: data.api_keys_allowed,
          real_time_api_usage_tracking: data.real_time_api_usage_tracking,
          developer_support: data.developer_support,
          support_level: data.support_level,
          unlimited_diagnosis: data.unlimited_diagnosis,
          unlimited_api_calls: data.unlimited_api_calls,
          analytics_dashboard: data.analytics_dashboard,
          priority_queue: data.priority_queue,
        },
        allowed_calls: data.allowed_calls,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      onPlanCreated(newPlan);
      onOpenChange(false);
      form.reset();

      toast({
        title: "Plan created successfully",
        description: `${data.name} plan has been created and is now available.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Subscription Plan</DialogTitle>
          <DialogDescription>
            Create a new subscription plan with custom features and pricing.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic Information</h3>

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Plan Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Pro, Enterprise" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="49"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              Number.parseFloat(e.target.value) || 0
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe what this plan offers..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="billing_cycle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Billing Cycle</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select billing cycle" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="yearly">Yearly</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="allowed_calls"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>API Calls Limit</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="1000 (-1 for unlimited)"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number.parseInt(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        Use -1 for unlimited calls
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Limits */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Limits & Quotas</h3>

              <div className="grid gap-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="team_allowed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Team Members</FormLabel>
                      <FormControl>
                        <Input placeholder="5 or unlimited" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="api_keys_allowed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>API Keys</FormLabel>
                      <FormControl>
                        <Input placeholder="3 or unlimited" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="support_level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Support Level</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select support level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="community">Community</SelectItem>
                          <SelectItem value="priority">Priority</SelectItem>
                          <SelectItem value="dedicated">Dedicated</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Features</h3>

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="real_time_api_usage_tracking"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Real-time API Tracking
                        </FormLabel>
                        <FormDescription>
                          Monitor API usage in real-time
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="developer_support"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Developer Support
                        </FormLabel>
                        <FormDescription>
                          Access to developer resources
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="unlimited_diagnosis"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Unlimited Diagnosis
                        </FormLabel>
                        <FormDescription>
                          No limits on diagnosis requests
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="unlimited_api_calls"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Unlimited API Calls
                        </FormLabel>
                        <FormDescription>
                          No limits on API usage
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="analytics_dashboard"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Analytics Dashboard
                        </FormLabel>
                        <FormDescription>
                          Advanced analytics and insights
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="priority_queue"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Priority Queue
                        </FormLabel>
                        <FormDescription>
                          Faster processing priority
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-teal-600 hover:bg-teal-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Plan"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
