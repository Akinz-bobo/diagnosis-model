import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Subscription Plans | eVet",
  description: "Choose the right subscription plan for your veterinary needs",
};

const plans = [
  {
    name: "Free",
    description: "Basic access for individuals",
    price: "$0",
    period: "forever",
    features: [
      "5 diagnoses per month",
      "Basic API access",
      "Email support",
      "1 user account",
    ],
    cta: "Get Started",
    href: "/signup",
    popular: false,
  },
  {
    name: "Professional",
    description: "For small veterinary practices",
    price: "$49",
    period: "per month",
    features: [
      "100 diagnoses per month",
      "Full API access",
      "Priority email support",
      "5 user accounts",
      "Advanced analytics",
      "Custom branding",
    ],
    cta: "Start Free Trial",
    href: "/signup?plan=professional",
    popular: true,
  },
  {
    name: "Enterprise",
    description: "For large veterinary organizations",
    price: "$199",
    period: "per month",
    features: [
      "Unlimited diagnoses",
      "Full API access",
      "24/7 phone & email support",
      "Unlimited user accounts",
      "Advanced analytics",
      "Custom branding",
      "Dedicated account manager",
      "Custom integrations",
    ],
    cta: "Contact Sales",
    href: "/contact",
    popular: false,
  },
];

const faqs = [
  {
    question: "Can I upgrade or downgrade my plan?",
    answer:
      "Yes, you can change your plan at any time. Changes take effect at the start of your next billing cycle.",
  },
  {
    question: "Is there a contract or commitment?",
    answer:
      "No, all plans are month-to-month with no long-term commitment. You can cancel anytime.",
  },
  {
    question: "Do you offer discounts for annual billing?",
    answer:
      "Yes, you can save 20% by choosing annual billing on any paid plan.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.",
  },
  {
    question: "Can I try before I buy?",
    answer:
      "Yes, we offer a 14-day free trial on all paid plans. No credit card required to start.",
  },
  {
    question: "How do I cancel my subscription?",
    answer:
      "You can cancel your subscription at any time from your account settings. Your access will continue until the end of your current billing period.",
  },
];

export default function SubscriptionPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-teal-600 mb-2">
          Subscription Plans
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Choose the right plan for your veterinary practice. All plans include
          access to our AI-powered diagnosis system.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`flex flex-col ${
              plan.popular ? "border-teal-600 shadow-lg relative" : ""
            }`}
          >
            {plan.popular && (
              <div className="absolute top-0 right-0 -mt-2 -mr-2 bg-teal-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                Popular
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground ml-1">
                  {plan.period}
                </span>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <Check className="h-4 w-4 text-teal-600 mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                asChild
                className={`w-full ${
                  plan.popular ? "bg-teal-600 hover:bg-teal-700" : ""
                }`}
                variant={plan.popular ? "default" : "outline"}
              >
                <Link href={plan.href}>{plan.cta}</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Need a custom plan?</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
          We offer custom plans for large organizations with specific needs.
          Contact our sales team to discuss your requirements.
        </p>
        <Button asChild className="bg-teal-600 hover:bg-teal-700">
          <Link href="/contact">Contact Sales</Link>
        </Button>
      </div>

      <div className="mt-16 bg-muted p-8 rounded-lg max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left font-medium">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
