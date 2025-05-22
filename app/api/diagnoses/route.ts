import { type NextRequest, NextResponse } from "next/server";

// Mock data store
const diagnoses = [
  {
    id: "1",
    disease: "Avian Influenza",
    confidence: 0.92,
    date: "2 hours ago",
    species: "Chicken",
    background:
      "Avian influenza, commonly known as bird flu, is a highly contagious viral infection that affects birds. The disease is caused by influenza A viruses. These viruses can infect domestic poultry, including chickens, ducks, and turkeys, as well as wild birds. The symptoms include respiratory distress, decreased egg production, swollen head, and high mortality rates.",
    processed_images: [
      {
        url: "/placeholder.svg?height=300&width=400",
        lesions: [
          "Hemorrhagic tracheitis",
          "Airsacculitis with fibrinous exudate",
          "Congested lungs",
        ],
        relevance:
          "These respiratory lesions are highly consistent with Avian Influenza, particularly the hemorrhagic inflammation of the trachea which is a hallmark of HPAI.",
      },
      {
        url: "/placeholder.svg?height=300&width=400",
        lesions: [
          "Petechial hemorrhages on serosal surfaces",
          "Enlarged, mottled spleen",
          "Necrotic pancreas",
        ],
        relevance:
          "The systemic hemorrhages and pancreatic necrosis are characteristic of Highly Pathogenic Avian Influenza (HPAI), supporting the primary diagnosis.",
      },
    ],
    differential_diagnoses: [
      "Newcastle Disease",
      "Infectious Laryngotracheitis",
      "Acute Fowl Cholera",
    ],
    conclusion:
      "Based on the clinical history and lesions observed, this case presents with classic signs of Highly Pathogenic Avian Influenza. The combination of respiratory and systemic lesions, particularly the hemorrhagic tracheitis and pancreatic necrosis, strongly supports this diagnosis. However, laboratory confirmation through PCR or virus isolation is recommended for definitive diagnosis.",
  },
  {
    id: "2",
    disease: "Newcastle Disease",
    confidence: 0.87,
    date: "Yesterday",
    species: "Chicken",
    background:
      "Newcastle disease is a highly contagious viral disease affecting many species of birds, including domestic poultry. It is caused by avian paramyxovirus type 1 (APMV-1). The disease can cause severe respiratory, neurological, and digestive symptoms, and can lead to high mortality rates in affected flocks.",
    processed_images: [
      {
        url: "/placeholder.svg?height=300&width=400",
        lesions: [
          "Hemorrhagic lesions in the intestine",
          "Tracheal hemorrhage",
          "Airsacculitis",
        ],
        relevance:
          "The combination of intestinal and respiratory tract hemorrhages is highly suggestive of velogenic Newcastle Disease.",
      },
    ],
    differential_diagnoses: [
      "Avian Influenza",
      "Infectious Bronchitis",
      "Infectious Laryngotracheitis",
    ],
    conclusion:
      "The clinical presentation and lesions are consistent with Newcastle Disease. The presence of both respiratory and intestinal hemorrhagic lesions is characteristic of the velogenic form of Newcastle Disease. Confirmation through virus isolation or PCR is recommended.",
  },
  {
    id: "3",
    disease: "Fowl Cholera",
    confidence: 0.78,
    date: "3 days ago",
    species: "Duck",
    background:
      "Fowl cholera is a contagious bacterial disease that affects domestic and wild birds. It is caused by the bacterium Pasteurella multocida. The disease can be acute or chronic, with symptoms including respiratory distress, diarrhea, and sudden death in acute cases.",
    processed_images: [
      {
        url: "/placeholder.svg?height=300&width=400",
        lesions: [
          "Multiple necrotic foci in the liver",
          "Fibrinous pericarditis",
          "Pneumonia",
        ],
        relevance:
          "The pattern of multifocal necrosis in the liver along with fibrinous inflammation of the pericardium is characteristic of Fowl Cholera.",
      },
    ],
    differential_diagnoses: [
      "Colibacillosis",
      "Salmonellosis",
      "Avian Influenza",
    ],
    conclusion:
      "The lesions observed are consistent with Fowl Cholera (Pasteurella multocida infection). The presence of multifocal necrosis in the liver and fibrinous pericarditis are hallmark lesions. Bacterial culture and sensitivity testing are recommended to confirm the diagnosis and guide antibiotic therapy.",
  },
  {
    id: "4",
    disease: "Infectious Bronchitis",
    confidence: 0.95,
    date: "1 week ago",
    species: "Chicken",
    background:
      "Infectious bronchitis is a highly contagious respiratory disease of chickens caused by infectious bronchitis virus (IBV), a coronavirus. The disease affects the respiratory tract, kidneys, and reproductive system of chickens, leading to reduced egg production and quality in laying hens.",
    processed_images: [
      {
        url: "/placeholder.svg?height=300&width=400",
        lesions: [
          "Caseous exudate in trachea",
          "Cloudy air sacs",
          "Swollen, pale kidneys",
        ],
        relevance:
          "The combination of respiratory lesions and nephritis is highly characteristic of Infectious Bronchitis, particularly strains with nephropathogenic properties.",
      },
    ],
    differential_diagnoses: [
      "Infectious Laryngotracheitis",
      "Newcastle Disease",
      "Avian Influenza",
    ],
    conclusion:
      "The observed lesions are consistent with Infectious Bronchitis. The presence of both respiratory and renal lesions suggests infection with a nephropathogenic strain of IBV. Molecular testing for IBV is recommended for confirmation and strain typing.",
  },
];

export async function GET(request: NextRequest) {
  // Get query parameters
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id");
  const userId = searchParams.get("userId");

  // If ID is provided, return a specific diagnosis
  if (id) {
    const diagnosis = diagnoses.find((d) => d.id === id);
    if (!diagnosis) {
      return NextResponse.json(
        { message: "Diagnosis not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(diagnosis);
  }

  // If userId is provided, filter by user (in a real app)
  // For now, just return all diagnoses
  return NextResponse.json(diagnoses);
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // In a real app, process the data and create a diagnosis
    // For now, create a mock diagnosis
    const diseases = [
      "Avian Influenza",
      "Newcastle Disease",
      "Fowl Cholera",
      "Infectious Bronchitis",
      "Marek's Disease",
    ];
    const randomDisease = diseases[Math.floor(Math.random() * diseases.length)];
    const confidence = 0.7 + Math.random() * 0.3; // Random confidence between 0.7 and 1.0

    const newDiagnosis = {
      id: `diag-${Date.now()}`,
      disease: randomDisease,
      confidence,
      date: "Just now",
      species: data.Species || "Unknown",
      background:
        "Detailed background information about the disease would be provided by the AI model.",
      processed_images: [
        {
          url: "/placeholder.svg?height=300&width=400",
          lesions: ["Sample lesion 1", "Sample lesion 2", "Sample lesion 3"],
          relevance:
            "These lesions are consistent with the diagnosed condition.",
        },
      ],
      differential_diagnoses: [
        diseases[Math.floor(Math.random() * diseases.length)],
        diseases[Math.floor(Math.random() * diseases.length)],
        diseases[Math.floor(Math.random() * diseases.length)],
      ],
      conclusion:
        "This is a tentative diagnosis based on the provided images and clinical history. Laboratory confirmation is recommended.",
    };

    // In a real app, save to database
    // For now, just return the new diagnosis
    return NextResponse.json(newDiagnosis);
  } catch (error) {
    console.error("Error creating diagnosis:", error);
    return NextResponse.json(
      { message: "Failed to create diagnosis" },
      { status: 500 }
    );
  }
}
