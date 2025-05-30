"use client";

import type React from "react";

import { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, X, Upload, AlertCircle } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/hooks/auth-context";

// Define the form schema with Zod
const historySchema = z.object({
  Species: z.string().min(1, { message: "Species is required" }),
  Age: z.string().min(1, { message: "Age is required" }),
  "Clinical Signs": z
    .string()
    .min(1, { message: "Clinical signs are required" }),
  "Post-Mortem Findings": z
    .string()
    .min(1, { message: "Post-mortem findings are required" }),
  "Total Birds in Farm": z.coerce
    .number()
    .min(1, { message: "Total birds must be at least 1" }),
  "Total Affected": z.coerce
    .number()
    .min(0, { message: "Total affected must be a positive number" }),
  "Total Deaths": z.coerce
    .number()
    .min(0, { message: "Total deaths must be a positive number" }),
});

type HistoryFormValues = z.infer<typeof historySchema>;

interface DiagnosisResult {
  predicted_class: string;
  confidence: number;
  gpt_background: string;
}

export default function DiagnosisPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [diagnosisResult, setDiagnosisResult] =
    useState<DiagnosisResult | null>(null);

  const { user } = useAuth();

  const router = useRouter();
  const { toast } = useToast();

  // Initialize the form
  const form = useForm<HistoryFormValues>({
    resolver: zodResolver(historySchema),
    defaultValues: {
      Species: "",
      Age: "",
      "Clinical Signs": "",
      "Post-Mortem Findings": "",
      "Total Birds in Farm": 0,
      "Total Affected": 0,
      "Total Deaths": 0,
    },
  });

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages = Array.from(e.target.files);
      setSelectedImages((prevImages) => [...prevImages, ...newImages]);

      // Create preview URLs for the images
      const newImageUrls = newImages.map((image) => {
        // Ensure we're creating valid object URLs
        try {
          return URL.createObjectURL(image);
        } catch (error) {
          console.error("Error creating object URL:", error);
          return "";
        }
      });

      setImagePreviewUrls((prevUrls) => [...prevUrls, ...newImageUrls]);

      // Log for debugging
      console.log("Selected images:", newImages);
      console.log("Preview URLs:", newImageUrls);
    }
  };

  // Remove an image from the selection
  const removeImage = (index: number) => {
    // Store the URL before removing it from the array
    const urlToRevoke = imagePreviewUrls[index];

    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
    setImagePreviewUrls((prevUrls) => prevUrls.filter((_, i) => i !== index));

    // Revoke the object URL to avoid memory leaks
    if (urlToRevoke) {
      try {
        URL.revokeObjectURL(urlToRevoke);
      } catch (error) {
        console.error("Error revoking object URL:", error);
      }
    }
  };

  // Clear all selected images
  const clearAllImages = () => {
    // Revoke all object URLs to avoid memory leaks
    imagePreviewUrls.forEach((url) => URL.revokeObjectURL(url));
    setSelectedImages([]);
    setImagePreviewUrls([]);
  };

  // Handle form submission
  async function onSubmit(data: HistoryFormValues) {
    if (selectedImages.length === 0) {
      toast({
        title: "Error",
        description: "Please upload at least one image for diagnosis",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setDiagnosisResult(null);

    try {
      // Prepare the form data
      const formData = new FormData();
      selectedImages.forEach((image) => {
        formData.append("images", image);
      });
      formData.append("history", JSON.stringify(data));

      // Send request to internal API route
      const response = await fetch("/api/diagnosis/predict", {
        method: "POST",
        body: formData,
        credentials: "include", // Required to send cookies
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.message || "Failed to get diagnosis");
      }

      const result = await response.json();
      setDiagnosisResult(result);

      toast({
        title: "Diagnosis Complete",
        description: "Your diagnosis has been successfully processed.",
        variant: "default",
      });
    } catch (error) {
      console.error("Diagnosis error:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to get diagnosis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mt-20 text-primary" />;
      </div>
    );
  }
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-12 px-4 md:px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-heading font-bold md:text-4xl">
              Disease Diagnosis
            </h1>
            <p className="mt-2 text-muted-foreground">
              Upload post-mortem images and provide clinical history for
              accurate diagnosis
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Image Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle>Upload Images</CardTitle>
                <CardDescription>
                  Upload one or more post-mortem images for analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-center">
                  <div className="relative flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 px-5 py-5 text-center">
                    <Upload className="h-6 w-6 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Drag and drop or click to upload
                    </p>
                    <input
                      type="file"
                      className="absolute inset-0 cursor-pointer opacity-0"
                      onChange={handleImageChange}
                      accept="image/*"
                      multiple
                    />
                  </div>
                </div>

                {imagePreviewUrls.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <h3 className="text-sm font-medium">
                        Selected Images ({imagePreviewUrls.length})
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearAllImages}
                        className="h-8 px-2 text-xs"
                      >
                        Clear All
                      </Button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {imagePreviewUrls.map((url, index) => (
                        <div
                          key={index}
                          className="relative rounded-md overflow-hidden h-24 bg-muted"
                        >
                          {url ? (
                            <img
                              src={url || "/placeholder.svg"}
                              alt={`Preview ${index + 1}`}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                console.error(
                                  `Error loading image ${index}:`,
                                  e
                                );
                                e.currentTarget.src =
                                  "/placeholder.svg?height=100&width=100";
                              }}
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                              <AlertCircle className="h-4 w-4 mr-2" />
                              <span className="text-xs">Failed to load</span>
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute right-1 top-1 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedImages.length === 0 && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Required</AlertTitle>
                    <AlertDescription>
                      At least one image is required for diagnosis
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Clinical History Form */}
            <Card>
              <CardHeader>
                <CardTitle>Clinical History</CardTitle>
                <CardDescription>
                  Provide detailed clinical history for accurate diagnosis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form className="space-y-4">
                    <FormField
                      control={form.control}
                      name="Species"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Species</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select species" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Chicken">Chicken</SelectItem>
                              <SelectItem value="Duck">Duck</SelectItem>
                              <SelectItem value="Turkey">Turkey</SelectItem>
                              <SelectItem value="Goose">Goose</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="Age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Age</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 16 weeks" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="Clinical Signs"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Clinical Signs</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., inappetence, scabs on the comb"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="Post-Mortem Findings"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Post-Mortem Findings</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., enlarged liver, hemorrhages"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="Total Birds in Farm"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Total Birds</FormLabel>
                            <FormControl>
                              <Input type="number" min="1" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="Total Affected"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Affected</FormLabel>
                            <FormControl>
                              <Input type="number" min="0" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="Total Deaths"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Deaths</FormLabel>
                            <FormControl>
                              <Input type="number" min="0" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 flex justify-center">
            <Button
              onClick={form.handleSubmit(onSubmit)}
              className="px-8 py-6 text-lg bg-teal-600 hover:bg-teal-700"
              disabled={isLoading || selectedImages.length === 0}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Get Diagnosis"
              )}
            </Button>
          </div>

          {/* Diagnosis Results */}
          {diagnosisResult && (
            <Card className="mt-12">
              <CardHeader className="bg-teal-50 dark:bg-teal-900/20">
                <CardTitle className="text-2xl">Diagnosis Results</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid gap-8 md:grid-cols-2">
                  <div>
                    <h3 className="text-xl font-bold mb-4">Diagnosis</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between rounded-lg bg-muted p-4">
                        <span className="font-medium">Predicted Disease:</span>
                        <span className="text-lg font-bold text-teal-600">
                          {diagnosisResult.predicted_class}
                        </span>
                      </div>
                      <div className="flex items-center justify-between rounded-lg bg-muted p-4">
                        <span className="font-medium">Confidence:</span>
                        <div className="flex items-center">
                          <div className="h-2 w-24 rounded-full bg-gray-200">
                            <div
                              className="h-2 rounded-full bg-teal-600"
                              style={{
                                width: `${diagnosisResult.confidence * 100}%`,
                              }}
                            ></div>
                          </div>
                          <span className="ml-2 font-bold">
                            {(diagnosisResult.confidence * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-4">
                      Background Information
                    </h3>
                    <div className="rounded-lg bg-muted p-4">
                      <p className="text-sm leading-relaxed">
                        {diagnosisResult.gpt_background}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
