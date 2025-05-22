import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Microscope,
  Shield,
  ImageIcon,
  FileText,
  ArrowRight,
} from "lucide-react";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-28 bg-gradient-to-b from-teal-50 to-white dark:from-slate-950 dark:to-slate-900">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold tracking-tighter">
                  Advanced Veterinary Diagnosis with AI
                </h1>
                <p className="text-lg text-muted-foreground md:text-xl max-w-[600px]">
                  Combine pathology images and clinical history for accurate
                  disease diagnosis with medical reports.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button
                    asChild
                    size="lg"
                    className="bg-teal-600 hover:bg-teal-700"
                  >
                    <Link href="/signup">Get Started</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/signin">Sign In</Link>
                  </Button>
                </div>
              </div>
              <div className="relative lg:ml-auto">
                <div className="relative h-[350px] w-full overflow-hidden rounded-lg bg-muted">
                  <img
                    src="/heroimg.jpg"
                    alt="Veterinary Diagnosis"
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-heading font-bold tracking-tighter md:text-4xl">
                How Vetable AI Helps You
              </h2>
              <p className="mt-4 text-muted-foreground md:text-lg">
                Our AI-powered platform provides accurate diagnosis to help you
                make informed decisions.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col items-center text-center p-6 bg-background rounded-lg shadow-sm border">
                <div className="p-3 rounded-full bg-teal-100 dark:bg-teal-900 mb-4">
                  <Microscope className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Accurate Diagnosis</h3>
                <p className="text-muted-foreground">
                  Our AI model combines image analysis and clinical history for
                  precise results.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-background rounded-lg shadow-sm border">
                <div className="p-3 rounded-full bg-teal-100 dark:bg-teal-900 mb-4">
                  <Shield className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Secure Storage</h3>
                <p className="text-muted-foreground">
                  All images and data are securely stored for future reference.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-background rounded-lg shadow-sm border">
                <div className="p-3 rounded-full bg-teal-100 dark:bg-teal-900 mb-4">
                  <ImageIcon className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Image Analysis</h3>
                <p className="text-muted-foreground">
                  Upload and analyze pathology images to identify disease
                  patterns.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-background rounded-lg shadow-sm border">
                <div className="p-3 rounded-full bg-teal-100 dark:bg-teal-900 mb-4">
                  <FileText className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Detailed Reports</h3>
                <p className="text-muted-foreground">
                  Get comprehensive medical reports with accurate diagnosis and
                  recommendation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 md:py-24 bg-slate-50 dark:bg-slate-900">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-heading font-bold tracking-tighter md:text-4xl">
                How It Works
              </h2>
              <p className="mt-4 text-muted-foreground md:text-lg">
                Simple steps to get an accurate diagnosis for your veterinary
                cases.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="relative flex flex-col items-center text-center p-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-teal-600 text-white font-bold text-xl mb-4">
                  1
                </div>
                <h3 className="text-xl font-bold mb-2">Upload Images</h3>
                <p className="text-muted-foreground">
                  Upload one or more pathology images for analysis by our AI
                  system.
                </p>
              </div>
              <div className="relative flex flex-col items-center text-center p-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-teal-600 text-white font-bold text-xl mb-4">
                  2
                </div>
                <h3 className="text-xl font-bold mb-2">
                  Enter Clinical History
                </h3>
                <p className="text-muted-foreground">
                  Provide detailed clinical history including species, age, and
                  symptoms.
                </p>
              </div>
              <div className="relative flex flex-col items-center text-center p-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-teal-600 text-white font-bold text-xl mb-4">
                  3
                </div>
                <h3 className="text-xl font-bold mb-2">Get Diagnosis</h3>
                <p className="text-muted-foreground">
                  Receive an accurate diagnosis with clinical reports and
                  recommendation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto space-y-4">
              <h2 className="text-3xl font-heading font-bold tracking-tighter md:text-4xl">
                Ready to Transform Your Veterinary Diagnosis?
              </h2>
              <p className="text-muted-foreground md:text-lg">
                Join Vetable AI today and leverage the power of AI for accurate
                disease diagnosis.
              </p>
              <Button
                asChild
                size="lg"
                className="mt-4 bg-teal-600 hover:bg-teal-700"
              >
                <Link href="/signup" className="flex items-center gap-2">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
