import {useMemo, useState} from "react";
import {Link, Navigate} from "react-router-dom";
import {Badge} from "../components/ui/badge";
import {Button} from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {Input} from "../components/ui/input";
import {Label} from "../components/ui/label";
import {Select} from "../components/ui/select";
import {Textarea} from "../components/ui/textarea";
import {useAuth} from "../context/AuthContext";
import {usePetRegistration} from "../context/PetRegistrationContext";

const initialForm = {
  petName: "",
  species: "Dog",
  breed: "",
  age: "",
  size: "Medium",
  temperament: "Calm",
  description: "",
  reason: "",
  photoUrl: "",
};

export default function PetRegistrationPage() {
  const {currentUser, isAuthenticated} = useAuth();
  const {submissions, registerPet} = usePetRegistration();
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(null);

  const mySubmissions = useMemo(
    () => submissions.filter((item) => item.ownerEmail === currentUser?.email),
    [submissions, currentUser],
  );

  if (!isAuthenticated) {
    return <Navigate to="/auth?mode=login" replace />;
  }

  function handleSubmit(event) {
    event.preventDefault();

    const nextSubmission = registerPet({
      ownerName: currentUser?.name ?? "",
      ownerEmail: currentUser?.email ?? "",
      accountType: currentUser?.role ?? "adopter",
      ...form,
    });

    setSubmitted(nextSubmission);
    setForm(initialForm);
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1fr_0.85fr]">
        <Card>
          <CardHeader>
            <CardTitle>Pet registration form</CardTitle>
            <CardDescription>
              {currentUser?.role === "pet_owner"
                ? "Your account is marked as a pet owner."
                : "This page is open to logged-in users, but it is designed for pet owners."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="ownerName">Owner name</Label>
                  <Input
                    id="ownerName"
                    value={currentUser?.name ?? ""}
                    readOnly
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ownerEmail">Owner email</Label>
                  <Input
                    id="ownerEmail"
                    value={currentUser?.email ?? ""}
                    readOnly
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="petName">Pet name</Label>
                  <Input
                    id="petName"
                    value={form.petName}
                    onChange={(event) =>
                      setForm({...form, petName: event.target.value})
                    }
                    placeholder="Coco"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="breed">Breed</Label>
                  <Input
                    id="breed"
                    value={form.breed}
                    onChange={(event) =>
                      setForm({...form, breed: event.target.value})
                    }
                    placeholder="Mixed Breed"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="species">Species</Label>
                  <Select
                    id="species"
                    value={form.species}
                    onChange={(event) =>
                      setForm({...form, species: event.target.value})
                    }
                  >
                    <option>Dog</option>
                    <option>Cat</option>
                    <option>Rabbit</option>
                    <option>Bird</option>
                    <option>Other</option>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    value={form.age}
                    onChange={(event) =>
                      setForm({...form, age: event.target.value})
                    }
                    placeholder="2 years"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="size">Size</Label>
                  <Select
                    id="size"
                    value={form.size}
                    onChange={(event) =>
                      setForm({...form, size: event.target.value})
                    }
                  >
                    <option>Small</option>
                    <option>Medium</option>
                    <option>Large</option>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="temperament">Temperament</Label>
                  <Select
                    id="temperament"
                    value={form.temperament}
                    onChange={(event) =>
                      setForm({...form, temperament: event.target.value})
                    }
                  >
                    <option>Calm</option>
                    <option>Playful</option>
                    <option>Gentle</option>
                    <option>Active</option>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="photoUrl">Photo URL</Label>
                  <Input
                    id="photoUrl"
                    value={form.photoUrl}
                    onChange={(event) =>
                      setForm({...form, photoUrl: event.target.value})
                    }
                    placeholder="Optional image link"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Pet description</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(event) =>
                    setForm({...form, description: event.target.value})
                  }
                  placeholder="Tell us about the pet's personality, habits, and care needs."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Why is the pet being registered?</Label>
                <Textarea
                  id="reason"
                  value={form.reason}
                  onChange={(event) =>
                    setForm({...form, reason: event.target.value})
                  }
                  placeholder="Explain the reason for the adoption listing."
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Submit for admin review
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Review status</CardTitle>
              <CardDescription>
                New pet registrations always enter pending review first.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {submitted ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-emerald-900">
                        {submitted.petName}
                      </p>
                      <p className="text-sm text-emerald-800">
                        {submitted.species} | {submitted.breed}
                      </p>
                    </div>
                    <Badge variant="warning">{submitted.status}</Badge>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-emerald-900/90">
                    Admins will review the listing before it appears as
                    available for adoption.
                  </p>
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <p className="font-medium text-slate-950">
                    No submission yet.
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Once submitted, the status will show as pending until an
                    admin reviews it.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your submissions</CardTitle>
              <CardDescription>
                These entries remain in local storage for the prototype.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {mySubmissions.length > 0 ? (
                mySubmissions.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-slate-200 bg-white p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium text-slate-950">
                          {item.petName}
                        </p>
                        <p className="text-sm text-slate-600">
                          {item.species} | {item.breed}
                        </p>
                      </div>
                      <Badge variant="warning">{item.status}</Badge>
                    </div>
                    <p className="mt-2 text-xs uppercase tracking-[0.16em] text-slate-500">
                      Submitted {item.submittedAt}
                    </p>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                  Your submissions will appear here after you register a pet.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
