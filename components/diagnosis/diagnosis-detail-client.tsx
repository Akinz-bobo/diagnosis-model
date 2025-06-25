"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { DiagnosisResult } from "@/lib/types";
import {
  ArrowLeft,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Share2,
  Microscope,
  Activity,
  FileText,
  ImageIcon,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { SpecialistContactModal } from "@/components/diagnosis/specialist-contact-modal";

interface DiagnosisDetailClientProps {
  diagnosis: DiagnosisResult;
}

export function DiagnosisDetailClient({
  diagnosis,
}: DiagnosisDetailClientProps) {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

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
        return <AlertTriangle className="h-4 w-4" />;
      case "moderate":
        return <Clock className="h-4 w-4" />;
      case "low":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button asChild variant="ghost" className="mb-4">
            <Link href="/profile" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Profile
            </Link>
          </Button>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold capitalize mb-2">
                {diagnosis.diagnosis.disease}
              </h1>
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {formatDate(diagnosis.date)}
                </div>
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  {diagnosis.species}
                </Badge>
                <Badge
                  className={`${getUrgencyColor(
                    diagnosis.lesion_bedrock.urgency
                  )} flex items-center gap-1`}
                >
                  {getUrgencyIcon(diagnosis.lesion_bedrock.urgency)}
                  {diagnosis.lesion_bedrock.urgency}
                </Badge>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download Report
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
              <Button
                onClick={() => setIsContactModalOpen(true)}
                className="bg-teal-600 hover:bg-teal-700 flex items-center gap-2"
              >
                <Users className="h-4 w-4" />
                Contact Specialist
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Analysis */}
          <div className="lg:col-span-2 space-y-6">
            {/* Diagnosis Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Microscope className="h-5 w-5 text-teal-600" />
                    Diagnosis Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        Primary Diagnosis
                      </h3>
                      <p className="text-2xl font-bold text-teal-600 capitalize mb-2">
                        {diagnosis.diagnosis.disease}
                      </p>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span>Confidence Level</span>
                          <span className="font-medium">
                            {Math.round(diagnosis.diagnosis.confidence * 100)}%
                          </span>
                        </div>
                        <Progress
                          value={diagnosis.diagnosis.confidence * 100}
                          className={`h-3 ${getConfidenceColor(
                            diagnosis.diagnosis.confidence
                          )}`}
                        />
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        Clinical Metrics
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">
                            Mortality Rate
                          </span>
                          <span className="font-medium">
                            {(
                              diagnosis.clinical_context.mortality_rate * 100
                            ).toFixed(1)}
                            %
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">
                            Clinical Consistency
                          </span>
                          <span className="font-medium">
                            {Math.round(
                              diagnosis.clinical_context.history_analysis
                                .clinical_consistency_score * 100
                            )}
                            %
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">
                            Risk Score
                          </span>
                          <span className="font-medium">
                            {Math.round(
                              diagnosis.clinical_context.history_analysis
                                .mortality_risk_score * 100
                            )}
                            %
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-semibold mb-3">
                      Differential Diagnoses
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {diagnosis.diagnosis.differential_diagnoses.map(
                        (diff, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="capitalize"
                          >
                            {diff}
                          </Badge>
                        )
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Image Analysis */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-teal-600" />
                    Image Analysis Results
                  </CardTitle>
                  <CardDescription>
                    {diagnosis.image_analysis.processed_images.length} images
                    analyzed,{" "}
                    {diagnosis.image_analysis.total_lesions_identified} lesions
                    identified
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {diagnosis.image_analysis.processed_images.map(
                      (image, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative w-full md:w-48 h-48 rounded-lg overflow-hidden">
                              <Image
                                src={image.url || "/placeholder.svg"}
                                alt={`Analysis ${index + 1}`}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 space-y-3">
                              <h4 className="font-semibold">
                                Image {index + 1} Analysis
                              </h4>
                              <div>
                                <span className="text-sm font-medium">
                                  Lesions Detected:
                                </span>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {image.lesions.map((lesion, lesionIndex) => (
                                    <Badge
                                      key={lesionIndex}
                                      variant="outline"
                                      className="flex items-center gap-1"
                                    >
                                      <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                                      {lesion}
                                      <span className="text-xs">
                                        (
                                        {Math.round(
                                          image.confidences[lesionIndex] * 100
                                        )}
                                        %)
                                      </span>
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <span className="text-sm font-medium">
                                  Relevance to Diagnosis:
                                </span>
                                <div className="mt-1 space-y-1">
                                  {Object.entries(image.relevance).map(
                                    ([lesion, relevance]) => (
                                      <div
                                        key={lesion}
                                        className="flex justify-between text-sm"
                                      >
                                        <span>{lesion}</span>
                                        <span className="font-medium">
                                          {Math.round(relevance * 100)}%
                                        </span>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Clinical Analysis */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-teal-600" />
                    Clinical Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="background" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="background">Background</TabsTrigger>
                      <TabsTrigger value="history">
                        History Analysis
                      </TabsTrigger>
                      <TabsTrigger value="lesions">Lesion Details</TabsTrigger>
                    </TabsList>

                    <TabsContent value="background" className="mt-4">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">
                            Clinical Background
                          </h4>
                          <ScrollArea className="h-64 w-full rounded border p-4">
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">
                              {diagnosis.clinical_context.background}
                            </p>
                          </ScrollArea>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Conclusion</h4>
                          <p className="text-sm leading-relaxed p-4 bg-muted rounded-lg">
                            {diagnosis.clinical_context.conclusion}
                          </p>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="history" className="mt-4">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Summary</h4>
                          <p className="text-sm leading-relaxed p-4 bg-muted rounded-lg">
                            {
                              diagnosis.clinical_context.history_analysis
                                .summary
                            }
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold mb-2">
                              Species-Related Issues
                            </h4>
                            <ul className="space-y-2">
                              {diagnosis.clinical_context.history_analysis.species_issues.map(
                                (issue, index) => (
                                  <li
                                    key={index}
                                    className="text-sm p-2 bg-blue-50 rounded border-l-4 border-blue-400"
                                  >
                                    {issue}
                                  </li>
                                )
                              )}
                            </ul>
                          </div>

                          <div>
                            <h4 className="font-semibold mb-2">
                              Age-Related Issues
                            </h4>
                            <ul className="space-y-2">
                              {diagnosis.clinical_context.history_analysis.age_issues.map(
                                (issue, index) => (
                                  <li
                                    key={index}
                                    className="text-sm p-2 bg-amber-50 rounded border-l-4 border-amber-400"
                                  >
                                    {issue}
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="lesions" className="mt-4">
                      <div className="space-y-4">
                        {Object.entries(
                          diagnosis.lesion_bedrock.lesion_relevance
                        ).map(([lesion, relevance]) => (
                          <div key={lesion} className="border rounded-lg p-4">
                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                              <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
                              {lesion}
                            </h4>
                            <p className="text-sm leading-relaxed text-muted-foreground">
                              {relevance}
                            </p>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - Summary & Actions */}
          <div className="space-y-6">
            {/* Urgency Alert */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card
                className={`border-l-4 ${
                  diagnosis.lesion_bedrock.urgency.toLowerCase() === "urgent"
                    ? "border-red-500"
                    : diagnosis.lesion_bedrock.urgency.toLowerCase() ===
                      "moderate"
                    ? "border-amber-500"
                    : "border-green-500"
                }`}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {getUrgencyIcon(diagnosis.lesion_bedrock.urgency)}
                    Urgency Level
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge
                    className={`${getUrgencyColor(
                      diagnosis.lesion_bedrock.urgency
                    )} mb-3`}
                  >
                    {diagnosis.lesion_bedrock.urgency}
                  </Badge>
                  <p className="text-sm leading-relaxed">
                    {diagnosis.lesion_bedrock.urgency_reason}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recommendations */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-teal-600" />
                    Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {diagnosis.suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-teal-600" />
                    Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Images Processed
                    </span>
                    <Badge variant="secondary">
                      {diagnosis.image_analysis.processed_images.length}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Total Lesions
                    </span>
                    <Badge variant="secondary">
                      {diagnosis.image_analysis.total_lesions_identified}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Differential Diagnoses
                    </span>
                    <Badge variant="secondary">
                      {diagnosis.diagnosis.differential_diagnoses.length}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Analysis ID
                    </span>
                    <Badge variant="outline" className="font-mono text-xs">
                      {diagnosis.id}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Warnings */}
            {diagnosis.warnings && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card className="border-amber-200 bg-amber-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-amber-800">
                      <AlertTriangle className="h-5 w-5" />
                      Warnings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-amber-700">
                      {diagnosis.warnings}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Specialist Contact Modal */}
      <SpecialistContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        diagnosis={diagnosis}
      />
    </div>
  );
}
