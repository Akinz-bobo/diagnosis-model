import type { Metadata } from "next";
import DocumentationContent from "@/components/documentation/documentation-content";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "API Documentation | Vetable",
  description: "Comprehensive documentation for the Vetable API",
};

export default function DocumentationPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-teal-600 mb-2">
          API Documentation
        </h1>
        <p className="text-muted-foreground">
          Comprehensive documentation for integrating with the Vetable API
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>
            Learn how to authenticate and make your first API request
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            The Vetable API provides programmatic access to our veterinary
            diagnosis system. To get started, you'll need an API key.
          </p>
          <h3 className="text-lg font-medium mb-2">Authentication</h3>
          <p className="mb-4">
            All API requests require authentication using an API key. Include
            your API key in the request header:
          </p>
          <div className="bg-muted p-4 rounded-md mb-4 font-mono text-sm">
            Authorization: Bearer YOUR_API_KEY
          </div>
          <p>
            <a href="/signup" className="text-teal-600 hover:underline">
              Sign up
            </a>{" "}
            for an account to request an API key.
          </p>
        </CardContent>
      </Card>

      <DocumentationContent />
    </div>
  );
}
