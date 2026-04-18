import NavigationBar from "../Components/NavigationBar";

const Home_Page = () => {

    return (
        <>
        <NavigationBar />
        <section className="bg-gradient-to-tr from-white via-yellow-100 to-emerald-500 min-h-screen w-full justify-center items-center flex flex-col px-100">

            {/* Hero Section */}
            <div className="justify-center items-center flex flex-col text-center px-6">
                
                <h1 className="text-6xl font-bold text-emerald-800 leading-tight">
                    Animal Care Management Website 🐱
                </h1>

                <p className="text-gray-600 mt-6 max-w-xl">
                    A simple yet powerful system designed to help shelters and organizations 
                    manage animal records, monitor health, and support responsible adoption.
                </p>

                <div className="mt-8 flex gap-4">
                    <button className="bg-emerald-600 text-white px-6 py-2 rounded-full hover:bg-emerald-700">
                        Get Started
                    </button>
                </div>
            </div>

        </section>
        </>
        
    )
}

export default Home_Page;