"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, Calendar, CreditCard } from "lucide-react";
import { format } from "date-fns";

interface SubscriptionHistoryProps {
  userId: string;
}

interface SubscriptionHistoryItem {
  id: string;
  plan_name: string;
  amount: number;
  status: "paid" | "pending" | "failed";
  date: string;
  invoice_url?: string;
}

export function SubscriptionHistory({ userId }: SubscriptionHistoryProps) {
  const [history, setHistory] = useState<SubscriptionHistoryItem[]>([]);

  useEffect(() => {
    // Mock data - replace with actual API call
    setHistory([
      {
        id: "inv_001",
        plan_name: "freemium",
        amount: 0,
        status: "paid",
        date: "2025-01-01T00:00:00Z",
      },
      {
        id: "inv_002",
        plan_name: "pro",
        amount: 49,
        status: "paid",
        date: "2024-12-01T00:00:00Z",
        invoice_url: "#",
      },
      {
        id: "inv_003",
        plan_name: "pro",
        amount: 49,
        status: "paid",
        date: "2024-11-01T00:00:00Z",
        invoice_url: "#",
      },
    ]);
  }, [userId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="h-5 w-5" />
          <span>Subscription History</span>
        </CardTitle>
        <CardDescription>
          View your past subscription payments and invoices
        </CardDescription>
      </CardHeader>
      <CardContent>
        {history.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {format(new Date(item.date), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {item.plan_name}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">
                      {item.amount === 0 ? "Free" : `$${item.amount}`}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {item.invoice_url && item.status === "paid" && (
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Invoice
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8">
            <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              No subscription history available
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
