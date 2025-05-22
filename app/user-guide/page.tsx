import type { Metadata } from "next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, Download, Printer } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "User Guide - Vetable",
  description:
    "Comprehensive guide for animal handlers on using the Vetable platform effectively",
};

export default function UserGuidePage() {
  return (
    <div className="container max-w-7xl py-10">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="font-heading text-4xl md:text-5xl">
            Vetable User Guide
          </h1>
          <p className="text-xl text-muted-foreground">
            A comprehensive guide for animal handlers to effectively use the
            Vetable platform
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          <Button variant="outline" className="gap-2">
            <Download size={16} />
            Download Guide
          </Button>
          <Button variant="outline" className="gap-2">
            <Printer size={16} />
            Print Guide
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-3 bg-gradient-to-r from-teal-50 to-teal-100 dark:from-teal-950 dark:to-teal-900 border-teal-200 dark:border-teal-800">
            <CardContent className="p-6 md:p-8">
              <div className="grid md:grid-cols-2 gap-6 items-center">
                <div className="space-y-4">
                  <h2 className="font-heading text-2xl md:text-3xl">
                    Getting Started with Vetable
                  </h2>
                  <p className="text-muted-foreground">
                    Vetable is an advanced AI-powered platform designed to
                    assist veterinary professionals in diagnosing animal
                    diseases through post-mortem examination. This guide will
                    help you understand how to use the platform effectively and
                    get the most accurate results.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button asChild>
                      <Link href="#post-mortem-guide">Post-Mortem Guide</Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link href="#history-taking">History Taking</Link>
                    </Button>
                  </div>
                </div>
                <div className="relative h-[250px] rounded-lg overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=500&width=800"
                    alt="Veterinarian using Vetable platform"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full md:w-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="preparation">Preparation</TabsTrigger>
            <TabsTrigger value="post-mortem">Post-Mortem</TabsTrigger>
            <TabsTrigger value="history">History Taking</TabsTrigger>
            <TabsTrigger value="platform">Using Platform</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-3">
                <CardContent className="p-6">
                  <h2 className="font-heading text-2xl mb-4">
                    Overview of the Vetable Platform
                  </h2>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <div className="h-12 w-12 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center">
                        <span className="font-heading text-xl text-teal-700 dark:text-teal-300">
                          1
                        </span>
                      </div>
                      <h3 className="text-lg font-medium">
                        Register & Sign In
                      </h3>
                      <p className="text-muted-foreground">
                        Create an account or sign in to access the full features
                        of the Vetable platform.
                      </p>
                    </div>
                    <div className="space-y-3">
                      <div className="h-12 w-12 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center">
                        <span className="font-heading text-xl text-teal-700 dark:text-teal-300">
                          2
                        </span>
                      </div>
                      <h3 className="text-lg font-medium">Prepare & Examine</h3>
                      <p className="text-muted-foreground">
                        Follow the post-mortem guide to properly examine the
                        animal and document findings.
                      </p>
                    </div>
                    <div className="space-y-3">
                      <div className="h-12 w-12 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center">
                        <span className="font-heading text-xl text-teal-700 dark:text-teal-300">
                          3
                        </span>
                      </div>
                      <h3 className="text-lg font-medium">Upload & Analyze</h3>
                      <p className="text-muted-foreground">
                        Upload images and provide history information for AI
                        analysis and diagnosis.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardContent className="p-6">
                  <h2 className="font-heading text-2xl mb-4">Key Benefits</h2>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mt-0.5">
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
                          className="text-green-600 dark:text-green-400"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">Accurate Diagnoses</p>
                        <p className="text-sm text-muted-foreground">
                          AI-powered analysis provides accurate disease
                          identification based on visual evidence and history.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mt-0.5">
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
                          className="text-green-600 dark:text-green-400"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">Time Efficiency</p>
                        <p className="text-sm text-muted-foreground">
                          Receive diagnoses quickly, allowing for faster
                          decision-making and treatment planning.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mt-0.5">
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
                          className="text-green-600 dark:text-green-400"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">Specialist Access</p>
                        <p className="text-sm text-muted-foreground">
                          Connect with veterinary specialists for consultation
                          on complex cases.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mt-0.5">
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
                          className="text-green-600 dark:text-green-400"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">Comprehensive Records</p>
                        <p className="text-sm text-muted-foreground">
                          Maintain detailed records of all diagnoses for future
                          reference and analysis.
                        </p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h2 className="font-heading text-2xl mb-4">Getting Help</h2>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      If you need assistance with using the Vetable platform,
                      there are several resources available:
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <ChevronRight size={16} className="text-teal-600" />
                        <span>Contact our support team</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <ChevronRight size={16} className="text-teal-600" />
                        <span>Visit our FAQ section</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <ChevronRight size={16} className="text-teal-600" />
                        <span>Watch tutorial videos</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <ChevronRight size={16} className="text-teal-600" />
                        <span>Join our community forum</span>
                      </li>
                    </ul>
                    <Button className="w-full mt-2">Contact Support</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="preparation" className="space-y-6">
            <Card id="preparation-guide">
              <CardContent className="p-6">
                <h2 className="font-heading text-2xl mb-4">
                  Preparation for Post-Mortem Examination
                </h2>

                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-xl font-medium">
                        Required Equipment
                      </h3>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-3">
                          <div className="h-6 w-6 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center mt-0.5">
                            <span className="text-sm font-medium text-teal-700 dark:text-teal-300">
                              1
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">
                              Personal Protective Equipment (PPE)
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Gloves, masks, eye protection, and protective
                              clothing
                            </p>
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="h-6 w-6 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center mt-0.5">
                            <span className="text-sm font-medium text-teal-700 dark:text-teal-300">
                              2
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">Dissection Tools</p>
                            <p className="text-sm text-muted-foreground">
                              Scalpels, scissors, forceps, and bone cutters
                            </p>
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="h-6 w-6 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center mt-0.5">
                            <span className="text-sm font-medium text-teal-700 dark:text-teal-300">
                              3
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">
                              Documentation Materials
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Camera, measuring tape, labels, and specimen
                              containers
                            </p>
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="h-6 w-6 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center mt-0.5">
                            <span className="text-sm font-medium text-teal-700 dark:text-teal-300">
                              4
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">Disinfection Supplies</p>
                            <p className="text-sm text-muted-foreground">
                              Disinfectants, cleaning materials, and waste
                              disposal bags
                            </p>
                          </div>
                        </li>
                      </ul>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-xl font-medium">Workspace Setup</h3>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-3">
                          <div className="h-6 w-6 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center mt-0.5">
                            <span className="text-sm font-medium text-teal-700 dark:text-teal-300">
                              1
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">Clean, Well-Lit Area</p>
                            <p className="text-sm text-muted-foreground">
                              Ensure adequate lighting and a clean, flat surface
                              for examination
                            </p>
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="h-6 w-6 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center mt-0.5">
                            <span className="text-sm font-medium text-teal-700 dark:text-teal-300">
                              2
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">Proper Drainage</p>
                            <p className="text-sm text-muted-foreground">
                              Set up in an area with proper drainage and waste
                              disposal
                            </p>
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="h-6 w-6 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center mt-0.5">
                            <span className="text-sm font-medium text-teal-700 dark:text-teal-300">
                              3
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">Biosecurity Measures</p>
                            <p className="text-sm text-muted-foreground">
                              Implement biosecurity protocols to prevent disease
                              spread
                            </p>
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="h-6 w-6 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center mt-0.5">
                            <span className="text-sm font-medium text-teal-700 dark:text-teal-300">
                              4
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">Temperature Control</p>
                            <p className="text-sm text-muted-foreground">
                              Maintain appropriate temperature to preserve
                              tissue integrity
                            </p>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="text-lg font-medium mb-2">
                      Important Safety Considerations
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Post-mortem examinations carry potential health risks.
                      Always follow these safety guidelines:
                    </p>
                    <ul className="grid md:grid-cols-2 gap-2 text-sm">
                      <li className="flex items-center gap-2">
                        <div className="h-5 w-5 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-red-600 dark:text-red-400"
                          >
                            <path d="M18 6 6 18"></path>
                            <path d="m6 6 12 12"></path>
                          </svg>
                        </div>
                        <span>
                          Never perform examinations without proper PPE
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-5 w-5 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-red-600 dark:text-red-400"
                          >
                            <path d="M18 6 6 18"></path>
                            <path d="m6 6 12 12"></path>
                          </svg>
                        </div>
                        <span>
                          Avoid eating, drinking, or smoking in the examination
                          area
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-5 w-5 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-red-600 dark:text-red-400"
                          >
                            <path d="M18 6 6 18"></path>
                            <path d="m6 6 12 12"></path>
                          </svg>
                        </div>
                        <span>
                          Be cautious with sharp instruments to prevent injuries
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-5 w-5 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-red-600 dark:text-red-400"
                          >
                            <path d="M18 6 6 18"></path>
                            <path d="m6 6 12 12"></path>
                          </svg>
                        </div>
                        <span>
                          Dispose of waste according to local regulations
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="post-mortem" className="space-y-6">
            <Card id="post-mortem-guide">
              <CardContent className="p-6">
                <h2 className="font-heading text-2xl mb-4">
                  Step-by-Step Post-Mortem Examination Guide
                </h2>

                <div className="space-y-8">
                  <div className="relative p-6 border rounded-lg bg-gradient-to-r from-teal-50 to-transparent dark:from-teal-950 dark:to-transparent">
                    <div className="absolute -top-4 left-4 bg-background px-2 py-1 rounded-md border">
                      <span className="text-sm font-medium text-teal-700 dark:text-teal-300">
                        Step 1
                      </span>
                    </div>
                    <h3 className="text-xl font-medium mb-3">
                      External Examination
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <p className="text-muted-foreground">
                          Begin with a thorough external examination before
                          making any incisions.
                        </p>
                        <ul className="space-y-2">
                          <li className="flex items-start gap-2">
                            <div className="h-5 w-5 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center mt-0.5">
                              <span className="text-xs font-medium text-teal-700 dark:text-teal-300">
                                1
                              </span>
                            </div>
                            <span>
                              Record species, breed, age, sex, and identifying
                              features
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="h-5 w-5 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center mt-0.5">
                              <span className="text-xs font-medium text-teal-700 dark:text-teal-300">
                                2
                              </span>
                            </div>
                            <span>
                              Note body condition score (1-5 or 1-9 scale)
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="h-5 w-5 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center mt-0.5">
                              <span className="text-xs font-medium text-teal-700 dark:text-teal-300">
                                3
                              </span>
                            </div>
                            <span>
                              Examine skin, coat, and external orifices
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="h-5 w-5 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center mt-0.5">
                              <span className="text-xs font-medium text-teal-700 dark:text-teal-300">
                                4
                              </span>
                            </div>
                            <span>
                              Document any external abnormalities with
                              photographs
                            </span>
                          </li>
                        </ul>
                      </div>
                      <div className="relative h-[150px] rounded-lg overflow-hidden">
                        <Image
                          src="/placeholder.svg?height=300&width=500"
                          alt="External examination"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="relative p-6 border rounded-lg bg-gradient-to-r from-teal-50 to-transparent dark:from-teal-950 dark:to-transparent">
                    <div className="absolute -top-4 left-4 bg-background px-2 py-1 rounded-md border">
                      <span className="text-sm font-medium text-teal-700 dark:text-teal-300">
                        Step 2
                      </span>
                    </div>
                    <h3 className="text-xl font-medium mb-3">
                      Body Cavity Examination
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <p className="text-muted-foreground">
                          Open the body cavities carefully to examine internal
                          organs in situ.
                        </p>
                        <ul className="space-y-2">
                          <li className="flex items-start gap-2">
                            <div className="h-5 w-5 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center mt-0.5">
                              <span className="text-xs font-medium text-teal-700 dark:text-teal-300">
                                1
                              </span>
                            </div>
                            <span>
                              Make a midline incision from throat to pelvis
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="h-5 w-5 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center mt-0.5">
                              <span className="text-xs font-medium text-teal-700 dark:text-teal-300">
                                2
                              </span>
                            </div>
                            <span>
                              Note position and appearance of organs before
                              removal
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="h-5 w-5 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center mt-0.5">
                              <span className="text-xs font-medium text-teal-700 dark:text-teal-300">
                                3
                              </span>
                            </div>
                            <span>Check for abnormal fluids or adhesions</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="h-5 w-5 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center mt-0.5">
                              <span className="text-xs font-medium text-teal-700 dark:text-teal-300">
                                4
                              </span>
                            </div>
                            <span>
                              Photograph the body cavities before organ removal
                            </span>
                          </li>
                        </ul>
                      </div>
                      <div className="relative h-[150px] rounded-lg overflow-hidden">
                        <Image
                          src="/placeholder.svg?height=300&width=500"
                          alt="Body cavity examination"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="relative p-6 border rounded-lg bg-gradient-to-r from-teal-50 to-transparent dark:from-teal-950 dark:to-transparent">
                    <div className="absolute -top-4 left-4 bg-background px-2 py-1 rounded-md border">
                      <span className="text-sm font-medium text-teal-700 dark:text-teal-300">
                        Step 3
                      </span>
                    </div>
                    <h3 className="text-xl font-medium mb-3">
                      Organ Examination
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <p className="text-muted-foreground">
                          Remove and examine each organ system methodically.
                        </p>
                        <ul className="space-y-2">
                          <li className="flex items-start gap-2">
                            <div className="h-5 w-5 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center mt-0.5">
                              <span className="text-xs font-medium text-teal-700 dark:text-teal-300">
                                1
                              </span>
                            </div>
                            <span>
                              Examine respiratory system (larynx, trachea,
                              lungs)
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="h-5 w-5 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center mt-0.5">
                              <span className="text-xs font-medium text-teal-700 dark:text-teal-300">
                                2
                              </span>
                            </div>
                            <span>
                              Examine cardiovascular system (heart, major
                              vessels)
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="h-5 w-5 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center mt-0.5">
                              <span className="text-xs font-medium text-teal-700 dark:text-teal-300">
                                3
                              </span>
                            </div>
                            <span>
                              Examine digestive system (esophagus to rectum)
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="h-5 w-5 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center mt-0.5">
                              <span className="text-xs font-medium text-teal-700 dark:text-teal-300">
                                4
                              </span>
                            </div>
                            <span>
                              Examine urogenital system (kidneys, bladder,
                              reproductive organs)
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="h-5 w-5 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center mt-0.5">
                              <span className="text-xs font-medium text-teal-700 dark:text-teal-300">
                                5
                              </span>
                            </div>
                            <span>
                              Examine lymphatic system (lymph nodes, spleen)
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="h-5 w-5 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center mt-0.5">
                              <span className="text-xs font-medium text-teal-700 dark:text-teal-300">
                                6
                              </span>
                            </div>
                            <span>
                              Examine nervous system (brain, spinal cord) if
                              indicated
                            </span>
                          </li>
                        </ul>
                      </div>
                      <div className="relative h-[150px] rounded-lg overflow-hidden">
                        <Image
                          src="/placeholder.svg?height=300&width=500"
                          alt="Organ examination"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="relative p-6 border rounded-lg bg-gradient-to-r from-teal-50 to-transparent dark:from-teal-950 dark:to-transparent">
                    <div className="absolute -top-4 left-4 bg-background px-2 py-1 rounded-md border">
                      <span className="text-sm font-medium text-teal-700 dark:text-teal-300">
                        Step 4
                      </span>
                    </div>
                    <h3 className="text-xl font-medium mb-3">Documentation</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <p className="text-muted-foreground">
                          Document all findings thoroughly for accurate
                          diagnosis.
                        </p>
                        <ul className="space-y-2">
                          <li className="flex items-start gap-2">
                            <div className="h-5 w-5 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center mt-0.5">
                              <span className="text-xs font-medium text-teal-700 dark:text-teal-300">
                                1
                              </span>
                            </div>
                            <span>
                              Take clear, well-lit photographs of all
                              abnormalities
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="h-5 w-5 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center mt-0.5">
                              <span className="text-xs font-medium text-teal-700 dark:text-teal-300">
                                2
                              </span>
                            </div>
                            <span>
                              Include a scale reference in photographs
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="h-5 w-5 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center mt-0.5">
                              <span className="text-xs font-medium text-teal-700 dark:text-teal-300">
                                3
                              </span>
                            </div>
                            <span>
                              Record detailed descriptions of all lesions
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="h-5 w-5 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center mt-0.5">
                              <span className="text-xs font-medium text-teal-700 dark:text-teal-300">
                                4
                              </span>
                            </div>
                            <span>
                              Note size, color, texture, and distribution of
                              abnormalities
                            </span>
                          </li>
                        </ul>
                      </div>
                      <div className="relative h-[150px] rounded-lg overflow-hidden">
                        <Image
                          src="/placeholder.svg?height=300&width=500"
                          alt="Documentation of findings"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="text-lg font-medium mb-2">
                      Tips for Quality Photographs
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Do:</h4>
                        <ul className="space-y-1 text-sm">
                          <li className="flex items-center gap-2">
                            <div className="h-5 w-5 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-green-600 dark:text-green-400"
                              >
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                            </div>
                            <span>
                              Use good lighting (natural or bright artificial)
                            </span>
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="h-5 w-5 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-green-600 dark:text-green-400"
                              >
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                            </div>
                            <span>Include a scale marker (ruler or coin)</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="h-5 w-5 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-green-600 dark:text-green-400"
                              >
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                            </div>
                            <span>Take multiple angles of each lesion</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="h-5 w-5 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-green-600 dark:text-green-400"
                              >
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                            </div>
                            <span>
                              Clean the area of excess blood before
                              photographing
                            </span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-2">Don't:</h4>
                        <ul className="space-y-1 text-sm">
                          <li className="flex items-center gap-2">
                            <div className="h-5 w-5 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-red-600 dark:text-red-400"
                              >
                                <path d="M18 6 6 18"></path>
                                <path d="m6 6 12 12"></path>
                              </svg>
                            </div>
                            <span>
                              Use flash directly on wet tissue (causes glare)
                            </span>
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="h-5 w-5 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-red-600 dark:text-red-400"
                              >
                                <path d="M18 6 6 18"></path>
                                <path d="m6 6 12 12"></path>
                              </svg>
                            </div>
                            <span>Take blurry or distant photos</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="h-5 w-5 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-red-600 dark:text-red-400"
                              >
                                <path d="M18 6 6 18"></path>
                                <path d="m6 6 12 12"></path>
                              </svg>
                            </div>
                            <span>Include distracting backgrounds</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="h-5 w-5 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-red-600 dark:text-red-400"
                              >
                                <path d="M18 6 6 18"></path>
                                <path d="m6 6 12 12"></path>
                              </svg>
                            </div>
                            <span>
                              Forget to document normal organs for comparison
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card id="history-taking">
              <CardContent className="p-6">
                <h2 className="font-heading text-2xl mb-4">
                  Taking Relevant History
                </h2>

                <div className="space-y-6">
                  <p className="text-muted-foreground">
                    A comprehensive history is crucial for accurate diagnosis.
                    Collect the following information before or during the
                    post-mortem examination.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-xl font-medium">
                        Essential History Elements
                      </h3>

                      <div className="space-y-4">
                        <div className="p-4 border rounded-lg">
                          <h4 className="font-medium mb-2">
                            Basic Information
                          </h4>
                          <ul className="space-y-1 text-sm">
                            <li className="flex items-center gap-2">
                              <div className="h-5 w-5 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center">
                                <span className="text-xs font-medium text-teal-700 dark:text-teal-300">
                                  •
                                </span>
                              </div>
                              <span>
                                Species, breed, age, sex, and reproductive
                                status
                              </span>
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="h-5 w-5 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center">
                                <span className="text-xs font-medium text-teal-700 dark:text-teal-300">
                                  •
                                </span>
                              </div>
                              <span>
                                Weight and body condition before death
                              </span>
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="h-5 w-5 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center">
                                <span className="text-xs font-medium text-teal-700 dark:text-teal-300">
                                  •
                                </span>
                              </div>
                              <span>Date and time of death</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="h-5 w-5 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center">
                                <span className="text-xs font-medium text-teal-700 dark:text-teal-300">
                                  •
                                </span>
                              </div>
                              <span>
                                Storage conditions of the body after death
                              </span>
                            </li>
                          </ul>
                        </div>

                        <div className="p-4 border rounded-lg">
                          <h4 className="font-medium mb-2">Clinical History</h4>
                          <ul className="space-y-1 text-sm">
                            <li className="flex items-center gap-2">
                              <div className="h-5 w-5 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center">
                                <span className="text-xs font-medium text-teal-700 dark:text-teal-300">
                                  •
                                </span>
                              </div>
                              <span>Duration and progression of illness</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="h-5 w-5 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center">
                                <span className="text-xs font-medium text-teal-700 dark:text-teal-300">
                                  •
                                </span>
                              </div>
                              <span>Clinical signs observed before death</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="h-5 w-5 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center">
                                <span className="text-xs font-medium text-teal-700 dark:text-teal-300">
                                  •
                                </span>
                              </div>
                              <span>Previous diagnoses and treatments</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="h-5 w-5 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center">
                                <span className="text-xs font-medium text-teal-700 dark:text-teal-300">
                                  •
                                </span>
                              </div>
                              <span>
                                Response to any treatments administered
                              </span>
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="h-5 w-5 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center">
                                <span className="text-xs font-medium text-teal-700 dark:text-teal-300">
                                  •
                                </span>
                              </div>
                              <span>Vaccination and deworming history</span>
                            </li>
                          </ul>
                        </div>

                        <div className="p-4 border rounded-lg">
                          <h4 className="font-medium mb-2">
                            Environmental Factors
                          </h4>
                          <ul className="space-y-1 text-sm">
                            <li className="flex items-center gap-2">
                              <div className="h-5 w-5 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center">
                                <span className="text-xs font-medium text-teal-700 dark:text-teal-300">
                                  •
                                </span>
                              </div>
                              <span>
                                Housing conditions and management practices
                              </span>
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="h-5 w-5 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center">
                                <span className="text-xs font-medium text-teal-700 dark:text-teal-300">
                                  •
                                </span>
                              </div>
                              <span>Diet and feeding practices</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="h-5 w-5 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center">
                                <span className="text-xs font-medium text-teal-700 dark:text-teal-300">
                                  •
                                </span>
                              </div>
                              <span>
                                Recent changes in environment or management
                              </span>
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="h-5 w-5 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center">
                                <span className="text-xs font-medium text-teal-700 dark:text-teal-300">
                                  •
                                </span>
                              </div>
                              <span>
                                Exposure to toxins or hazardous materials
                              </span>
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="h-5 w-5 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center">
                                <span className="text-xs font-medium text-teal-700 dark:text-teal-300">
                                  •
                                </span>
                              </div>
                              <span>
                                Contact with other animals (especially sick
                                ones)
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-xl font-medium">
                        History Taking Best Practices
                      </h3>

                      <div className="p-4 border rounded-lg bg-muted">
                        <h4 className="font-medium mb-3">
                          Tips for Effective History Collection
                        </h4>
                        <ul className="space-y-3">
                          <li className="flex items-start gap-3">
                            <div className="h-6 w-6 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center mt-0.5">
                              <span className="text-sm font-medium text-teal-700 dark:text-teal-300">
                                1
                              </span>
                            </div>
                            <div>
                              <p className="font-medium">
                                Use a Standardized Form
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Create or use a standardized history form to
                                ensure all relevant information is collected
                                consistently.
                              </p>
                            </div>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="h-6 w-6 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center mt-0.5">
                              <span className="text-sm font-medium text-teal-700 dark:text-teal-300">
                                2
                              </span>
                            </div>
                            <div>
                              <p className="font-medium">
                                Ask Open-Ended Questions
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Begin with open-ended questions to allow owners
                                to describe observations in their own words.
                              </p>
                            </div>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="h-6 w-6 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center mt-0.5">
                              <span className="text-sm font-medium text-teal-700 dark:text-teal-300">
                                3
                              </span>
                            </div>
                            <div>
                              <p className="font-medium">
                                Follow Up with Specific Questions
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Use targeted questions to clarify and expand on
                                the information provided.
                              </p>
                            </div>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="h-6 w-6 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center mt-0.5">
                              <span className="text-sm font-medium text-teal-700 dark:text-teal-300">
                                4
                              </span>
                            </div>
                            <div>
                              <p className="font-medium">
                                Document Chronologically
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Record the timeline of events leading up to
                                death to identify disease progression.
                              </p>
                            </div>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="h-6 w-6 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center mt-0.5">
                              <span className="text-sm font-medium text-teal-700 dark:text-teal-300">
                                5
                              </span>
                            </div>
                            <div>
                              <p className="font-medium">
                                Collect Herd/Flock Information
                              </p>
                              <p className="text-sm text-muted-foreground">
                                For farm animals, gather information about the
                                entire group, not just the individual.
                              </p>
                            </div>
                          </li>
                        </ul>
                      </div>

                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-3">
                          Sample Questions by System
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <p className="font-medium text-sm">
                              Respiratory System
                            </p>
                            <ul className="text-sm ml-5 list-disc space-y-1 mt-1">
                              <li>
                                Was there coughing, nasal discharge, or
                                difficulty breathing?
                              </li>
                              <li>
                                What was the character and color of any
                                discharge?
                              </li>
                              <li>
                                Did breathing patterns change before death?
                              </li>
                            </ul>
                          </div>
                          <div>
                            <p className="font-medium text-sm">
                              Digestive System
                            </p>
                            <ul className="text-sm ml-5 list-disc space-y-1 mt-1">
                              <li>
                                Were there changes in appetite, water
                                consumption, or weight?
                              </li>
                              <li>
                                Was there vomiting, diarrhea, or constipation?
                              </li>
                              <li>
                                What was the appearance of feces (color,
                                consistency, presence of blood)?
                              </li>
                            </ul>
                          </div>
                          <div>
                            <p className="font-medium text-sm">
                              Neurological System
                            </p>
                            <ul className="text-sm ml-5 list-disc space-y-1 mt-1">
                              <li>
                                Were there changes in behavior, coordination, or
                                consciousness?
                              </li>
                              <li>
                                Any seizures, tremors, or paralysis observed?
                              </li>
                              <li>
                                Did the animal show signs of pain or discomfort?
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-teal-50 dark:bg-teal-950/50 p-4 rounded-lg border border-teal-200 dark:border-teal-900">
                    <h3 className="text-lg font-medium text-teal-800 dark:text-teal-300 mb-2">
                      History Taking Template
                    </h3>
                    <p className="text-sm text-teal-700 dark:text-teal-400 mb-3">
                      Use this downloadable template to ensure you collect all
                      relevant history information.
                    </p>
                    <Button className="bg-teal-600 hover:bg-teal-700 text-white">
                      Download History Template
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="platform" className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="font-heading text-2xl mb-4">
                  Using the Vetable Platform
                </h2>

                <div className="space-y-6">
                  <p className="text-muted-foreground">
                    After completing the post-mortem examination and collecting
                    relevant history, follow these steps to use the Vetable
                    platform for diagnosis.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 border rounded-lg bg-gradient-to-b from-background to-muted/50">
                      <div className="h-12 w-12 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center mb-4">
                        <span className="font-heading text-xl text-teal-700 dark:text-teal-300">
                          1
                        </span>
                      </div>
                      <h3 className="text-lg font-medium mb-2">
                        Upload Images
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Select and upload clear, high-quality images of the
                        lesions and abnormalities found during the post-mortem
                        examination.
                      </p>
                      <ul className="text-sm space-y-2">
                        <li className="flex items-start gap-2">
                          <div className="h-5 w-5 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center mt-0.5">
                            <span className="text-xs font-medium text-teal-700 dark:text-teal-300">
                              •
                            </span>
                          </div>
                          <span>Include images of all abnormal findings</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="h-5 w-5 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center mt-0.5">
                            <span className="text-xs font-medium text-teal-700 dark:text-teal-300">
                              •
                            </span>
                          </div>
                          <span>
                            Add images of normal tissues for comparison
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="h-5 w-5 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center mt-0.5">
                            <span className="text-xs font-medium text-teal-700 dark:text-teal-300">
                              •
                            </span>
                          </div>
                          <span>Ensure proper lighting and focus</span>
                        </li>
                      </ul>
                    </div>

                    <div className="p-6 border rounded-lg bg-gradient-to-b from-background to-muted/50">
                      <div className="h-12 w-12 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center mb-4">
                        <span className="font-heading text-xl text-teal-700 dark:text-teal-300">
                          2
                        </span>
                      </div>
                      <h3 className="text-lg font-medium mb-2">
                        Enter History Data
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Input the comprehensive history information collected
                        from the animal owner or caretaker.
                      </p>
                      <ul className="text-sm space-y-2">
                        <li className="flex items-start gap-2">
                          <div className="h-5 w-5 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center mt-0.5">
                            <span className="text-xs font-medium text-teal-700 dark:text-teal-300">
                              •
                            </span>
                          </div>
                          <span>Complete all required fields in the form</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="h-5 w-5 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center mt-0.5">
                            <span className="text-xs font-medium text-teal-700 dark:text-teal-300">
                              •
                            </span>
                          </div>
                          <span>Be specific and detailed in descriptions</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="h-5 w-5 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center mt-0.5">
                            <span className="text-xs font-medium text-teal-700 dark:text-teal-300">
                              •
                            </span>
                          </div>
                          <span>Include timeline of clinical signs</span>
                        </li>
                      </ul>
                    </div>

                    <div className="p-6 border rounded-lg bg-gradient-to-b from-background to-muted/50">
                      <div className="h-12 w-12 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center mb-4">
                        <span className="font-heading text-xl text-teal-700 dark:text-teal-300">
                          3
                        </span>
                      </div>
                      <h3 className="text-lg font-medium mb-2">
                        Review Results
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Analyze the AI-generated diagnosis and supporting
                        information provided by the Vetable platform.
                      </p>
                      <ul className="text-sm space-y-2">
                        <li className="flex items-start gap-2">
                          <div className="h-5 w-5 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center mt-0.5">
                            <span className="text-xs font-medium text-teal-700 dark:text-teal-300">
                              •
                            </span>
                          </div>
                          <span>Examine the tentative diagnosis</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="h-5 w-5 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center mt-0.5">
                            <span className="text-xs font-medium text-teal-700 dark:text-teal-300">
                              •
                            </span>
                          </div>
                          <span>
                            Review identified lesions and their significance
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="h-5 w-5 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center mt-0.5">
                            <span className="text-xs font-medium text-teal-700 dark:text-teal-300">
                              •
                            </span>
                          </div>
                          <span>Consider differential diagnoses provided</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="space-y-4">
                      <h3 className="text-xl font-medium">
                        Interpreting Results
                      </h3>
                      <p className="text-muted-foreground">
                        The Vetable platform provides a tentative diagnosis
                        based on the images and history provided. Remember these
                        key points when interpreting results:
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-3">
                          <div className="h-6 w-6 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center mt-0.5">
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
                              className="text-amber-600 dark:text-amber-400"
                            >
                              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                              <line x1="12" y1="9" x2="12" y2="13"></line>
                              <line x1="12" y1="17" x2="12.01" y2="17"></line>
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium">
                              AI Diagnoses are Tentative
                            </p>
                            <p className="text-sm text-muted-foreground">
                              All diagnoses should be considered tentative and
                              may require confirmation through additional
                              testing or specialist consultation.
                            </p>
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="h-6 w-6 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center mt-0.5">
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
                              className="text-amber-600 dark:text-amber-400"
                            >
                              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                              <line x1="12" y1="9" x2="12" y2="13"></line>
                              <line x1="12" y1="17" x2="12.01" y2="17"></line>
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium">
                              Quality Affects Accuracy
                            </p>
                            <p className="text-sm text-muted-foreground">
                              The quality of images and completeness of history
                              directly impact the accuracy of the diagnosis.
                            </p>
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="h-6 w-6 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center mt-0.5">
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
                              className="text-amber-600 dark:text-amber-400"
                            >
                              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                              <line x1="12" y1="9" x2="12" y2="13"></line>
                              <line x1="12" y1="17" x2="12.01" y2="17"></line>
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium">
                              Consider All Differentials
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Review all differential diagnoses provided, not
                              just the primary diagnosis, especially in complex
                              cases.
                            </p>
                          </div>
                        </li>
                      </ul>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-xl font-medium">Next Steps</h3>
                      <p className="text-muted-foreground">
                        After receiving the diagnosis, consider these follow-up
                        actions:
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-3">
                          <div className="h-6 w-6 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center mt-0.5">
                            <span className="text-sm font-medium text-teal-700 dark:text-teal-300">
                              1
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">
                              Consult with a Specialist
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Use the "Contact Specialist" feature to share the
                              diagnosis with a veterinary specialist for
                              confirmation or additional insights.
                            </p>
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="h-6 w-6 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center mt-0.5">
                            <span className="text-sm font-medium text-teal-700 dark:text-teal-300">
                              2
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">Laboratory Testing</p>
                            <p className="text-sm text-muted-foreground">
                              Consider submitting samples for histopathology,
                              microbiology, or other laboratory tests to confirm
                              the diagnosis.
                            </p>
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="h-6 w-6 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center mt-0.5">
                            <span className="text-sm font-medium text-teal-700 dark:text-teal-300">
                              3
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">
                              Implement Preventive Measures
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Based on the diagnosis, implement appropriate
                              preventive measures to protect other animals in
                              the herd or facility.
                            </p>
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="h-6 w-6 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center mt-0.5">
                            <span className="text-sm font-medium text-teal-700 dark:text-teal-300">
                              4
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">
                              Report Notifiable Diseases
                            </p>
                            <p className="text-sm text-muted-foreground">
                              If the diagnosis indicates a reportable or
                              notifiable disease, contact the appropriate
                              regulatory authorities.
                            </p>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-muted p-6 rounded-lg">
                    <h3 className="text-xl font-medium mb-4">Video Tutorial</h3>
                    <div className="aspect-video bg-black/10 dark:bg-white/5 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-muted-foreground mb-3">
                          Watch our comprehensive tutorial on using the Vetable
                          platform
                        </p>
                        <Button className="gap-2">
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
                          >
                            <polygon points="5 3 19 12 5 21 5 3"></polygon>
                          </svg>
                          Watch Tutorial
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
