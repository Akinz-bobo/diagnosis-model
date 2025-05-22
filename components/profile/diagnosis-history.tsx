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
import type { DiagnosisResult } from "@/lib/types";
import { Calendar, ChevronRight, Filter, Search } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FileText } from "lucide-react"; // Import FileText here

export function DiagnosisHistory() {
  //   const { user } = useCurrentUser();
  let user = {
    id: "1",
    image: "https://placeholder.png",
    email: "user@example.com",
    full_name: "John Doe",
    role: "admin",
    emailVerified: true,
    createdAt: new Date().toISOString(),
  };
  const [diagnoses, setDiagnoses] = useState<DiagnosisResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("grid");
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchDiagnoses() {
      if (user?.id) {
        try {
          const data = await getDiagnoses(user.id);
          setDiagnoses(data);
        } catch (error) {
          console.error("Error fetching diagnoses:", error);
        } finally {
          setLoading(false);
        }
      }
    }

    fetchDiagnoses();
  }, [user?.id]);

  const filteredDiagnoses = diagnoses.filter((diagnosis) => {
    if (filter !== "all" && diagnosis.species.toLowerCase() !== filter) {
      return false;
    }

    if (
      searchQuery &&
      !diagnosis.disease.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return "bg-green-500";
    if (confidence >= 0.7) return "bg-teal-500";
    if (confidence >= 0.5) return "bg-amber-500";
    return "bg-red-500";
  };

  const formatDate = (dateString: string) => {
    if (
      dateString === "Just now" ||
      dateString === "Yesterday" ||
      dateString.includes("hours ago") ||
      dateString.includes("days ago") ||
      dateString.includes("week ago")
    ) {
      return dateString;
    }

    // Assume it's a date string otherwise
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
            {filteredDiagnoses.length}
          </Badge>
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

      <TabsContent value="grid" className="mt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDiagnoses.map((diagnosis, index) => (
            <motion.div
              key={diagnosis.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        {diagnosis.disease}
                      </CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <Badge
                          variant="outline"
                          className="mr-2 bg-blue-50 text-blue-700 hover:bg-blue-50"
                        >
                          {diagnosis.species}
                        </Badge>
                        <div className="flex items-center text-muted-foreground text-xs">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(diagnosis.date)}
                        </div>
                      </CardDescription>
                    </div>
                    <Badge className="bg-amber-500 hover:bg-amber-600">
                      Tentative
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-1 text-sm">
                      <span>Confidence</span>
                      <span className="font-medium">
                        {Math.round(diagnosis.confidence * 100)}%
                      </span>
                    </div>
                    <Progress
                      value={diagnosis.confidence * 100}
                      className={getConfidenceColor(diagnosis.confidence)}
                    />
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {diagnosis.background ||
                      "No additional information available for this diagnosis."}
                  </p>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button asChild variant="outline" className="w-full">
                    <Link
                      href={`/dashboard/diagnoses/${diagnosis.id}`}
                      className="flex items-center justify-center"
                    >
                      View Details
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="list" className="mt-0">
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {filteredDiagnoses.map((diagnosis, index) => (
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
                          diagnosis.confidence
                        )}`}
                      ></div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{diagnosis.disease}</h3>
                          <Badge className="bg-amber-500 hover:bg-amber-600">
                            Tentative
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
                            {formatDate(diagnosis.date)}
                          </div>
                          <div className="text-xs font-medium">
                            Confidence: {Math.round(diagnosis.confidence * 100)}
                            %
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/dashboard/diagnoses/${diagnosis.id}`}>
                        <span className="sr-only sm:not-sr-only sm:mr-2">
                          Details
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
      </TabsContent>
    </div>
  );
}
