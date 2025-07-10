"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, FileText, Download, Share2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

// Local type for table columns to match actual data
// (not extending DiagnosisResult to avoid type conflicts)
type DiagnosisTableRow = {
  id: string;
  diagnosis?: { disease?: string; confidence?: number };
  raw_history?: { Species?: string };
  created_at?: string;
  // ...other fields as needed
};

export const columns: ColumnDef<DiagnosisTableRow>[] = [
  {
    accessorKey: "disease",
    header: "Disease",
    cell: ({ row }) => {
      const disease = row.original.diagnosis?.disease || "-";
      return <div className="font-medium">{disease}</div>;
    },
  },
  {
    accessorKey: "species",
    header: "Species",
    cell: ({ row }) => {
      const species = row.original.raw_history?.Species || "-";
      return <div className="font-medium">{species}</div>;
    },
  },
  {
    accessorKey: "confidence",
    header: "Confidence",
    cell: ({ row }) => {
      const confidence = row.original.diagnosis?.confidence;
      return (
        <div>
          {typeof confidence === "number"
            ? `${(confidence * 100).toFixed(1)}%`
            : "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Date",
    cell: ({ row }) => {
      const date = row.original.created_at;
      return date ? <span>{new Date(date).toLocaleDateString()}</span> : "-";
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const diagnosis = row.original;
      const { toast } = useToast();
      const router = useRouter();

      const handleShare = () => {
        navigator.clipboard.writeText(
          `https://evet.com/shared-diagnosis/${diagnosis.id}`
        );
        toast({
          title: "Link copied",
          description: "Shareable link has been copied to clipboard.",
        });
      };

      const handleDownload = () => {
        toast({
          title: "Report downloaded",
          description: "Diagnosis report has been downloaded.",
        });
      };

      return (
        <>
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
              <DropdownMenuItem
                onClick={() => router.push(`/diagnosis/${diagnosis.id}`)}
              >
                <FileText className="mr-2 h-4 w-4" /> View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" /> Download Report
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleShare}>
                <Share2 className="mr-2 h-4 w-4" /> Share
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];
