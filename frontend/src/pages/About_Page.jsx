const About_Page = () => {
  return (
    <section className="bg-white px-4 py-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-950">About Animal Care</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600 md:text-base">
            AnimalSys is a digital platform that keeps adoption, health, and care records in one place.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h3 className="text-base font-semibold text-slate-950">Animal Records</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Keep organized records for every animal.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h3 className="text-base font-semibold text-slate-950">Health Monitoring</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Track vaccinations and medical history.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h3 className="text-base font-semibold text-slate-950">Adoption Tracking</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Manage adoption status with less manual work.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About_Page;
