"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { updateUserNotifications } from "@/lib/actions/users";
import { UserProfile } from "@/lib/api/user";

const notificationsFormSchema = z
  .object({
    emailNotifications: z.boolean().default(true),
    marketingEmails: z.boolean().default(false),
    securityAlerts: z.boolean().default(true),
    productUpdates: z.boolean().default(true),
    apiUsageAlerts: z.boolean().default(true),
  })
  .strict();

type NotificationsFormValues = z.infer<typeof notificationsFormSchema>;

export function NotificationsForm({ user }: { user: UserProfile }) {
  const [isLoading, setIsLoading] = useState(false);

  // Defensive: ensure notificationPreferences is always an object
  const preferences = user.notificationPreferences ?? {};

  const form = useForm<NotificationsFormValues>({
    resolver: zodResolver(notificationsFormSchema) as any, // type workaround for zodResolver
    defaultValues: {
      emailNotifications: preferences.emailNotifications ?? true,
      marketingEmails: preferences.marketingEmails ?? false,
      securityAlerts: preferences.securityAlerts ?? true,
      productUpdates: preferences.productUpdates ?? true,
      apiUsageAlerts: preferences.apiUsageAlerts ?? true,
    },
  });

  async function onSubmit(data: NotificationsFormValues): Promise<void> {
    setIsLoading(true);
    try {
      await updateUserNotifications({
        userId: user.id,
        notificationPreferences: data,
      });
      toast({
        title: "Notification preferences updated",
        description:
          "Your notification preferences have been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating notification preferences:", error);
      toast({
        title: "Error",
        description:
          "Failed to update notification preferences. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="emailNotifications"
            render={({ field }: { field: any }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    Email Notifications
                  </FormLabel>
                  <FormDescription>
                    Receive notifications via email.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={(val) => field.onChange(val)}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="marketingEmails"
            render={({ field }: { field: any }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Marketing Emails</FormLabel>
                  <FormDescription>
                    Receive emails about new products, features, and more.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={(val) => field.onChange(val)}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="securityAlerts"
            render={({ field }: { field: any }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Security Alerts</FormLabel>
                  <FormDescription>
                    Receive emails for security alerts and account
                    notifications.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={(val) => field.onChange(val)}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="productUpdates"
            render={({ field }: { field: any }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Product Updates</FormLabel>
                  <FormDescription>
                    Receive emails about product updates and new features.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={(val) => field.onChange(val)}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="apiUsageAlerts"
            render={({ field }: { field: any }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">API Usage Alerts</FormLabel>
                  <FormDescription>
                    Receive notifications when you approach API usage limits.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={(val) => field.onChange(val)}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save preferences"}
        </Button>
      </form>
    </Form>
  );
}
