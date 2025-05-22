"use client";

import { useState } from "react";
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

const tabs = [
  {
    id: "overview",
    label: "Overview",
    content: {
      title: "API Overview",
      description: "Understanding the Vetable API structure",
      body: (
        <>
          <p className="mb-4">
            The Vetable API is organized around REST principles. It uses
            standard HTTP response codes, authentication, and verbs.
          </p>
          <h3 className="text-lg font-medium mb-2">Base URL</h3>
          <p className="mb-4">All API requests should be made to:</p>
          <div className="bg-muted p-4 rounded-md mb-4 font-mono text-sm">
            https://api.vetable.com/v1
          </div>
          <h3 className="text-lg font-medium mb-2">Response Format</h3>
          <p className="mb-4">All responses are returned in JSON format.</p>
        </>
      ),
    },
  },
  {
    id: "authentication",
    label: "Authentication",
    content: {
      title: "Authentication",
      description: "Securing your API requests",
      body: (
        <>
          <p className="mb-4">
            The Vetable API uses API keys for authentication. Your API key
            carries many privileges, so be sure to keep it secure.
          </p>
          <h3 className="text-lg font-medium mb-2">API Keys</h3>
          <p className="mb-4">
            Include your API key in all requests as a bearer token in the
            Authorization header:
          </p>
          <CodeBlock
            language="bash"
            code={`curl -X GET "https://api.vetable.com/v1/diagnoses" \\
  -H "Authorization: Bearer YOUR_API_KEY"`}
          />
        </>
      ),
    },
  },
  {
    id: "diagnoses",
    label: "Diagnoses",
    content: {
      title: "Diagnoses API",
      description: "Endpoints for veterinary diagnoses",
      body: (
        <>
          <h3 className="text-lg font-medium mb-2">Create a Diagnosis</h3>
          <p className="mb-4">Submit animal symptoms for diagnosis:</p>
          <CodeBlock
            language="bash"
            code={`curl -X POST "https://api.vetable.com/v1/diagnoses" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "animalType": "dog",
    "symptoms": ["lethargy", "loss of appetite", "vomiting"],
    "age": 5,
    "weight": 15,
    "additionalNotes": "Symptoms started 2 days ago"
  }'`}
          />
          <h3 className="text-lg font-medium mt-6 mb-2">List Diagnoses</h3>
          <p className="mb-4">Retrieve a list of diagnoses:</p>
          <CodeBlock
            language="bash"
            code={`curl -X GET "https://api.vetable.com/v1/diagnoses" \\
  -H "Authorization: Bearer YOUR_API_KEY"`}
          />
        </>
      ),
    },
  },
  {
    id: "animals",
    label: "Animals",
    content: {
      title: "Animals API",
      description: "Endpoints for managing animal records",
      body: (
        <>
          <h3 className="text-lg font-medium mb-2">Create an Animal</h3>
          <p className="mb-4">Add a new animal to your records:</p>
          <CodeBlock
            language="bash"
            code={`curl -X POST "https://api.vetable.com/v1/animals" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Max",
    "type": "dog",
    "breed": "Golden Retriever",
    "age": 5,
    "weight": 30,
    "owner": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "555-123-4567"
    }
  }'`}
          />
          <h3 className="text-lg font-medium mt-6 mb-2">List Animals</h3>
          <p className="mb-4">Retrieve a list of animals:</p>
          <CodeBlock
            language="bash"
            code={`curl -X GET "https://api.vetable.com/v1/animals" \\
  -H "Authorization: Bearer YOUR_API_KEY"`}
          />
        </>
      ),
    },
  },
  {
    id: "errors",
    label: "Errors",
    content: {
      title: "Error Handling",
      description: "Understanding API error responses",
      body: (
        <>
          <p className="mb-4">
            The Vetable API uses conventional HTTP response codes to indicate
            the success or failure of an API request.
          </p>
          <h3 className="text-lg font-medium mb-2">HTTP Status Codes</h3>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>
              <span className="font-medium">200 - OK</span>: The request was
              successful.
            </li>
            <li>
              <span className="font-medium">201 - Created</span>: The resource
              was successfully created.
            </li>
            <li>
              <span className="font-medium">400 - Bad Request</span>: The
              request was invalid or cannot be served.
            </li>
            <li>
              <span className="font-medium">401 - Unauthorized</span>:
              Authentication failed or user doesn't have permissions.
            </li>
            <li>
              <span className="font-medium">404 - Not Found</span>: The
              requested resource doesn't exist.
            </li>
            <li>
              <span className="font-medium">429 - Too Many Requests</span>: Rate
              limit exceeded.
            </li>
            <li>
              <span className="font-medium">500 - Internal Server Error</span>:
              Something went wrong on our end.
            </li>
          </ul>
          <h3 className="text-lg font-medium mb-2">Error Response Format</h3>
          <p className="mb-4">
            All error responses include a JSON object with an error message:
          </p>
          <CodeBlock
            language="json"
            code={`{
  "error": {
    "code": "invalid_request",
    "message": "The request was invalid. Please check your parameters.",
    "details": {
      "field": "symptoms",
      "issue": "This field is required"
    }
  }
}`}
          />
        </>
      ),
    },
  },
];

export default function DocumentationContent() {
  const [activeTab, setActiveTab] = useState("overview");

  const currentTabIndex = tabs.findIndex((tab) => tab.id === activeTab);
  const hasPrevious = currentTabIndex > 0;
  const hasNext = currentTabIndex < tabs.length - 1;

  const handlePrevious = () => {
    if (hasPrevious) {
      setActiveTab(tabs[currentTabIndex - 1].id);
    }
  };

  const handleNext = () => {
    if (hasNext) {
      setActiveTab(tabs[currentTabIndex + 1].id);
    }
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <div className="flex justify-between items-center mb-4">
        <TabsList>
          {tabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevious}
            disabled={!hasPrevious}
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={!hasNext}
          >
            Next <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>

      {tabs.map((tab) => (
        <TabsContent key={tab.id} value={tab.id}>
          <Card>
            <CardHeader>
              <CardTitle>{tab.content.title}</CardTitle>
              <CardDescription>{tab.content.description}</CardDescription>
            </CardHeader>
            <CardContent>{tab.content.body}</CardContent>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  );
}
