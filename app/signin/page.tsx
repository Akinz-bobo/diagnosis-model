"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { useAuth } from "@/hooks/auth-context";

// Define the form schema with Zod
const signinSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

type SigninFormValues = z.infer<typeof signinSchema>;

export default function SigninPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();
  const { toast } = useToast();

  // Initialize the form
  const form = useForm<SigninFormValues>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Handle form submission
  // async function onSubmit(data: SigninFormValues) {
  //   setIsLoading(true);

  //   try {
  //     const response = await fetch(
  //       process.env.NEXT_PUBLIC_API_BASE_URL + "/api/v1/auth/login",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(data),
  //       }
  //     );

  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       throw new Error(errorData.message || "Invalid email or password");
  //     }

  //     const { access_token, token_type } = await response.json();

  //     // Store the token in localStorage
  //     localStorage.setItem("token", access_token);
  //     localStorage.setItem("token_type", token_type);

  //     toast({
  //       title: "Success!",
  //       description: "You have successfully signed in.",
  //       variant: "default",
  //     });

  //     // Redirect to the diagnosis page
  //     router.push("/diagnosis");
  //   } catch (error) {
  //     console.error("Signin error:", error);
  //     toast({
  //       title: "Error",
  //       description:
  //         error instanceof Error
  //           ? error.message
  //           : "Failed to sign in. Please try again.",
  //       variant: "destructive",
  //     });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }

  async function onSubmit(data: SigninFormValues) {
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Invalid email or password");
      }

      const { access_token } = await response.json();
      await login(access_token);

      toast({
        title: "Success!",
        description: "You have successfully signed in.",
        variant: "default",
      });
    } catch (error) {
      console.error("Signin error:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to sign in. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12 px-4 md:px-6">
        <div className="mx-auto w-full max-w-md space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-heading font-bold">Welcome Back</h1>
            <p className="text-muted-foreground">
              Enter your credentials to sign in to your account
            </p>
          </div>
          <div className="space-y-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="john@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="********"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full bg-teal-600 hover:bg-teal-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </Form>
            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="font-medium text-teal-600 hover:text-teal-500"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
