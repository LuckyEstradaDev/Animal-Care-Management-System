export const availablePets = [
  {
    id: "p-101",
    name: "Milo",
    species: "Cat",
    breed: "British Shorthair",
    age: "2 years",
    size: "Small",
    energy: "Calm",
    compatibility: ["Apartment-friendly", "First-time owner", "Vaccinated"],
    idealHome: "Quiet indoor home",
    status: "Ready for adoption",
    description:
      "A mellow companion who loves soft blankets, sunny windows, and a gentle routine.",
    notes: "Litter-trained and comfortable with respectful children.",
    imageUrl:
      "https://images.unsplash.com/photo-1513245543132-31f507417b26?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "p-102",
    name: "Luna",
    species: "Dog",
    breed: "Miniature Poodle",
    age: "3 years",
    size: "Small",
    energy: "Playful",
    compatibility: ["Apartment-friendly", "Low-shedding", "Social"],
    idealHome: "Family home with regular walks",
    status: "Interviewing families",
    description:
      "Smart, affectionate, and eager to learn. Best matched with active owners who enjoy training time.",
    notes: "Great with routine and short daily enrichment sessions.",
    imageUrl:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "p-103",
    name: "Kiko",
    species: "Rabbit",
    breed: "Lionhead",
    age: "1 year",
    size: "Medium",
    energy: "Gentle",
    compatibility: ["Indoor habitat", "Quiet home", "Children 10+"],
    idealHome: "Stable indoor setup with supervised space",
    status: "Ready for adoption",
    description:
      "Curious and affectionate, with a calm temperament that thrives in a predictable environment.",
    notes: "Needs daily hay, enrichment, and space to hop safely.",
    imageUrl:
      "https://images.unsplash.com/photo-1535241749838-299277b6305f?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "p-104",
    name: "Coco",
    species: "Dog",
    breed: "Mixed Breed",
    age: "5 years",
    size: "Medium",
    energy: "Balanced",
    compatibility: ["Good walker", "Families", "Vaccinated"],
    idealHome: "Home with moderate exercise time",
    status: "On hold",
    description:
      "A steady companion who enjoys predictable walks, head scratches, and being near people.",
    notes: "Very patient during grooming and vet visits.",
    imageUrl:
      "https://images.unsplash.com/photo-1558944351-c6d4d2c3f7d7?auto=format&fit=crop&w=900&q=80",
  },
];

export const petProfiles = [
  {
    id: "p-101",
    name: "Milo",
    species: "Cat",
    breed: "British Shorthair",
    imageUrl:
      "https://images.unsplash.com/photo-1513245543132-31f507417b26?auto=format&fit=crop&w=900&q=80",
    nextVisit: "Apr 23, 2026",
    vaccinationRecords: [
      { label: "FVRCP booster", date: "Jan 16, 2026", status: "Completed" },
      { label: "Rabies vaccination", date: "Jan 16, 2026", status: "Completed" },
      { label: "Deworming", date: "Mar 29, 2026", status: "Completed" },
    ],
    medicalHistory: [
      "Routine wellness exam cleared on March 29, 2026",
      "Minor skin irritation treated with topical ointment",
      "No chronic conditions recorded",
    ],
    treatments: [
      "Omega-3 supplement for skin support",
      "Monthly flea prevention",
      "Dental cleaning planned for June 2026",
    ],
  },
  {
    id: "p-102",
    name: "Luna",
    species: "Dog",
    breed: "Miniature Poodle",
    imageUrl:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80",
    nextVisit: "Apr 26, 2026",
    vaccinationRecords: [
      { label: "DHPP booster", date: "Feb 11, 2026", status: "Completed" },
      { label: "Rabies vaccination", date: "Feb 11, 2026", status: "Completed" },
      { label: "Leptospirosis follow-up", date: "Apr 26, 2026", status: "Upcoming" },
    ],
    medicalHistory: [
      "Post-spay recovery completed without complications",
      "Normal heart and lung screening",
      "Behavioral assessment recommends positive reinforcement training",
    ],
    treatments: [
      "Heartworm prevention every 30 days",
      "Weekly ear checks due to curly coat",
      "Follow-up grooming appointment in 2 weeks",
    ],
  },
  {
    id: "p-103",
    name: "Kiko",
    species: "Rabbit",
    breed: "Lionhead",
    imageUrl:
      "https://images.unsplash.com/photo-1535241749838-299277b6305f?auto=format&fit=crop&w=900&q=80",
    nextVisit: "Apr 30, 2026",
    vaccinationRecords: [
      { label: "Myxomatosis vaccine", date: "Feb 20, 2026", status: "Completed" },
      { label: "RHDV2 vaccine", date: "Feb 20, 2026", status: "Completed" },
    ],
    medicalHistory: [
      "Healthy weight maintained across two checkups",
      "Recommended diet adjustment to improve coat condition",
      "No signs of GI upset in recent visits",
    ],
    treatments: [
      "Daily vitamin-rich greens",
      "Weekly weight tracking",
      "Trimming appointment for coat care",
    ],
  },
];

export const reminderItems = [
  {
    title: "Upcoming vaccination",
    detail: "Luna's Leptospirosis follow-up is due on Apr 26, 2026.",
    tone: "primary",
  },
  {
    title: "Follow-up checkup",
    detail: "Milo has a wellness review scheduled for Apr 23, 2026.",
    tone: "warning",
  },
  {
    title: "Appointment reminder",
    detail: "Your consultation booking is confirmed for Apr 21, 2026 at 11:30 AM.",
    tone: "default",
  },
];

export const screeningSteps = [
  { label: "Application received", date: "Apr 18, 2026", status: "Complete" },
  { label: "Screening review", date: "In progress", status: "Pending" },
  { label: "Reference call", date: "Awaiting admin", status: "Pending" },
  { label: "Final decision", date: "After review", status: "Pending" },
];

export const services = [
  "Consultation",
  "Pakapon",
];
