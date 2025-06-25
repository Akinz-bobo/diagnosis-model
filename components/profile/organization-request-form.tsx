"use client";

import { useEffect, useState } from "react";
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
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useCurrentUser } from "@/hooks/use-current-user";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

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
  reason_for_creation: z.string().min(20, {
    message: "Please provide a detailed reason for your request.",
  }),
});

type Role = "org_admin" | "admin" | "user";
type Status = "active" | "inactive";

export type UserProfile = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  state: string;
  role: Role;
  status: Status;
  created_at: string;
  updated_at: string;
  organization_id: string;
};

type OrganizationFormValues = z.infer<typeof organizationSchema>;

export function OrganizationRequestForm() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { user } = useCurrentUser();
  const [isOrganizationAccount, setIsOrganizationAccount] =
    useState<UserProfile>();
  console.log(session?.accessToken);
  useEffect(() => {
    async function checkIsOrgAcct() {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/users/${session?.user.id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authentication: `  Bearer ${session?.accessToken}`,
          },
        }
      );
      if (!res.ok) {
        toast.error("Something went wrong in getting the user infromation");
        return null;
      }
      const result: UserProfile = await res.json();
      console.log(result);
      if (result) {
        if (
          result.role.toLowerCase() === "organization" &&
          result.organization_id
        )
          setIsOrganizationAccount(result);
        return null;
      }
    }

    checkIsOrgAcct();
  }, [session]);

  // Check if user already has an organization role
  const isOrganizationUser =
    user?.role === "org_admin" || user?.role === "admin";

  const form = useForm<OrganizationFormValues>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: "",
      description: "",
      address: "",
      phone: "",
      email: user?.email || "",
      website: "",
      reason_for_creation: "",
    },
  });

  // async function onSubmit(data: OrganizationFormValues) {
  //   setIsLoading(true);

  //   try {
  //     const result = await fetch("/api/organizations", {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${session?.accessToken}`,
  //       },

  //       method: "POST",
  //       body: JSON.stringify(data),
  //     });

  //     if (!result.ok) {
  //       toast.error("Error registering an organization");
  //       setIsLoading(false);
  //     }
  //     const organization = await result.json();
  //     console.log("NEW ORG:", organization);
  //     setIsLoading(false);
  //     setIsSubmitted(true);
  //   } catch (error) {
  //     toast.error("An unexpected error occurred. Please try again.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }

  async function onSubmit(data: OrganizationFormValues) {
    setIsLoading(true);
    try {
      let apiBody = {
        ...data,

        owner_id: session?.user.id,
      };
      const result = await fetch("/api/organizations", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
        },
        method: "POST",

        body: JSON.stringify(apiBody),
      });

      let errorMessage = "Error registering an organization";
      if (!result.ok) {
        // Try to parse error message from API
        try {
          const errorData = await result.json();
          if (errorData?.message) {
            errorMessage = errorData.message;
          }
        } catch (e) {
          // If not JSON, keep default error message
        }
        toast.error(errorMessage);
        setIsLoading(false);
        return;
      }
      const organization = await result.json();
      console.log(organization);
      setIsSubmitted(true);
    } catch (error: any) {
      let message = "An unexpected error occurred. Please try again.";
      if (error instanceof Error && error.message) {
        message = error.message;
      }
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }

  if (isOrganizationUser) {
    return (
      <Alert className="bg-teal-50 border-teal-200">
        <AlertTitle className="text-teal-800">
          You already have organization access
        </AlertTitle>
        <AlertDescription className="text-teal-700">
          Your account already has organization privileges. You can access the
          organization dashboard from your profile menu.
        </AlertDescription>
      </Alert>
    );
  }

  if (isOrganizationAccount?.role === "org_admin") {
    return (
      <Alert className="bg-teal-50 border-teal-200">
        <AlertTitle className="text-teal-800">
          Request submitted successfully
        </AlertTitle>
        <AlertDescription className="text-teal-700">
          Thank you for your request. Our team will review your application and
          get back to you within 2-3 business days. You will receive an email
          notification once your request has been processed.
        </AlertDescription>
      </Alert>
    );
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
              <FormLabel>Reason for Request</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Please explain why you need an organization account and how you plan to use it"
                  className="resize-none min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Provide details about why you're requesting an organization
                account
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full bg-teal-600 hover:bg-teal-700"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
            </>
          ) : (
            "Submit Request"
          )}
        </Button>
      </form>
    </Form>
  );
}
