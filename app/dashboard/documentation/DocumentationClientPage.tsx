"use client";

import { CodeBlock } from "@/components/dashboard/documentation/code-block";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

function DocumentationTabs() {
  const tabs = [
    "introduction",
    "authentication",
    "endpoints",
    "requests",
    "responses",
    "errors",
    "rate-limits",
    "sdks",
    "examples",
  ];

  const [activeTab, setActiveTab] = useState("introduction");

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const currentIndex = tabs.indexOf(activeTab);
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < tabs.length - 1;

  const handlePrevious = () => {
    if (hasPrevious) {
      setActiveTab(tabs[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (hasNext) {
      setActiveTab(tabs[currentIndex + 1]);
    }
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <div className="flex items-center justify-between">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-9">
          <TabsTrigger value="introduction">Introduction</TabsTrigger>
          <TabsTrigger value="authentication">Authentication</TabsTrigger>
          <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
          <TabsTrigger value="requests">Requests</TabsTrigger>
          <TabsTrigger value="responses">Responses</TabsTrigger>
          <TabsTrigger value="errors">Errors</TabsTrigger>
          <TabsTrigger value="rate-limits">Rate Limits</TabsTrigger>
          <TabsTrigger value="sdks">SDKs</TabsTrigger>
          <TabsTrigger value="examples">Examples</TabsTrigger>
        </TabsList>
      </div>

      <div className="mt-6 space-y-6">
        <TabsContent value="introduction" className="space-y-4">
          <h2 className="text-2xl font-bold">Introduction to eVet API</h2>
          <p>
            The eVet API provides programmatic access to our veterinary
            diagnosis system. With this API, you can integrate our AI-powered
            diagnosis capabilities into your own applications, allowing you to
            analyze animal symptoms and receive potential diagnoses.
          </p>
          <h3 className="text-xl font-semibold mt-4">Key Features</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>AI-powered veterinary diagnosis</li>
            <li>Support for multiple animal species</li>
            <li>Image analysis for visual symptoms</li>
            <li>Detailed diagnosis reports</li>
            <li>Treatment recommendations</li>
          </ul>
        </TabsContent>

        <TabsContent value="authentication" className="space-y-4">
          <h2 className="text-2xl font-bold">Authentication</h2>
          <p>
            All API requests require authentication using an API key. You can
            obtain an API key from your dashboard under the API Keys section.
          </p>
          <h3 className="text-xl font-semibold mt-4">Using Your API Key</h3>
          <p>Include your API key in the request headers:</p>
          <CodeBlock
            code={`
// Example API request with authentication
fetch('https://api.evet.com/v1/diagnose', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    // request data
  })
})
            `}
            language="javascript"
          />
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-md mt-4">
            <h4 className="font-medium text-yellow-800 dark:text-yellow-200">
              Security Notice
            </h4>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              Keep your API key secure and never expose it in client-side code.
              Always make API calls from your server.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="endpoints" className="space-y-4">
          <h2 className="text-2xl font-bold">API Endpoints</h2>
          <p>The eVet API provides the following endpoints:</p>

          <div className="space-y-6 mt-4">
            <div className="rounded-md border p-4">
              <h3 className="text-lg font-semibold">POST /v1/diagnose</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Submit symptoms for diagnosis
              </p>
              <div className="mt-2">
                <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                  POST
                </span>
                <span className="ml-2 text-sm font-mono">
                  https://api.evet.com/v1/diagnose
                </span>
              </div>
            </div>

            <div className="rounded-md border p-4">
              <h3 className="text-lg font-semibold">
                GET /v1/diagnoses/{"{id}"}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Retrieve a specific diagnosis by ID
              </p>
              <div className="mt-2">
                <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
                  GET
                </span>
                <span className="ml-2 text-sm font-mono">
                  https://api.evet.com/v1/diagnoses/{"{id}"}
                </span>
              </div>
            </div>

            <div className="rounded-md border p-4">
              <h3 className="text-lg font-semibold">GET /v1/diagnoses</h3>
              <p className="text-sm text-muted-foreground mt-1">
                List all diagnoses for your account
              </p>
              <div className="mt-2">
                <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
                  GET
                </span>
                <span className="ml-2 text-sm font-mono">
                  https://api.evet.com/v1/diagnoses
                </span>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          <h2 className="text-2xl font-bold">API Requests</h2>
          <p>
            Learn how to structure your API requests for different endpoints.
          </p>

          <h3 className="text-xl font-semibold mt-6">Diagnosis Request</h3>
          <p className="mb-2">
            To request a diagnosis, send a POST request to the /v1/diagnose
            endpoint with the following JSON structure:
          </p>
          <CodeBlock
            code={`
// POST /v1/diagnose
{
  "species": "dog",
  "breed": "labrador",
  "age": 5,
  "weight": 30,
  "symptoms": [
    "lethargy",
    "loss of appetite",
    "vomiting"
  ],
  "symptomDetails": "Started showing symptoms 2 days ago, getting worse",
  "images": [
    {
      "url": "https://example.com/image1.jpg",
      "type": "affected_area"
    }
  ]
}
            `}
            language="json"
          />

          <h3 className="text-xl font-semibold mt-6">Request Parameters</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Parameter
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Required
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="px-4 py-3 text-sm font-mono">species</td>
                  <td className="px-4 py-3 text-sm">string</td>
                  <td className="px-4 py-3 text-sm">Yes</td>
                  <td className="px-4 py-3 text-sm">
                    Animal species (dog, cat, horse, etc.)
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm font-mono">breed</td>
                  <td className="px-4 py-3 text-sm">string</td>
                  <td className="px-4 py-3 text-sm">No</td>
                  <td className="px-4 py-3 text-sm">Breed of the animal</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm font-mono">age</td>
                  <td className="px-4 py-3 text-sm">number</td>
                  <td className="px-4 py-3 text-sm">Yes</td>
                  <td className="px-4 py-3 text-sm">Age in years</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm font-mono">weight</td>
                  <td className="px-4 py-3 text-sm">number</td>
                  <td className="px-4 py-3 text-sm">No</td>
                  <td className="px-4 py-3 text-sm">Weight in kg</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm font-mono">symptoms</td>
                  <td className="px-4 py-3 text-sm">array</td>
                  <td className="px-4 py-3 text-sm">Yes</td>
                  <td className="px-4 py-3 text-sm">
                    Array of symptom keywords
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm font-mono">
                    symptomDetails
                  </td>
                  <td className="px-4 py-3 text-sm">string</td>
                  <td className="px-4 py-3 text-sm">No</td>
                  <td className="px-4 py-3 text-sm">
                    Detailed description of symptoms
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm font-mono">images</td>
                  <td className="px-4 py-3 text-sm">array</td>
                  <td className="px-4 py-3 text-sm">No</td>
                  <td className="px-4 py-3 text-sm">
                    Array of image objects with url and type
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="responses" className="space-y-4">
          <h2 className="text-2xl font-bold">API Responses</h2>
          <p>Learn about the structure of API responses.</p>

          <h3 className="text-xl font-semibold mt-6">Diagnosis Response</h3>
          <p className="mb-2">
            A successful diagnosis request returns the following JSON structure:
          </p>
          <CodeBlock
            code={`
// Response from POST /v1/diagnose
{
  "id": "diag_12345abcde",
  "status": "completed",
  "createdAt": "2023-05-15T14:32:10Z",
  "results": {
    "possibleConditions": [
      {
        "name": "Gastroenteritis",
        "probability": 0.85,
        "description": "Inflammation of the stomach and intestines",
        "commonTreatments": [
          "Fluid therapy",
          "Dietary management",
          "Anti-nausea medication"
        ]
      },
      {
        "name": "Pancreatitis",
        "probability": 0.65,
        "description": "Inflammation of the pancreas",
        "commonTreatments": [
          "Pain management",
          "Fluid therapy",
          "Nutritional support"
        ]
      }
    ],
    "recommendedActions": [
      "Consult with a veterinarian immediately",
      "Keep the animal hydrated",
      "Monitor for worsening symptoms"
    ],
    "urgencyLevel": "moderate"
  },
  "metadata": {
    "processingTime": "1.2s",
    "modelVersion": "v2.3"
  }
}
            `}
            language="json"
          />

          <h3 className="text-xl font-semibold mt-6">Response Fields</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Field
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="px-4 py-3 text-sm font-mono">id</td>
                  <td className="px-4 py-3 text-sm">string</td>
                  <td className="px-4 py-3 text-sm">
                    Unique identifier for the diagnosis
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="errors" className="space-y-4">
          <h2 className="text-2xl font-bold">Error Handling</h2>
          <p>
            The eVet API uses standard HTTP response codes to indicate the
            success or failure of an API request.
          </p>

          <h3 className="text-xl font-semibold mt-6">Common Error Codes</h3>
          <p>Here are some common error codes you might encounter:</p>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Code
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="px-4 py-3 text-sm font-mono">
                    400 Bad Request
                  </td>
                  <td className="px-4 py-3 text-sm">
                    The request was malformed or missing required parameters.
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm font-mono">
                    401 Unauthorized
                  </td>
                  <td className="px-4 py-3 text-sm">
                    Authentication failed or the user does not have permissions
                    for the requested resource.
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm font-mono">403 Forbidden</td>
                  <td className="px-4 py-3 text-sm">
                    The user does not have permission to access the requested
                    resource.
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm font-mono">404 Not Found</td>
                  <td className="px-4 py-3 text-sm">
                    The requested resource was not found.
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm font-mono">
                    429 Too Many Requests
                  </td>
                  <td className="px-4 py-3 text-sm">
                    The user has exceeded the rate limit.
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm font-mono">
                    500 Internal Server Error
                  </td>
                  <td className="px-4 py-3 text-sm">
                    An unexpected error occurred on the server.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="rate-limits" className="space-y-4">
          <h2 className="text-2xl font-bold">Rate Limits</h2>
          <p>
            To ensure fair usage and prevent abuse, the eVet API is subject to
            rate limits.
          </p>

          <h3 className="text-xl font-semibold mt-6">Rate Limit Details</h3>
          <p>
            The API is limited to 100 requests per minute per API key. If you
            exceed this limit, you will receive a 429 Too Many Requests error.
          </p>

          <p>
            The rate limit is reset every minute. You can monitor your rate
            limit usage by checking the <code>X-RateLimit-Remaining</code>{" "}
            header in the API response.
          </p>
        </TabsContent>

        <TabsContent value="sdks" className="space-y-4">
          <h2 className="text-2xl font-bold">SDKs</h2>
          <p>
            To simplify integration with the eVet API, we provide SDKs for
            various programming languages.
          </p>

          <h3 className="text-xl font-semibold mt-6">Available SDKs</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <a href="#" className="text-blue-500 hover:underline">
                JavaScript SDK
              </a>
            </li>
            <li>
              <a href="#" className="text-blue-500 hover:underline">
                Python SDK
              </a>
            </li>
            <li>
              <a href="#" className="text-blue-500 hover:underline">
                Java SDK
              </a>
            </li>
          </ul>

          <p>
            Each SDK provides a convenient way to interact with the API,
            handling authentication, request formatting, and response parsing.
          </p>
        </TabsContent>

        <TabsContent value="examples" className="space-y-4">
          <h2 className="text-2xl font-bold">Examples</h2>
          <p>
            Here are some examples of how to use the eVet API in different
            programming languages.
          </p>

          <h3 className="text-xl font-semibold mt-6">JavaScript Example</h3>
          <CodeBlock
            code={`
// JavaScript example
const apiKey = 'YOUR_API_KEY';

fetch('https://api.evet.com/v1/diagnose', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': \`Bearer \${apiKey}\`
  },
  body: JSON.stringify({
    species: 'dog',
    breed: 'labrador',
    age: 5,
    weight: 30,
    symptoms: ['lethargy', 'loss of appetite', 'vomiting'],
    symptomDetails: 'Started showing symptoms 2 days ago, getting worse',
    images: []
  })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
            `}
            language="javascript"
          />

          <h3 className="text-xl font-semibold mt-6">Python Example</h3>
          <CodeBlock
            code={`
# Python example
import requests

api_key = 'YOUR_API_KEY'

headers = {
    'Content-Type': 'application/json',
    'Authorization': f'Bearer {api_key}'
}

data = {
    'species': 'dog',
    'breed': 'labrador',
    'age': 5,
    'weight': 30,
    'symptoms': ['lethargy', 'loss of appetite', 'vomiting'],
    'symptomDetails': 'Started showing symptoms 2 days ago, getting worse',
    'images': []
}

response = requests.post('https://api.evet.com/v1/diagnose', headers=headers, json=data)

print(response.json())
            `}
            language="python"
          />
        </TabsContent>
      </div>
    </Tabs>
  );
}

export default DocumentationTabs;
