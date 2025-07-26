"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { getDiagnoses } from "@/lib/actions/diagnoses";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useFilteredDiagnoses } from "@/hooks/use-diagnoses";
import type { DiagnosisResult } from "@/lib/types";
import {
  Calendar,
  ChevronRight,
  Filter,
  Search,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import Image from "next/image";

export function DiagnosisHistory() {
  const [view, setView] = useState("grid");
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Use the centralized diagnosis hook
  const { 
    diagnoses: filteredDiagnoses, 
    allDiagnoses: diagnoses,
    loading, 
    error,
    totalCount,
    filteredCount 
  } = useFilteredDiagnoses({
    searchQuery,
    filter,
    sortBy: 'date',
    sortOrder: 'desc'
  });
  // Pagination logic
  const itemsPerPage = view === "grid" ? 4 : 6;
  const totalPages = Math.ceil(filteredDiagnoses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedDiagnoses = filteredDiagnoses.slice(startIndex, endIndex);

  // Reset to page 1 when filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchQuery, view]);

  // Adjust current page if it exceeds total pages after view change
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  console.log("Diagnosis: ", paginatedDiagnoses);

  const PaginationControls = () => {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
      const pages = [];
      const maxVisible = 5;

      if (totalPages <= maxVisible) {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        if (currentPage <= 3) {
          for (let i = 1; i <= 4; i++) pages.push(i);
          pages.push("...");
          pages.push(totalPages);
        } else if (currentPage >= totalPages - 2) {
          pages.push(1);
          pages.push("...");
          for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
        } else {
          pages.push(1);
          pages.push("...");
          for (let i = currentPage - 1; i <= currentPage + 1; i++)
            pages.push(i);
          pages.push("...");
          pages.push(totalPages);
        }
      }
      return pages;
    };

    return (
      <div className="flex items-center justify-center gap-2 mt-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="h-9 px-3"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>

        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) => (
            <div key={index}>
              {page === "..." ? (
                <span className="px-3 py-2 text-muted-foreground">...</span>
              ) : (
                <Button
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page as number)}
                  className={`h-9 w-9 p-0 ${
                    currentPage === page
                      ? "bg-teal-600 hover:bg-teal-700 text-white"
                      : "hover:bg-muted"
                  }`}
                >
                  {page}
                </Button>
              )}
            </div>
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="h-9 px-3"
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    );
  };
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return "bg-green-500";
    if (confidence >= 0.7) return "bg-teal-500";
    if (confidence >= 0.5) return "bg-amber-500";
    return "bg-red-500";
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency.toLowerCase()) {
      case "urgent":
        return "bg-red-500 text-white";
      case "moderate":
        return "bg-amber-500 text-white";
      case "low":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency.toLowerCase()) {
      case "urgent":
        return <AlertTriangle className="h-3 w-3" />;
      case "moderate":
        return <Clock className="h-3 w-3" />;
      case "low":
        return <CheckCircle className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  const formatDate = (dateString: string) => {
    if (
      dateString === "Just now" ||
      dateString === "Yesterday" ||
      dateString?.includes("hours ago") ||
      dateString?.includes("days ago") ||
      dateString?.includes("week ago")
    ) {
      return dateString;
    }

    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-48 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (diagnoses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Diagnosis History</CardTitle>
          <CardDescription>You haven't made any diagnoses yet</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <div className="rounded-full bg-muted p-6 mb-4">
            <FileText className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No diagnoses found</h3>
          <p className="text-muted-foreground text-center max-w-md mb-6">
            Start by submitting a new diagnosis request to see your history
            here.
          </p>
          <Button asChild className="bg-teal-600 hover:bg-teal-700">
            <Link href="/diagnosis">New Diagnosis</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold">Diagnosis History</h2>
          <Badge variant="outline" className="ml-2">
            {filteredCount}
          </Badge>
          {totalPages > 1 && (
            <div className="hidden sm:flex items-center gap-1 text-sm text-muted-foreground ml-2">
              <span>•</span>
              <span>
                Page {currentPage} of {totalPages}
              </span>
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search diagnoses..."
              className="pl-8 w-[200px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[130px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Species</SelectItem>
              <SelectItem value="chicken">Chicken</SelectItem>
              <SelectItem value="duck">Duck</SelectItem>
              <SelectItem value="turkey">Turkey</SelectItem>
              <SelectItem value="goose">Goose</SelectItem>
            </SelectContent>
          </Select>

          <Tabs
            value={view}
            onValueChange={setView}
            className="hidden sm:block"
          >
            <TabsList className="h-10">
              <TabsTrigger value="grid" className="px-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-grid-2x2"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" />
                  <path d="M3 12h18" />
                  <path d="M12 3v18" />
                </svg>
              </TabsTrigger>
              <TabsTrigger value="list" className="px-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-list"
                >
                  <line x1="8" x2="21" y1="6" y2="6" />
                  <line x1="8" x2="21" y1="12" y2="12" />
                  <line x1="8" x2="21" y1="18" y2="18" />
                  <line x1="3" x2="3.01" y1="6" y2="6" />
                  <line x1="3" x2="3.01" y1="12" y2="12" />
                  <line x1="3" x2="3.01" y1="18" y2="18" />
                </svg>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {filteredDiagnoses.length > 0 && totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div>
            Showing {startIndex + 1}-
            {Math.min(endIndex, filteredDiagnoses.length)} of{" "}
            {filteredDiagnoses.length} results
          </div>
          <div className="hidden sm:block">{itemsPerPage} per page</div>
        </div>
      )}

      <Tabs value={view} onValueChange={setView}>
        <TabsContent value="grid" className="mt-0">
          {paginatedDiagnoses.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="rounded-full bg-muted p-6 mb-4">
                  <FileText className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  No diagnoses found
                </h3>
                <p className="text-muted-foreground text-center max-w-md mb-6">
                  {searchQuery || filter !== "all"
                    ? "Try adjusting your search criteria or filters."
                    : "Start by submitting a new diagnosis request to see your history here."}
                </p>
                {!searchQuery && filter === "all" && (
                  <Button asChild className="bg-teal-600 hover:bg-teal-700">
                    <Link href="/diagnosis">New Diagnosis</Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paginatedDiagnoses.map((diagnosis, index) => (
                  <motion.div
                    key={diagnosis.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="overflow-hidden hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <CardTitle className="text-lg capitalize">
                              {diagnosis.diagnosis.disease}
                            </CardTitle>
                            <CardDescription className="flex items-center mt-1 gap-2">
                              <Badge
                                variant="outline"
                                className="bg-blue-50 text-blue-700 hover:bg-blue-50"
                              >
                                {diagnosis.species}
                              </Badge>
                              <div className="flex items-center text-muted-foreground text-xs">
                                <Calendar className="h-3 w-3 mr-1" />
                                {formatDate(diagnosis.created_at)}
                              </div>
                            </CardDescription>
                          </div>
                          <Badge
                            className={`${getUrgencyColor(
                              diagnosis.lesion_bedrock.urgency
                            )} flex items-center gap-1`}
                          >
                            {getUrgencyIcon(diagnosis.lesion_bedrock.urgency)}
                            {diagnosis.lesion_bedrock.urgency}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-4">
                          <div className="flex justify-between items-center mb-1 text-sm">
                            <span>Confidence</span>
                            <span className="font-medium">
                              {Math.round(diagnosis.diagnosis.confidence * 100)}
                              %
                            </span>
                          </div>
                          <Progress
                            value={diagnosis.diagnosis.confidence * 100}
                            className={`h-2 ${getConfidenceColor(
                              diagnosis.diagnosis.confidence
                            )}`}
                          />
                        </div>

                        <div className="mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-medium">
                              Images Analyzed:
                            </span>
                            <Badge variant="secondary">
                              {diagnosis.image_analysis.processed_images.length}
                            </Badge>
                          </div>
                          <div className="flex gap-1 overflow-hidden">
                            {diagnosis.image_analysis.processed_images
                              .slice(0, 3)
                              .map((image, idx) => (
                                <div
                                  key={idx}
                                  className="relative w-12 h-12 rounded border overflow-hidden"
                                >
                                  <Image
                                    src={image.url || "/placeholder.svg"}
                                    alt={`Analysis ${idx + 1}`}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              ))}
                            {diagnosis.image_analysis.processed_images.length >
                              3 && (
                              <div className="w-12 h-12 rounded border bg-muted flex items-center justify-center text-xs">
                                +
                                {diagnosis.image_analysis.processed_images
                                  .length - 3}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="mb-4">
                          <span className="text-sm font-medium">
                            Lesions Identified:
                          </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {diagnosis.image_analysis.processed_images
                              .flatMap((img) => img.lesions)
                              .slice(0, 2)
                              .map((lesion, idx) => (
                                <Badge
                                  key={idx}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {lesion}
                                </Badge>
                              ))}
                            {diagnosis.image_analysis.total_lesions_identified >
                              2 && (
                              <Badge variant="outline" className="text-xs">
                                +
                                {diagnosis.image_analysis
                                  .total_lesions_identified - 2}{" "}
                                more
                              </Badge>
                            )}
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {diagnosis.clinical_context.history_analysis.summary}
                        </p>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Button asChild variant="outline" className="w-full">
                          <Link
                            href={`/diagnosis/${diagnosis.id}`}
                            className="flex items-center justify-center"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Full Analysis
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>
              {filteredDiagnoses.length > 0 && <PaginationControls />}
            </>
          )}
        </TabsContent>{" "}
        <TabsContent value="list" className="mt-0">
          {paginatedDiagnoses.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="rounded-full bg-muted p-6 mb-4">
                  <FileText className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  No diagnoses found
                </h3>
                <p className="text-muted-foreground text-center max-w-md mb-6">
                  {searchQuery || filter !== "all"
                    ? "Try adjusting your search criteria or filters."
                    : "Start by submitting a new diagnosis request to see your history here."}
                </p>
                {!searchQuery && filter === "all" && (
                  <Button asChild className="bg-teal-600 hover:bg-teal-700">
                    <Link href="/diagnosis">New Diagnosis</Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <>
              <Card>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {paginatedDiagnoses.map((diagnosis, index) => (
                      <motion.div
                        key={diagnosis.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="p-4 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-2 h-12 rounded-full ${getConfidenceColor(
                                diagnosis.diagnosis.confidence
                              )}`}
                            ></div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium capitalize">
                                  {diagnosis.diagnosis.disease}
                                </h3>
                                <Badge
                                  className={`${getUrgencyColor(
                                    diagnosis.lesion_bedrock.urgency
                                  )} flex items-center gap-1`}
                                >
                                  {getUrgencyIcon(
                                    diagnosis.lesion_bedrock.urgency
                                  )}
                                  {diagnosis.lesion_bedrock.urgency}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-3 mt-1">
                                <Badge
                                  variant="outline"
                                  className="bg-blue-50 text-blue-700 hover:bg-blue-50"
                                >
                                  {diagnosis.species}
                                </Badge>
                                <div className="flex items-center text-muted-foreground text-xs">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {formatDate(diagnosis.created_at)}
                                </div>
                                <div className="text-xs font-medium">
                                  Confidence:{" "}
                                  {Math.round(
                                    diagnosis.diagnosis.confidence * 100
                                  )}
                                  %
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {
                                    diagnosis.image_analysis
                                      .total_lesions_identified
                                  }{" "}
                                  lesions
                                </div>
                              </div>
                            </div>
                          </div>
                          <Button asChild variant="ghost" size="sm">
                            <Link href={`/diagnosis/${diagnosis.id}`}>
                              <span className="sr-only sm:not-sr-only sm:mr-2">
                                View Analysis
                              </span>
                              <ChevronRight className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              {filteredDiagnoses.length > 0 && <PaginationControls />}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
