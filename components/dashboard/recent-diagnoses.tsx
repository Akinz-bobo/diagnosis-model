import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function RecentDiagnoses() {
  const diagnoses = [
    {
      id: "1",
      disease: "Avian Influenza",
      confidence: 0.92,
      date: "2 hours ago",
      species: "Chicken",
    },
    {
      id: "2",
      disease: "Newcastle Disease",
      confidence: 0.87,
      date: "Yesterday",
      species: "Chicken",
    },
    {
      id: "3",
      disease: "Fowl Cholera",
      confidence: 0.78,
      date: "3 days ago",
      species: "Duck",
    },
    {
      id: "4",
      disease: "Infectious Bronchitis",
      confidence: 0.95,
      date: "1 week ago",
      species: "Chicken",
    },
  ];

  return (
    <div className="space-y-4">
      {diagnoses.map((diagnosis) => (
        <div key={diagnosis.id} className="flex items-center">
          <Avatar className="h-9 w-9 mr-3">
            <AvatarFallback className="bg-teal-100 text-teal-800">
              {diagnosis.species.substring(0, 1)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">
              {diagnosis.disease}
            </p>
            <p className="text-xs text-muted-foreground">
              {diagnosis.species} • {diagnosis.date}
            </p>
          </div>
          <div className="ml-auto font-medium text-sm">
            {(diagnosis.confidence * 100).toFixed(0)}%
          </div>
        </div>
      ))}
    </div>
  );
}
