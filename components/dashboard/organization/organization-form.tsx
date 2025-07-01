"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { Organization } from "@/lib/api/organization";
import {
  useCreateOrganizationMutation,
  useUpdateOrganizationMutation,
} from "@/hooks/use-organization";

const organizationSchema = z.object({
  name: z.string().min(3, {
    message: "Organization name must be at least 3 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  phone: z.string().min(5, {
    message: "Phone number must be at least 5 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  website: z
    .string()
    .url({
      message: "Please enter a valid URL.",
    })
    .optional()
    .or(z.literal("")),
  reason_for_creation: z.string().optional().or(z.literal("")),
  owner_id: z.string().optional().or(z.literal("")),
});

type OrganizationFormValues = z.infer<typeof organizationSchema>;

type OrganizationFormProps = {
  organization?: Organization;
  isEditing?: boolean;
};

export function OrganizationForm({
  organization,
  isEditing,
}: OrganizationFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const createOrgMutation = useCreateOrganizationMutation();
  const updateOrgMutation = useUpdateOrganizationMutation();

  const form = useForm<OrganizationFormValues>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: organization?.name || "",
      description: organization?.description || "",
      address: organization?.address || "",
      phone: organization?.phone || "",
      email: organization?.email || "",
      website: organization?.website || "",
      reason_for_creation: organization?.reason_for_creation || "",
      owner_id: organization?.owner_id || "",
    },
  });

  useEffect(() => {
    if (organization) {
      form.reset({
        name: organization.name || "",
        description: organization.description || "",
        address: organization.address || "",
        phone: organization.phone || "",
        email: organization.email || "",
        website: organization.website || "",
        reason_for_creation: organization.reason_for_creation || "",
        owner_id: organization.owner_id || "",
      });
    }
  }, [organization, form]);

  async function onSubmit(data: OrganizationFormValues) {
    setIsLoading(true);
    if (isEditing && organization) {
      updateOrgMutation.mutate(
        { orgId: organization.id, data },
        {
          onSuccess: () => {
            toast({
              title: "Organization updated",
              description: "Your organization has been updated successfully.",
            });
          },
          onError: (err) => {
            toast({
              title: "Error",
              description:
                err.message ||
                "Failed to update organization. Please try again.",
              variant: "destructive",
            });
          },
          onSettled: () => setIsLoading(false),
        }
      );
    } else {
      createOrgMutation.mutate(
        {
          ...data,
          website: data.website || null,
          reason_for_creation: data.reason_for_creation || null,
          owner_id: data.owner_id || null,
        },
        {
          onSuccess: () => {
            toast({
              title: "Organization registered",
              description:
                "Your organization has been successfully registered.",
            });
            window.location.reload();
          },
          onError: (err) => {
            toast({
              title: "Error",
              description:
                err.message ||
                "Failed to register organization. Please try again.",
              variant: "destructive",
            });
          },
          onSettled: () => setIsLoading(false),
        }
      );
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organization Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Vet Clinic A" {...field} />
              </FormControl>
              <FormDescription>
                The name of your veterinary practice or organization
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
                  placeholder="Describe your organization"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                A brief description of your organization and its services
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., 123 Main St, Anytown, USA"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                The physical address of your organization
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., +1 (555) 123-4567" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., contact@vetclinica.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., https://vetclinica.com" {...field} />
              </FormControl>
              <FormDescription>Your organization's website URL</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="reason_for_creation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reason for Creation (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Why are you creating this organization?"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Briefly explain the purpose of this organization.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full bg-teal-600 hover:bg-teal-700"
          disabled={
            isLoading ||
            createOrgMutation.isPending ||
            updateOrgMutation.isPending
          }
        >
          {isLoading ||
          createOrgMutation.isPending ||
          updateOrgMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEditing ? "Updating..." : "Registering..."}
            </>
          ) : isEditing ? (
            "Update Organization"
          ) : (
            "Register Organization"
          )}
        </Button>
      </form>
    </Form>
  );
}
