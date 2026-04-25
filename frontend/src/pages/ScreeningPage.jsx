import {useEffect, useMemo, useState} from "react";
import {Navigate} from "react-router-dom";
import {Badge} from "../components/ui/badge";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "../components/ui/card";
import {ShieldIcon} from "../components/icons";
import {useAuth} from "../context/AuthContext";
import {getAdoptionsByUser} from "../services/adoptionService";

const screeningSteps = [
  {label: "Application received", status: "Complete"},
  {label: "Screening review", status: "Pending"},
  {label: "Reference and fit check", status: "Pending"},
  {label: "Final decision", status: "Pending"},
];

function getPetName(pet) {
  if (!pet) return "Selected pet";
  if (typeof pet === "string") return pet;
  return pet.name || "Selected pet";
}

function getStatusVariant(status) {
  if (status === "approved") return "primary";
  if (status === "pending_review") return "warning";
  return "default";
}

function getStatusLabel(status) {
  if (status === "pending_review") return "Pending review";
  if (status === "approved") return "Approved";
  if (status === "rejected") return "Rejected";
  return status;
}

export default function ScreeningPage() {
  const {currentUser, isAuthenticated} = useAuth();
  const [adoptions, setAdoptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAdoptions() {
      if (!currentUser?.id) {
        setAdoptions([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError("");
        const response = await getAdoptionsByUser(currentUser.id);
        setAdoptions(response.adoptions ?? []);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Failed to load adoption requests.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadAdoptions();
  }, [currentUser?.id]);

  const latestApplication = useMemo(() => adoptions[0] ?? null, [adoptions]);

  if (!isAuthenticated) {
    return <Navigate to="/auth?mode=login" replace />;
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <Card>
          <CardHeader>
            <CardTitle>Screening timeline</CardTitle>
            <CardDescription>
              Follow the review journey from submission to final decision.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {latestApplication ? (
              <div className="space-y-4">
                {screeningSteps.map((step, index) => (
                  <div key={step.label} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-sm font-semibold text-white">
                        {index + 1}
                      </div>
                      {index < screeningSteps.length - 1 ? (
                        <div className="mt-2 h-full w-px bg-slate-200" />
                      ) : null}
                    </div>
                    <div className="min-w-0 pb-5">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <p className="break-words font-medium text-slate-950">
                          {step.label}
                        </p>
                        <Badge variant={index === 0 ? "primary" : "default"}>
                          {index === 0 ? "Complete" : "Pending"}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-slate-600">
                        {index === 0
                          ? new Date(latestApplication.createdAt).toLocaleDateString()
                          : "Waiting for review"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-3xl bg-slate-50 p-5 text-sm leading-6 text-slate-600">
                Submit an adoption application first and your screening journey
                will appear here.
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <CardTitle>Your latest request</CardTitle>
                  <CardDescription>
                    Screening begins in a pending state until reviewed.
                  </CardDescription>
                </div>
                <div className="shrink-0 rounded-2xl bg-emerald-50 p-2 text-emerald-700">
                  <ShieldIcon className="h-6 w-6" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid gap-3">
              {latestApplication ? (
                <div className="rounded-3xl border border-slate-200 bg-white p-5">
                  <Badge variant={getStatusVariant(latestApplication.status)}>
                    {getStatusLabel(latestApplication.status)}
                  </Badge>
                  <p className="mt-3 break-words text-lg font-semibold text-slate-950">
                    {getPetName(latestApplication.petId)}
                  </p>
                  <p className="mt-2 break-words text-sm leading-6 text-slate-600">
                    Submitted{" "}
                    {new Date(latestApplication.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ) : (
                <div className="rounded-3xl border border-slate-200 bg-white p-5 text-sm leading-6 text-slate-600">
                  No adoption requests submitted yet.
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>All applications</CardTitle>
              <CardDescription>
                Review your submitted requests and their current status.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {isLoading ? (
                <div className="rounded-3xl bg-slate-50 p-5 text-sm text-slate-600">
                  Loading your applications...
                </div>
              ) : error ? (
                <div className="rounded-3xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700">
                  {error}
                </div>
              ) : adoptions.length > 0 ? (
                adoptions.map((application) => (
                  <div
                    key={application._id}
                    className="rounded-3xl border border-slate-200 bg-white p-5"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <p className="break-words font-medium text-slate-950">
                          {getPetName(application.petId)}
                        </p>
                        <p className="text-sm text-slate-600">
                          Submitted{" "}
                          {new Date(application.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant={getStatusVariant(application.status)}>
                        {getStatusLabel(application.status)}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-3xl bg-slate-50 p-5 text-sm text-slate-600">
                  Your applications will appear here after submission.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
