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
import type { DiagnosisResult } from "@/lib/types";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

export const columns: ColumnDef<DiagnosisResult>[] = [
  {
    accessorKey: "disease",
    header: "Disease",
  },
  {
    accessorKey: "species",
    header: "Species",
  },
  {
    accessorKey: "confidence",
    header: "Confidence",
    cell: ({ row }) => {
      const confidence = row.getValue("confidence") as number;
      return <div>{(confidence * 100).toFixed(1)}%</div>;
    },
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const diagnosis = row.original;
      const { toast } = useToast();
      const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

      const handleShare = () => {
        // In a real app, generate a shareable link
        navigator.clipboard.writeText(
          `https://evet.com/shared-diagnosis/${diagnosis.id}`
        );
        toast({
          title: "Link copied",
          description: "Shareable link has been copied to clipboard.",
        });
      };

      const handleDownload = () => {
        // In a real app, generate a PDF report
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
              <DropdownMenuItem onClick={() => setIsDetailsDialogOpen(true)}>
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

          {/* Details Dialog */}
          <Dialog
            open={isDetailsDialogOpen}
            onOpenChange={setIsDetailsDialogOpen}
          >
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Diagnosis Details</DialogTitle>
                <DialogDescription>
                  Detailed information about the diagnosis.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-medium">Disease</h3>
                    <p className="text-2xl font-bold text-teal-600">
                      {diagnosis.disease}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Confidence</h3>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-24 rounded-full bg-gray-200">
                        <div
                          className="h-2 rounded-full bg-teal-600"
                          style={{ width: `${diagnosis.confidence * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xl font-bold">
                        {(diagnosis.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Background Information
                  </h3>
                  <div className="rounded-lg bg-muted p-4">
                    <p className="text-sm leading-relaxed">
                      {diagnosis.background}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Species
                    </h4>
                    <p>{diagnosis.species}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Diagnosed
                    </h4>
                    <p>{diagnosis.date}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">
                      ID
                    </h4>
                    <p className="font-mono text-xs">{diagnosis.id}</p>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={handleShare}>
                    <Share2 className="mr-2 h-4 w-4" /> Share
                  </Button>
                  <Button
                    onClick={handleDownload}
                    className="bg-teal-600 hover:bg-teal-700"
                  >
                    <Download className="mr-2 h-4 w-4" /> Download Report
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </>
      );
    },
  },
];
