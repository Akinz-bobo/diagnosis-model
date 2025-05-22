"use client";

import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { requestApiKey } from "@/lib/actions/api-keys";
import { Loader2 } from "lucide-react";

const apiKeyRequestSchema = z.object({
  name: z.string().min(3, {
    message: "Name must be at least 3 characters.",
  }),
  environment: z.string({
    required_error: "Please select an environment.",
  }),
  purpose: z.string().min(10, {
    message: "Purpose must be at least 10 characters.",
  }),
  organization: z.string().optional(),
});

type ApiKeyRequestValues = z.infer<typeof apiKeyRequestSchema>;

export function ApiKeyRequestForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<ApiKeyRequestValues>({
    resolver: zodResolver(apiKeyRequestSchema),
    defaultValues: {
      name: "",
      environment: "",
      purpose: "",
      organization: "",
    },
  });

  async function onSubmit(data: ApiKeyRequestValues) {
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("environment", data.environment);
      formData.append("purpose", data.purpose);
      if (data.organization) {
        formData.append("organization", data.organization);
      }

      const result = await requestApiKey(formData);

      if (result.success) {
        toast({
          title: "Request submitted",
          description: "Your API key request has been submitted for approval.",
        });
        form.reset();
      } else {
        toast({
          title: "Error",
          description:
            result.error || "Failed to submit request. Please try again.",
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>API Key Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Production API Key" {...field} />
              </FormControl>
              <FormDescription>
                A descriptive name to identify this API key
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="environment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Environment</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select environment" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="development">Development</SelectItem>
                  <SelectItem value="staging">Staging</SelectItem>
                  <SelectItem value="production">Production</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                The environment where this API key will be used
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="purpose"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Purpose</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe how you plan to use this API key"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Explain how you plan to use this API key
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="organization"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organization (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Vet Clinic A" {...field} />
              </FormControl>
              <FormDescription>
                The organization that will be using this API key
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
