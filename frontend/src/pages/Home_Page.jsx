import {Link} from "react-router-dom";
import NavigationBar from "../components/NavigationBar";

const Home_Page = () => {
  return (
    <>
      <NavigationBar />
      <section className="min-h-screen w-full bg-gradient-to-tr from-white via-yellow-100 to-emerald-500 px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-center">
          <div className="flex w-full max-w-3xl flex-col items-center text-center">
            <h1 className="text-4xl font-bold leading-tight text-emerald-800 sm:text-5xl lg:text-6xl">
              Animal Care Management Website
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-7 text-gray-600 sm:text-base">
              A simple yet powerful system designed to help shelters and
              organizations manage animal records, monitor health, and support
              responsible adoption.
            </p>

            <div className="mt-8 grid w-full gap-3 sm:grid-cols-3">
              <Link
                to="/auth?mode=register"
                className="inline-flex w-full items-center justify-center rounded-full bg-emerald-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-700"
              >
                Get Started
              </Link>
              <Link
                to="/auth?mode=login"
                className="inline-flex w-full items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-900 transition hover:bg-slate-50"
              >
                Login
              </Link>
              <Link
                to="/register-pet"
                className="inline-flex w-full items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-medium text-emerald-800 transition hover:bg-emerald-100"
              >
                Register Pet
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home_Page;
