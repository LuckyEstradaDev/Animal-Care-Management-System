import { useMemo, useState } from "react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select } from "../components/ui/select";
import { PageHeader } from "../components/page-header";
import { availablePets } from "../data/mockData";
import { SparklesIcon } from "../components/icons";

const initialAnswers = {
  lifestyle: "Apartment",
  activity: "Calm",
  experience: "First-time adopter",
  family: "Yes",
  petSize: "Small",
  weeklyTime: "7",
};

function scorePet(pet, answers) {
  let score = 0;

  if (pet.size === answers.petSize) score += 3;
  if (pet.energy === answers.activity) score += 4;
  if (answers.lifestyle === "Apartment" && pet.compatibility.some((item) => item.includes("Apartment"))) {
    score += 3;
  }
  if (answers.family === "Yes" && pet.compatibility.some((item) => item.includes("Families"))) {
    score += 2;
  }
  if (answers.family === "No" && pet.energy !== "Playful") score += 1;
  if (answers.experience === "First-time adopter" && pet.compatibility.some((item) => item.includes("First-time"))) {
    score += 3;
  }
  if (Number(answers.weeklyTime) >= 10 && pet.energy !== "Calm") score += 1;

  return score;
}

export default function MatchingPage() {
  const [answers, setAnswers] = useState(initialAnswers);
  const [results, setResults] = useState(null);

  function updateAnswer(key, value) {
    setAnswers({ ...answers, [key]: value });
    setResults(null);
  }

  const recommendedPets = useMemo(() => {
    const scored = availablePets
      .map((pet) => ({ ...pet, score: scorePet(pet, answers) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    return results ?? scored;
  }, [answers, results]);

  function handleSubmit(event) {
    event.preventDefault();
    const scored = availablePets
      .map((pet) => ({ ...pet, score: scorePet(pet, answers) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    setResults(scored);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="2.2 AI-Based Pet Matching"
        title="Answer the questionnaire and see recommended pets"
        description="A short questionnaire helps surface pets that fit your lifestyle and preferences."
      />

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <CardHeader>
            <CardTitle>Questionnaire</CardTitle>
            <CardDescription>Fill in the details and click Find Match.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="lifestyle">Living space</Label>
                  <Select
                    id="lifestyle"
                    value={answers.lifestyle}
                    onChange={(event) => updateAnswer("lifestyle", event.target.value)}
                  >
                    <option>Apartment</option>
                    <option>House</option>
                    <option>Condominium</option>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="activity">Energy level</Label>
                  <Select
                    id="activity"
                    value={answers.activity}
                    onChange={(event) => updateAnswer("activity", event.target.value)}
                  >
                    <option>Calm</option>
                    <option>Balanced</option>
                    <option>Gentle</option>
                    <option>Playful</option>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="experience">Experience level</Label>
                  <Select
                    id="experience"
                    value={answers.experience}
                    onChange={(event) => updateAnswer("experience", event.target.value)}
                  >
                    <option>First-time adopter</option>
                    <option>Some experience</option>
                    <option>Experienced owner</option>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="family">Children in home</Label>
                  <Select
                    id="family"
                    value={answers.family}
                    onChange={(event) => updateAnswer("family", event.target.value)}
                  >
                    <option>Yes</option>
                    <option>No</option>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="petSize">Preferred size</Label>
                  <Select
                    id="petSize"
                    value={answers.petSize}
                    onChange={(event) => updateAnswer("petSize", event.target.value)}
                  >
                    <option>Small</option>
                    <option>Medium</option>
                    <option>Large</option>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weeklyTime">Time available per week</Label>
                  <Input
                    id="weeklyTime"
                    type="number"
                    min="1"
                    value={answers.weeklyTime}
                    onChange={(event) => updateAnswer("weeklyTime", event.target.value)}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full">
                <SparklesIcon className="h-4 w-4" />
                Find Match
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recommended pets</CardTitle>
              <CardDescription>The top matches update after you submit the questionnaire.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recommendedPets.map((pet, index) => (
                <div key={pet.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-slate-950">{pet.name}</h3>
                        <Badge variant={index === 0 ? "primary" : "default"}>Match {pet.score}</Badge>
                      </div>
                      <p className="mt-1 text-sm text-slate-600">
                        {pet.species} | {pet.breed}
                      </p>
                    </div>
                    <div className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-800">
                      #{index + 1}
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{pet.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How it works</CardTitle>
              <CardDescription>Simple signals guide the ranking.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm leading-6 text-slate-600">
              <p>Living space is compared with home suitability.</p>
              <p>Energy level is matched against temperament.</p>
              <p>Experience and family profile adjust the score.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
