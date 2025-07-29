"use client";
import { useState } from "react";
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, X, Upload, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { SpecialistContactModal } from "@/components/diagnosis/specialist-contact-modal";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

const historySchema = z
  .object({
    Species: z.literal("Chicken"),
    Age: z
      .string()
      .min(1, { message: "Age is required" })
      .refine((val) => {
        const trimmed = val.trim();
        // Check if it's just a number without time unit
        return !/^\d+$/.test(trimmed);
      }, {
        message: "Please include a time unit (e.g., 'days', 'weeks', 'months', 'years')"
      })
      .refine((val) => {
        const trimmed = val.trim();
        // Check if it's just a time unit without number
        return !/^(day|days|week|weeks|month|months|year|years)$/i.test(trimmed);
      }, {
        message: "Please include a number before the time unit (e.g., '2 weeks', '3 months')"
      })
      .refine((val) => {
        const trimmed = val.trim();
        // Check for invalid abbreviations or formats
        return !(
          /^\d+\s*(wks|mths|yrs|d|w|m|y)$/i.test(trimmed) || 
          /^\d+-\w+$/i.test(trimmed) ||
          /^\d+\w+$/i.test(trimmed)
        );
      }, {
        message: "Please use full words separated by space (e.g., '2 weeks' not '2wks' or '2-weeks')"
      })
      .refine((val) => {
        const trimmed = val.trim();
        // Final validation for correct format
        return /^\d+\s+(day|days|week|weeks|month|months|year|years)$/i.test(trimmed);
      }, {
        message: "Format must be: number + space + time unit (e.g., '2 weeks', '3 months', '1 year')"
      }),
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
  })
  .refine((data) => data["Total Affected"] <= data["Total Birds in Farm"], {
    message: "Total affected cannot exceed total birds in farm",
    path: ["Total Affected"],
  })
  .refine((data) => data["Total Deaths"] <= data["Total Affected"], {
    message: "Total deaths cannot exceed total affected",
    path: ["Total Deaths"],
  })
  .refine((data) => data["Total Deaths"] <= data["Total Birds in Farm"], {
    message: "Total deaths cannot exceed total birds in farm",
    path: ["Total Deaths"],
  });

type HistoryFormValues = z.infer<typeof historySchema>;

export default function DiagnosisPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSpecialistModalOpen, setIsSpecialistModalOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [diagnosisResult, setDiagnosisResult] = useState<any>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);
  const form = useForm<HistoryFormValues>({
    resolver: zodResolver(historySchema),
    defaultValues: {
      Species: "Chicken",
      Age: "",
      "Clinical Signs": "",
      "Post-Mortem Findings": "",
      "Total Birds in Farm": 0,
      "Total Affected": 0,
      "Total Deaths": 0,
    },
  });
  const router = useRouter();

  // Image handlers (unchanged)
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages = Array.from(e.target.files);
      setSelectedImages((prevImages) => [...prevImages, ...newImages]);
      const newImageUrls = newImages.map((image) => {
        try {
          return URL.createObjectURL(image);
        } catch {
          return "";
        }
      });
      setImagePreviewUrls((prevUrls) => [...prevUrls, ...newImageUrls]);
    }
  };
  const removeImage = (index: number) => {
    const urlToRevoke = imagePreviewUrls[index];
    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
    setImagePreviewUrls((prevUrls) => prevUrls.filter((_, i) => i !== index));
    if (urlToRevoke) {
      try {
        URL.revokeObjectURL(urlToRevoke);
      } catch {}
    }
  };
  const clearAllImages = () => {
    imagePreviewUrls.forEach((url) => URL.revokeObjectURL(url));
    setSelectedImages([]);
    setImagePreviewUrls([]);
  };

  async function onSubmit(data: HistoryFormValues) {
    console.log("Starting the diagnosis process with data:");
    setFormError(null);
    if (selectedImages.length === 0) {
      setFormError("Please upload at least one image for diagnosis");
      return;
    }
    setIsLoading(true);
    setDiagnosisResult(null);
    try {
      const formData = new FormData();
      selectedImages.forEach((image) => {
        formData.append("images", image);
      });

      formData.append("history", JSON.stringify(data));

      console.log("Making API request to /api/diagnosis/predict with data:");
      const response = await fetch(`/api/diagnosis/predict`, {
        method: "POST",
        body: formData,
      });

      console.log("*********API response:************", response);
      if (!response.ok) {
        setFormError("Failed to get diagnosis. Please try again.");
        setIsLoading(false);
        return;
      }
      const result = await response.json();
      if (result && result.id) {
        toast("Your diagnosis has been successfully processed.");
        router.push(`/diagnosis/${result.id}`);
      } else {
        setFormError("Diagnosis failed. Please try again.");
      }
      setIsLoading(false);
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "Failed to get diagnosis. Please try again."
      );
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 py-12 px-4 md:px-6">
        <div className="px-4 md:container">
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
                          className="relative rounded-md overflow-hidden h-24 bg-muted cursor-pointer"
                          onClick={() => {
                            setModalIndex(index);
                            setModalOpen(true);
                          }}
                        >
                          {url ? (
                            <img
                              src={url || "/placeholder.svg"}
                              alt={`Preview ${index + 1}`}
                              className="h-full w-full object-cover"
                              onError={(e) => {
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
                            onClick={(e) => {
                              e.stopPropagation();
                              removeImage(index);
                            }}
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
                {formError && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{formError}</AlertDescription>
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
                  <form
                    className="space-y-4"
                    onSubmit={form.handleSubmit(onSubmit)}
                  >
                    <FormField
                      control={form.control}
                      name="Species"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Species</FormLabel>
                          <FormControl>
                            <Input value="Chicken" readOnly disabled />
                          </FormControl>
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
                            <Input placeholder="e.g., 16 weeks, 3 months, 1 year" {...field} />
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
                    <Button
                      type="submit"
                      className="w-full px-8 py-6 text-lg bg-teal-600 hover:bg-teal-700"
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
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <SpecialistContactModal
        open={isSpecialistModalOpen}
        onOpenChange={setIsSpecialistModalOpen}
        diagnosisResult={diagnosisResult}
      />
      {/* Modal for expanded image preview */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl w-full flex flex-col items-center p-0 sm:p-4">
          <div className="relative w-full flex items-center justify-center min-h-[40vh] md:min-h-[60vh]">
            <button
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow hover:bg-white z-10"
              onClick={() =>
                setModalIndex((prev) =>
                  prev > 0 ? prev - 1 : imagePreviewUrls.length - 1
                )
              }
              aria-label="Previous image"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
            <Image
              width={1200}
              height={1200}
              src={imagePreviewUrls[modalIndex]}
              alt={`Preview ${modalIndex + 1}`}
              className=" min-h-[35vh] w-full rounded shadow-lg object-contain  bg-black"
              style={{ background: "#000" }}
              priority
            />
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow hover:bg-white z-10"
              onClick={() =>
                setModalIndex((prev) =>
                  prev < imagePreviewUrls.length - 1 ? prev + 1 : 0
                )
              }
              aria-label="Next image"
            >
              <ChevronRight className="h-8 w-8" />
            </button>
          </div>
          <div className="pb-2 text-center text-sm text-muted-foreground">
            Image {modalIndex + 1} of {imagePreviewUrls.length}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
