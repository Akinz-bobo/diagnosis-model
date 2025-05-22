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
import {
  Loader2,
  X,
  Upload,
  AlertCircle,
  Share2,
  ArrowRight,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { SpecialistContactModal } from "@/components/diagnosis/specialist-contact-modal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/auth-context";

// Define the form schema with Zod
const historySchema = z
  .object({
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
      .min(1, { message: "Total affected must be at least 1" }),
    "Total Deaths": z.coerce
      .number()
      .min(1, { message: "Total deaths must be at least 1" }),
  })
  .refine((data) => data["Total Affected"] <= data["Total Birds in Farm"], {
    message: "Total affected must not be greater than total birds in farm",
    path: ["Total Affected"],
  })
  .refine(
    (data) =>
      data["Total Deaths"] <= data["Total Birds in Farm"] &&
      data["Total Deaths"] <= data["Total Affected"],
    {
      message:
        "Total death must not be greater than total affected and total birds in farm",
      path: ["Total Deaths"],
    }
  );

type HistoryFormValues = z.infer<typeof historySchema>;

interface DiagnosisResult {
  predicted_class: string;
  confidence: number;
  gpt_background: string;
  processed_images?: ProcessedImage[];
  differential_diagnoses?: string[];
  conclusion?: string;
}

interface ProcessedImage {
  url: string;
  lesions: string[];
  relevance: string;
}

export default function DiagnosisPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSpecialistModalOpen, setIsSpecialistModalOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [diagnosisResult, setDiagnosisResult] =
    useState<DiagnosisResult | null>(null);
  const router = useRouter();
  const { toast } = useToast();
  const { user, token, loading: authLoading } = useAuth();

  // const accessToken = window.localStorage.getItem("token");
  // console.log("Access Token:", accessToken);

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

  // Redirect to signin if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/signin");
    }
  }, [authLoading, user, router]);

  console.log({
    user,
    token,
    authLoading,
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
      if (!token) {
        throw new Error("You are not authenticated. Please sign in.");
      }

      // Construct the FormData payload
      const formData = new FormData();

      // Append images
      selectedImages.forEach((image) => {
        formData.append("images", image);
      });

      // Append required clinical history fields
      formData.append("Species", data.Species);
      formData.append("Age", data.Age.toString());
      formData.append("Clinical Signs", data["Clinical Signs"]);
      formData.append(
        "Post-Mortem Findings",
        data["Post-Mortem Findings"] || ""
      );
      formData.append(
        "Total Birds in Farm",
        data["Total Birds in Farm"].toString()
      );
      formData.append("Total Affected", data["Total Affected"].toString());
      formData.append("Total Deaths", data["Total Deaths"].toString());

      // Send the request to internal API route
      const res = await fetch("/api/diagnosis/predict", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Diagnosis failed");
      }

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

  if (authLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
        <p className="mt-4 text-muted-foreground">Checking authentication...</p>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to signin page via useEffect
  }

  return (
    <div className="flex min-h-screen flex-col">
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

          {/* Enhanced Diagnosis Results */}
          {diagnosisResult && (
            <Card className="mt-12 overflow-hidden border-teal-200 shadow-lg">
              <CardHeader className="bg-teal-50 dark:bg-teal-900/20 border-b border-teal-100">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">
                      Diagnosis Results
                    </CardTitle>
                    <CardDescription>
                      AI-assisted veterinary diagnosis
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={() => setIsSpecialistModalOpen(true)}
                  >
                    <Share2 className="h-4 w-4" />
                    Contact a Specialist
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs defaultValue="diagnosis" className="w-full">
                  <div className="border-b px-6">
                    <TabsList className="w-full justify-start h-14">
                      <TabsTrigger
                        value="diagnosis"
                        className="data-[state=active]:bg-teal-50 dark:data-[state=active]:bg-teal-900/20"
                      >
                        Tentative Diagnosis
                      </TabsTrigger>
                      <TabsTrigger
                        value="analysis"
                        className="data-[state=active]:bg-teal-50 dark:data-[state=active]:bg-teal-900/20"
                      >
                        Analysis Process
                      </TabsTrigger>
                      <TabsTrigger
                        value="conclusion"
                        className="data-[state=active]:bg-teal-50 dark:data-[state=active]:bg-teal-900/20"
                      >
                        Conclusion
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  {/* Diagnosis Tab */}
                  <TabsContent value="diagnosis" className="p-6 space-y-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-1">
                        <div className="rounded-lg bg-teal-50 dark:bg-teal-900/10 p-6 space-y-4">
                          <div className="space-y-2">
                            <h3 className="text-sm font-medium text-muted-foreground">
                              Tentative Diagnosis
                            </h3>
                            <div className="flex items-center gap-2">
                              <h2 className="text-2xl font-bold text-teal-700 dark:text-teal-500">
                                {diagnosisResult.predicted_class}
                              </h2>
                              <Badge
                                variant="outline"
                                className="bg-yellow-50 text-yellow-700 border-yellow-200"
                              >
                                Tentative
                              </Badge>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <h3 className="text-sm font-medium text-muted-foreground">
                              Confidence
                            </h3>
                            <div className="flex items-center gap-3">
                              <div className="h-2 w-full max-w-[200px] rounded-full bg-gray-200">
                                <div
                                  className="h-2 rounded-full bg-teal-600"
                                  style={{
                                    width: `${
                                      diagnosisResult.confidence * 100
                                    }%`,
                                  }}
                                ></div>
                              </div>
                              <span className="font-bold">
                                {(diagnosisResult.confidence * 100).toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-6">
                          <h3 className="text-lg font-medium mb-3">
                            Differential Diagnoses
                          </h3>
                          <ul className="space-y-2">
                            {diagnosisResult.differential_diagnoses?.map(
                              (diagnosis, index) => (
                                <li
                                  key={index}
                                  className="flex items-center gap-2 p-3 rounded-md bg-gray-50 dark:bg-gray-800/50"
                                >
                                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 text-xs font-medium">
                                    {index + 1}
                                  </span>
                                  <span>{diagnosis}</span>
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      </div>

                      <div className="flex-1">
                        <h3 className="text-lg font-medium mb-3">
                          Background Information
                        </h3>
                        <div className="rounded-lg bg-gray-50 dark:bg-gray-800/50 p-4">
                          <p className="text-sm leading-relaxed">
                            {diagnosisResult.gpt_background}
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Analysis Process Tab */}
                  <TabsContent value="analysis" className="p-6 space-y-6">
                    <h3 className="text-xl font-medium">
                      Image Analysis Process
                    </h3>
                    <p className="text-muted-foreground">
                      The AI system analyzed the following images to identify
                      lesions and determine their relevance to the diagnosis.
                    </p>

                    <div className="space-y-8">
                      {diagnosisResult.processed_images?.map((image, index) => (
                        <div
                          key={index}
                          className="border rounded-lg overflow-hidden"
                        >
                          <div className="bg-gray-50 dark:bg-gray-800/50 p-4 border-b">
                            <h4 className="font-medium">
                              Image {index + 1} Analysis
                            </h4>
                          </div>
                          <div className="grid md:grid-cols-2 gap-6 p-6">
                            <div>
                              <div className="rounded-lg overflow-hidden border bg-muted h-[300px] flex items-center justify-center">
                                <img
                                  src={image.url || "/placeholder.svg"}
                                  alt={`Processed image ${index + 1}`}
                                  className="max-h-full max-w-full object-contain"
                                  onError={(e) => {
                                    e.currentTarget.src =
                                      "/placeholder.svg?height=300&width=400";
                                  }}
                                />
                              </div>
                            </div>
                            <div className="space-y-4">
                              <div>
                                <h5 className="text-sm font-medium text-muted-foreground mb-2">
                                  Identified Lesions
                                </h5>
                                <ul className="space-y-2">
                                  {image.lesions.map((lesion, i) => (
                                    <li
                                      key={i}
                                      className="flex items-start gap-2"
                                    >
                                      <div className="mt-1 flex-shrink-0">
                                        <div className="h-2 w-2 rounded-full bg-teal-500"></div>
                                      </div>
                                      <span>{lesion}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <h5 className="text-sm font-medium text-muted-foreground mb-2">
                                  Relevance to Diagnosis
                                </h5>
                                <p className="text-sm">{image.relevance}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  {/* Conclusion Tab */}
                  <TabsContent value="conclusion" className="p-6">
                    <div className="rounded-lg border bg-gray-50 dark:bg-gray-800/50 p-6">
                      <h3 className="text-xl font-medium mb-4">
                        Diagnostic Conclusion
                      </h3>
                      <p className="leading-relaxed mb-6">
                        {diagnosisResult.conclusion}
                      </p>

                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <h4 className="text-yellow-800 font-medium mb-2 flex items-center gap-2">
                          <AlertCircle className="h-4 w-4" />
                          Important Note
                        </h4>
                        <p className="text-yellow-700 text-sm">
                          This is a tentative diagnosis based on AI analysis of
                          the provided images and clinical history. For
                          confirmation, laboratory testing is recommended.
                          Consider consulting with a specialist for further
                          evaluation and treatment recommendations.
                        </p>
                      </div>

                      <div className="mt-6 flex justify-end">
                        <Button
                          onClick={() => setIsSpecialistModalOpen(true)}
                          className="bg-teal-600 hover:bg-teal-700"
                        >
                          Contact a Specialist
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Specialist Contact Modal */}
      <SpecialistContactModal
        open={isSpecialistModalOpen}
        onOpenChange={setIsSpecialistModalOpen}
        diagnosisResult={diagnosisResult}
      />
    </div>
  );
}
