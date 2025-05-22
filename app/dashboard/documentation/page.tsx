"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CodeBlock } from "@/components/dashboard/documentation/code-block";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function DocumentationPage() {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "authentication", label: "Authentication" },
    { id: "api-keys", label: "API Keys" },
    { id: "diagnosis", label: "Diagnosis API" },
    { id: "webhooks", label: "Webhooks" },
  ];

  const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);

  const navigateTab = (direction: "next" | "previous") => {
    if (direction === "next" && currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1].id);
    } else if (direction === "previous" && currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1].id);
    }
  };

  return (
    <DashboardShell>
      <DashboardHeader
        heading="API Documentation"
        text="Learn how to integrate with the eVet API."
        breadcrumb={[
          { title: "Dashboard", href: "/dashboard" },
          { title: "Documentation", href: "/dashboard/documentation" },
        ]}
      />

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <TabsList>
            {tabs.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateTab("previous")}
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateTab("next")}
              disabled={currentIndex === tabs.length - 1}
            >
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>eVet API Overview</CardTitle>
              <CardDescription>
                Introduction to the eVet API and its capabilities.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                The eVet API provides programmatic access to eVet's poultry
                disease diagnosis capabilities. With this API, you can integrate
                AI-powered disease detection directly into your veterinary
                management systems, mobile apps, or other software solutions.
              </p>
              <h3 className="text-lg font-medium mt-4">Key Features</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Disease diagnosis from image uploads</li>
                <li>Detailed analysis with confidence scores</li>
                <li>Historical diagnosis data access</li>
                <li>Webhook notifications for diagnosis results</li>
                <li>User and organization management</li>
              </ul>
              <h3 className="text-lg font-medium mt-4">Base URL</h3>
              <CodeBlock
                language="bash"
                code="https://api.evet-diagnosis.com/v1"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="authentication" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Authentication</CardTitle>
              <CardDescription>
                Learn how to authenticate with the eVet API.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                The eVet API uses API keys to authenticate requests. You can
                view and manage your API keys in the API Keys section of the
                dashboard.
              </p>
              <h3 className="text-lg font-medium mt-4">
                Authentication Header
              </h3>
              <p>
                All API requests must include your API key in the{" "}
                <code>X-API-Key</code> header:
              </p>
              <CodeBlock
                language="bash"
                code={`curl -X GET "https://api.evet-diagnosis.com/v1/diagnoses" \\
  -H "X-API-Key: your_api_key_here"`}
              />
              <h3 className="text-lg font-medium mt-4">Error Responses</h3>
              <p>
                If you provide an invalid API key, you will receive a 401
                Unauthorized response:
              </p>
              <CodeBlock
                language="json"
                code={`{
  "error": "unauthorized",
  "message": "Invalid API key provided."
}`}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api-keys" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Managing API Keys</CardTitle>
              <CardDescription>
                Learn how to create and manage your API keys.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                API keys are used to authenticate your requests to the eVet API.
                Each key has specific permissions and can be restricted to
                certain operations.
              </p>
              <h3 className="text-lg font-medium mt-4">Creating API Keys</h3>
              <p>
                You can create new API keys from the API Keys section of your
                dashboard. When creating a key, you'll need to specify:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>A name for the key (e.g., "Production API Key")</li>
                <li>The environment (production, development, testing)</li>
                <li>The purpose of the key</li>
              </ul>
              <h3 className="text-lg font-medium mt-4">API Key Security</h3>
              <p>
                Treat your API keys like passwords. Do not share them in
                publicly accessible areas such as GitHub, client-side code, or
                blog posts. If a key is compromised, you should revoke it
                immediately and create a new one.
              </p>
              <h3 className="text-lg font-medium mt-4">Revoking API Keys</h3>
              <p>
                If you believe an API key has been compromised, you should
                revoke it immediately. Revoked keys cannot be restored, so
                you'll need to create a new key.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="diagnosis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Diagnosis API</CardTitle>
              <CardDescription>
                Learn how to use the Diagnosis API to detect poultry diseases.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="text-lg font-medium">Creating a Diagnosis</h3>
              <p>
                To create a new diagnosis, you'll need to send a POST request to
                the <code>/diagnoses</code> endpoint with an image file:
              </p>
              <CodeBlock
                language="bash"
                code={`curl -X POST "https://api.evet-diagnosis.com/v1/diagnoses" \\
  -H "X-API-Key: your_api_key_here" \\
  -F "image=@/path/to/image.jpg" \\
  -F "species=chicken"`}
              />
              <h3 className="text-lg font-medium mt-4">Diagnosis Response</h3>
              <p>
                A successful diagnosis request will return a response like this:
              </p>
              <CodeBlock
                language="json"
                code={`{
  "id": "diag_1a2b3c4d5e6f",
  "status": "completed",
  "created_at": "2023-12-01T12:34:56Z",
  "results": [
    {
      "disease": "Avian Influenza",
      "confidence": 0.92,
      "symptoms": ["respiratory distress", "decreased egg production"]
    },
    {
      "disease": "Newcastle Disease",
      "confidence": 0.07,
      "symptoms": ["respiratory distress"]
    }
  ],
  "species": "chicken",
  "image_url": "https://api.evet-diagnosis.com/v1/images/img_1a2b3c4d5e6f"
}`}
              />
              <h3 className="text-lg font-medium mt-4">Retrieving Diagnoses</h3>
              <p>
                You can retrieve a list of your previous diagnoses by sending a
                GET request to the <code>/diagnoses</code> endpoint:
              </p>
              <CodeBlock
                language="bash"
                code={`curl -X GET "https://api.evet-diagnosis.com/v1/diagnoses" \\
  -H "X-API-Key: your_api_key_here"`}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Webhooks</CardTitle>
              <CardDescription>
                Learn how to use webhooks to receive real-time updates.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Webhooks allow you to receive real-time notifications when
                certain events occur in your eVet account. Instead of polling
                the API for changes, webhooks push data to your specified
                endpoint as events happen.
              </p>
              <h3 className="text-lg font-medium mt-4">Setting Up Webhooks</h3>
              <p>
                To set up a webhook, you'll need to provide a URL where eVet can
                send HTTP POST requests. You can configure webhooks in the API
                settings section of your dashboard.
              </p>
              <h3 className="text-lg font-medium mt-4">Webhook Events</h3>
              <p>eVet can send webhooks for the following events:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <code>diagnosis.created</code> - When a new diagnosis is
                  created
                </li>
                <li>
                  <code>diagnosis.completed</code> - When a diagnosis is
                  completed
                </li>
                <li>
                  <code>api_key.created</code> - When a new API key is created
                </li>
                <li>
                  <code>api_key.revoked</code> - When an API key is revoked
                </li>
              </ul>
              <h3 className="text-lg font-medium mt-4">Webhook Payload</h3>
              <p>
                Here's an example of a webhook payload for a completed
                diagnosis:
              </p>
              <CodeBlock
                language="json"
                code={`{
  "event": "diagnosis.completed",
  "created_at": "2023-12-01T12:34:56Z",
  "data": {
    "id": "diag_1a2b3c4d5e6f",
    "status": "completed",
    "created_at": "2023-12-01T12:30:00Z",
    "results": [
      {
        "disease": "Avian Influenza",
        "confidence": 0.92,
        "symptoms": ["respiratory distress", "decreased egg production"]
      }
    ],
    "species": "chicken"
  }
}`}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  );
}
