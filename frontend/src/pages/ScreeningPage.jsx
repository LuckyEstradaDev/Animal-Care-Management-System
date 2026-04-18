import { Badge } from "../components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { PageHeader } from "../components/page-header";
import { screeningSteps } from "../data/mockData";
import { ShieldIcon } from "../components/icons";

export default function ScreeningPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="2.6 Adoption Screening"
        title="Track the application review outcome"
        description="The screening flow shows the states a user can see after an adoption form is submitted: pending, approved, or rejected."
      />

      <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <Card>
          <CardHeader>
            <CardTitle>Screening timeline</CardTitle>
            <CardDescription>Follow the review journey from submission to final decision.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {screeningSteps.map((step, index) => (
                <div key={step.label} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-sm font-semibold text-white">
                      {index + 1}
                    </div>
                    {index < screeningSteps.length - 1 ? <div className="mt-2 h-full w-px bg-slate-200" /> : null}
                  </div>
                  <div className="pb-5">
                    <div className="flex items-center gap-3">
                      <p className="font-medium text-slate-950">{step.label}</p>
                      <Badge variant={step.status === "Complete" ? "primary" : "default"}>
                        {step.status}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-slate-600">{step.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <CardTitle>Possible outcomes</CardTitle>
                  <CardDescription>Users should see one of these states after review.</CardDescription>
                </div>
                <div className="rounded-2xl bg-emerald-50 p-2 text-emerald-700">
                  <ShieldIcon className="h-6 w-6" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid gap-3">
              {[
                {
                  title: "Pending",
                  text: "The application is waiting in the admin queue.",
                  tone: "warning",
                },
                {
                  title: "Approved",
                  text: "The adopter can continue to the next onboarding step.",
                  tone: "primary",
                },
                {
                  title: "Rejected",
                  text: "The system can display a reason and allow a new submission later.",
                  tone: "default",
                },
              ].map((item) => (
                <div key={item.title} className="rounded-3xl border border-slate-200 bg-white p-5">
                  <Badge variant={item.tone}>{item.title}</Badge>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{item.text}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>What the user sees</CardTitle>
              <CardDescription>
                A concise message, a status badge, and the application reference number.
              </CardDescription>
            </CardHeader>
            <CardContent className="rounded-3xl bg-slate-50 p-5 text-sm leading-6 text-slate-600">
              Once the adoption form is submitted, the status card on the adoption page updates immediately to
              show pending review. Later, the same location can present approved or rejected states without
              changing the layout.
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
