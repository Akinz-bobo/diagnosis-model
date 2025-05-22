"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import type { Organization } from "@/lib/types";
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { updateOrganization } from "@/lib/actions/organizations";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

const organizationFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Organization name must be at least 2 characters.",
    })
    .max(50, {
      message: "Organization name must not be longer than 50 characters.",
    }),
  description: z.string().max(500).optional(),
  website: z
    .string()
    .url({ message: "Please enter a valid URL." })
    .optional()
    .or(z.literal("")),
  logoUrl: z.string().optional(),
});

type OrganizationFormValues = z.infer<typeof organizationFormSchema>;

export function OrganizationEditForm({
  organization,
}: {
  organization: Organization;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<OrganizationFormValues>({
    resolver: zodResolver(organizationFormSchema),
    defaultValues: {
      name: organization.name || "",
      description: organization.description || "",
      website: organization.website || "",
      logoUrl: organization.logoUrl || "",
    },
    mode: "onChange",
  });

  async function onSubmit(data: OrganizationFormValues) {
    setIsLoading(true);

    try {
      await updateOrganization({
        organizationId: organization.id,
        name: data.name,
        description: data.description || "",
        website: data.website || "",
        logoUrl: data.logoUrl || "",
      });

      toast({
        title: "Organization updated",
        description: "Your organization has been updated successfully.",
      });

      // Refresh the page to show updated data
      router.refresh();
    } catch (error) {
      console.error("Error updating organization:", error);
      toast({
        title: "Error",
        description: "Failed to update organization. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex items-center gap-x-6">
          <Avatar className="h-20 w-20">
            <AvatarImage
              src={organization.logoUrl || ""}
              alt={organization.name || "Organization"}
            />
            <AvatarFallback>
              {organization.name?.charAt(0) || "O"}
            </AvatarFallback>
          </Avatar>
          <div>
            <Button variant="outline" size="sm" type="button">
              Change logo
            </Button>
            <p className="mt-2 text-xs text-muted-foreground">
              JPG, PNG or GIF. 1MB max.
            </p>
          </div>
        </div>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organization Name</FormLabel>
              <FormControl>
                <Input placeholder="Acme Inc." {...field} />
              </FormControl>
              <FormDescription>
                This is your organization's public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us about your organization"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Brief description of your organization. Max 500 characters.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com" {...field} />
              </FormControl>
              <FormDescription>
                Your organization's website URL.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Updating..." : "Update organization"}
        </Button>
      </form>
    </Form>
  );
}
