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
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, Users, DollarSign } from "lucide-react";
import type { SubscriptionPlan } from "@/lib/types";

interface PlanManagementTableProps {
  plans: SubscriptionPlan[];
  onPlansChange: (plans: SubscriptionPlan[]) => void;
}

export function PlanManagementTable({
  plans,
  onPlansChange,
}: PlanManagementTableProps) {
  const [editingPlan, setEditingPlan] = useState<string | null>(null);

  const togglePlanStatus = (planId: string) => {
    const updatedPlans = plans.map((plan) =>
      plan.id === planId ? { ...plan, is_active: !plan.is_active } : plan
    );
    onPlansChange(updatedPlans);
  };

  const deletePlan = (planId: string) => {
    const updatedPlans = plans.filter((plan) => plan.id !== planId);
    onPlansChange(updatedPlans);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription Plans</CardTitle>
        <CardDescription>
          Manage your subscription plans, pricing, and features
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Plan Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Billing</TableHead>
              <TableHead>API Calls</TableHead>
              <TableHead>Features</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Subscribers</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {plans.map((plan) => (
              <TableRow key={plan.id}>
                <TableCell>
                  <div>
                    <div className="font-medium capitalize">{plan.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {plan.description}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">
                      {plan.price === 0 ? "Free" : plan.price.toLocaleString()}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {plan.billing_cycle}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="font-medium">
                    {plan.allowed_calls === -1
                      ? "Unlimited"
                      : plan.allowed_calls.toLocaleString()}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {plan.features.analytics_dashboard && (
                      <Badge variant="secondary" className="text-xs">
                        Analytics
                      </Badge>
                    )}
                    {plan.features.priority_queue && (
                      <Badge variant="secondary" className="text-xs">
                        Priority
                      </Badge>
                    )}
                    {plan.features.developer_support && (
                      <Badge variant="secondary" className="text-xs">
                        Dev Support
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={plan.is_active}
                      onCheckedChange={() => togglePlanStatus(plan.id)}
                    />
                    <Badge variant={plan.is_active ? "default" : "secondary"}>
                      {plan.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {plan.name === "freemium"
                        ? "756"
                        : plan.name === "pro"
                        ? "298"
                        : plan.name === "enterprise"
                        ? "35"
                        : "0"}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setEditingPlan(plan.id)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Plan
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Users className="mr-2 h-4 w-4" />
                        View Subscribers
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => deletePlan(plan.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Plan
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
