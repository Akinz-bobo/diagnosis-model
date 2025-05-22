"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loader2, Send, Phone, Mail, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Specialist {
  id: string;
  name: string;
  image: string;
  phone: string;
  email: string;
  specialties: string[];
  available: boolean;
}

interface SpecialistContactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  diagnosisResult: any | null;
}

// Mock specialists data
const specialists: Specialist[] = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    image: "/placeholder.svg?height=100&width=100",
    phone: "+1 (555) 123-4567",
    email: "sarah.johnson@evet.com",
    specialties: ["Avian Pathology", "Infectious Diseases"],
    available: true,
  },
  {
    id: "2",
    name: "Dr. Michael Chen",
    image: "/placeholder.svg?height=100&width=100",
    phone: "+1 (555) 987-6543",
    email: "michael.chen@evet.com",
    specialties: ["Poultry Medicine", "Epidemiology"],
    available: true,
  },
  {
    id: "3",
    name: "Dr. Emily Rodriguez",
    image: "/placeholder.svg?height=100&width=100",
    phone: "+1 (555) 456-7890",
    email: "emily.rodriguez@evet.com",
    specialties: ["Diagnostic Imaging", "Clinical Pathology"],
    available: false,
  },
  {
    id: "4",
    name: "Dr. James Wilson",
    image: "/placeholder.svg?height=100&width=100",
    phone: "+1 (555) 234-5678",
    email: "james.wilson@evet.com",
    specialties: ["Avian Surgery", "Preventive Medicine"],
    available: true,
  },
];

export function SpecialistContactModal({
  open,
  onOpenChange,
  diagnosisResult,
}: SpecialistContactModalProps) {
  const [selectedSpecialist, setSelectedSpecialist] = useState<string>("");
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const { toast } = useToast();

  const handleSendReport = async () => {
    if (!selectedSpecialist) {
      toast({
        title: "Error",
        description: "Please select a specialist first",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);

    // Simulate sending the report
    setTimeout(() => {
      setIsSending(false);
      setIsSent(true);

      toast({
        title: "Report Sent",
        description:
          "The diagnosis report has been sent to the specialist via WhatsApp",
        variant: "default",
      });

      // Reset after 3 seconds
      setTimeout(() => {
        setIsSent(false);
        onOpenChange(false);
      }, 3000);
    }, 2000);
  };

  const handleClose = () => {
    setSelectedSpecialist("");
    setIsSent(false);
    onOpenChange(false);
  };

  const specialist = specialists.find((s) => s.id === selectedSpecialist);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Contact a Specialist</DialogTitle>
          <DialogDescription>
            Send your diagnosis report to a veterinary specialist for
            consultation
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select a Specialist</label>
            <Select
              value={selectedSpecialist}
              onValueChange={setSelectedSpecialist}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a specialist" />
              </SelectTrigger>
              <SelectContent>
                {specialists.map((specialist) => (
                  <SelectItem
                    key={specialist.id}
                    value={specialist.id}
                    disabled={!specialist.available}
                  >
                    <div className="flex items-center gap-2">
                      <span>{specialist.name}</span>
                      {!specialist.available && (
                        <Badge
                          variant="outline"
                          className="ml-2 bg-red-50 text-red-700 border-red-200"
                        >
                          Unavailable
                        </Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {specialist && (
            <div className="rounded-lg border p-4 space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={specialist.image || "/placeholder.svg"}
                    alt={specialist.name}
                  />
                  <AvatarFallback>
                    {specialist.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium text-lg">{specialist.name}</h3>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {specialist.specialties.map((specialty, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{specialist.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate">{specialist.email}</span>
                </div>
              </div>

              <div className="bg-muted rounded-md p-3 text-sm">
                <p className="text-muted-foreground">
                  The diagnosis report will be sent to {specialist.name} via
                  WhatsApp. They will review your case and contact you directly
                  for consultation.
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSendReport}
              disabled={!selectedSpecialist || isSending || isSent}
              className="bg-teal-600 hover:bg-teal-700"
            >
              {isSending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : isSent ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Sent!
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Report
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
