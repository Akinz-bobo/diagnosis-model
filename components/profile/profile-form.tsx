"use client";

import type React from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Upload } from "lucide-react";
import { useCurrentUserQuery, useUpdateUserMutation } from "@/hooks/use-user";

const profileFormSchema = z.object({
  full_name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  bio: z.string().max(160).optional(),
  profession: z.string().max(30).optional(),
  address: z.string().max(100).optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileForm() {
  const { data: user, isLoading: userLoading, error } = useCurrentUserQuery();
  const updateUserMutation = useUpdateUserMutation();
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      full_name: user?.full_name || "",
      bio: user?.bio || "",
      profession: user?.profession || "",
      address: user?.address || "",
    },
  });

  // Sync form with user data when loaded
  useEffect(() => {
    if (user) {
      form.reset({
        full_name: user.full_name || "",
        bio: user.bio || "",
        profession: user.profession || "",
        address: user.address || "",
      });
    }
  }, [user, form]);

  const getInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (
      parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
    ).toUpperCase();
  };

  async function onSubmit(data: ProfileFormValues) {
    if (!user) return;
    updateUserMutation.mutate(
      { userId: user.id, data },
      {
        onSuccess: () => {
          toast({
            title: "Profile updated",
            description: "Your profile has been updated successfully.",
          });
        },
        onError: (err) => {
          toast({
            title: "Error",
            description:
              err.message || "Failed to update profile. Please try again.",
            variant: "destructive",
          });
        },
      }
    );
  }

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;
    setIsUploading(true);

    updateUserMutation.mutate(
      { userId: user.id, data: { image_file: file } },
      {
        onSuccess: () => {
          toast({
            title: "Image uploaded",
            description: "Your profile image has been updated successfully.",
          });
        },
        onError: (err) => {
          toast({
            title: "Error",
            description:
              err.message || "Failed to upload image. Please try again.",
            variant: "destructive",
          });
        },
        onSettled: () => setIsUploading(false),
      }
    );
  };

  if (userLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }

  if (!user) {
    return <div>No user found.</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
            <AvatarImage
              src={user.image || ""}
              alt={user.full_name || "User"}
            />
            <AvatarFallback className="text-2xl bg-teal-100 text-teal-800">
              {getInitials(user.full_name || "")}
            </AvatarFallback>
          </Avatar>
          <div className="absolute bottom-0 right-0">
            <label htmlFor="avatar-upload" className="cursor-pointer">
              <div className="rounded-full bg-teal-600 p-2 text-white shadow-sm hover:bg-teal-700 transition-colors">
                {isUploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
              </div>
              <span className="sr-only">Upload avatar</span>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
                disabled={isUploading}
              />
            </label>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Click the icon to upload a new profile picture
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your name" {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us a little bit about yourself"
                    className="resize-none"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormDescription>
                  Brief description for your profile. Max 160 characters.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="profession"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profession</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Veterinarian"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., New York, USA"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            type="submit"
            className="bg-teal-600 hover:bg-teal-700"
            disabled={updateUserMutation.isPending}
          >
            {updateUserMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
              </>
            ) : (
              "Update profile"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
