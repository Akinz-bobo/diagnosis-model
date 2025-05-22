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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { inviteMember } from "@/lib/actions/organizations";
import { Loader2 } from "lucide-react";
import { DialogFooter } from "@/components/ui/dialog";

const memberInviteSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  role: z.string({
    required_error: "Please select a role.",
  }),
});

type MemberInviteValues = z.infer<typeof memberInviteSchema>;

interface MemberInviteFormProps {
  organizationId: string;
}

export function MemberInviteForm({ organizationId }: MemberInviteFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<MemberInviteValues>({
    resolver: zodResolver(memberInviteSchema),
    defaultValues: {
      email: "",
      role: "",
    },
  });

  async function onSubmit(data: MemberInviteValues) {
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("role", data.role);
      formData.append("organizationId", organizationId);

      const result = await inviteMember(formData);

      if (result.success) {
        toast({
          title: "Invitation sent",
          description: "An invitation has been sent to the email address.",
        });
        form.reset();
        // Close the dialog by refreshing the page
        window.location.reload();
      } else {
        toast({
          title: "Error",
          description:
            result.error || "Failed to send invitation. Please try again.",
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input placeholder="colleague@example.com" {...field} />
              </FormControl>
              <FormDescription>
                The email address of the person you want to invite
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Member">Member</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                The role determines what permissions the user will have
              </FormDescription>
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
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
              </>
            ) : (
              "Send Invitation"
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
