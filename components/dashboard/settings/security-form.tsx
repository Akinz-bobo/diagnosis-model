"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import type { User } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import { updateUserPassword, enable2FA } from "@/lib/actions/users";

const securityFormSchema = z
  .object({
    currentPassword: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    newPassword: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    confirmPassword: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    twoFactorEnabled: z.boolean().default(false),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SecurityFormValues = z.infer<typeof securityFormSchema>;

export function SecurityForm({ user }: { user: User }) {
  const [isLoading, setIsLoading] = useState(false);
  const [is2FALoading, setIs2FALoading] = useState(false);

  const form = useForm<SecurityFormValues>({
    resolver: zodResolver(securityFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      twoFactorEnabled: user.twoFactorEnabled || false,
    },
    mode: "onChange",
  });

  async function onSubmit(data: SecurityFormValues) {
    setIsLoading(true);

    try {
      await updateUserPassword({
        userId: user.id,
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      toast({
        title: "Password updated",
        description: "Your password has been updated successfully.",
      });

      form.reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        twoFactorEnabled: data.twoFactorEnabled,
      });
    } catch (error) {
      console.error("Error updating password:", error);
      toast({
        title: "Error",
        description:
          "Failed to update password. Please check your current password and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleToggle2FA(enabled: boolean) {
    setIs2FALoading(true);

    try {
      await enable2FA({
        userId: user.id,
        enabled,
      });

      toast({
        title: enabled ? "2FA Enabled" : "2FA Disabled",
        description: enabled
          ? "Two-factor authentication has been enabled for your account."
          : "Two-factor authentication has been disabled for your account.",
      });

      form.setValue("twoFactorEnabled", enabled);
    } catch (error) {
      console.error("Error toggling 2FA:", error);
      toast({
        title: "Error",
        description: "Failed to update two-factor authentication settings.",
        variant: "destructive",
      });
      // Revert the toggle
      form.setValue("twoFactorEnabled", !enabled);
    } finally {
      setIs2FALoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormDescription>
                  Password must be at least 8 characters long.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm New Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Updating..." : "Update password"}
          </Button>
        </form>
      </Form>

      <div className="space-y-4">
        <h4 className="text-sm font-medium">Two-Factor Authentication (2FA)</h4>
        <div className="flex items-center space-x-2">
          <Switch
            checked={form.watch("twoFactorEnabled")}
            onCheckedChange={handleToggle2FA}
            disabled={is2FALoading}
            id="two-factor"
          />
          <label
            htmlFor="two-factor"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {form.watch("twoFactorEnabled") ? "Enabled" : "Disabled"}
          </label>
        </div>
        <p className="text-sm text-muted-foreground">
          When enabled, you'll be required to enter a code from your
          authenticator app when logging in.
        </p>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-medium">Sessions</h4>
        <div className="rounded-md border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Current session</p>
              <p className="text-xs text-muted-foreground">
                Last active: {new Date().toLocaleString()}
              </p>
            </div>
            <Button variant="outline" size="sm">
              Sign out
            </Button>
          </div>
        </div>
        <Button variant="outline" size="sm">
          Sign out of all devices
        </Button>
      </div>
    </div>
  );
}
// This code defines a React component for a security settings form in a user dashboard.
