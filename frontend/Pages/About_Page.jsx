
const About_Page = () => {

    return (
        <section className="bg-white w-full px-6 md:px-16 lg:px-32 py-16 space-y-20">

            <div className="flex-1 w-full justify-center items-start flex flex-col px-80">
                <h1 className="text-4xl md:text-3xl font-bold text-green-800">About Animal Care 🐾</h1>

                <p className="text-gray-600 mt-6">
                    AnimalSys is a modern and efficient animal management system designed 
                    to help shelters, veterinary clinics, and organizations manage animal 
                    records with ease. It simplifies daily operations by organizing essential 
                    information such as animal profiles, health history, and adoption status 
                    in one centralized platform.
                </p>

                <p className="text-gray-600 mt-4">
                    Our goal is to reduce manual work and improve accuracy by providing a 
                    user-friendly digital solution. With AnimalSys, staff can quickly access 
                    important data, monitor animal conditions, and ensure that every animal 
                    receives proper care and attention.
                </p>

                <p className="text-gray-600 mt-4">
                    By combining simplicity, efficiency, and reliability, AnimalSys supports 
                    organizations in delivering better services and promoting responsible 
                    animal care and adoption for a better and more compassionate community.
                </p>
            </div>

            <div className="h-100 w-full justify-center items-start flex flex-col px-80 gap-4">
                        <h2 className="text-3xl font-bold text-green-800">Offered Services</h2>

                    <div className="bg-gray-100 w-full p-6 rounded-2xl shadow hover:shadow-lg transition">
                        <h3 className="text-lg font-semibold">📋 Animal Records</h3>
                        <p className="text-gray-600 mt-2">
                            Keep organized and detailed records of all animals.
                        </p>
                    </div>

                    <div className="bg-gray-100  w-full p-6 rounded-2xl shadow hover:shadow-lg transition">
                        <h3 className="text-lg font-semibold">💉 Health Monitoring</h3>
                        <p className="text-gray-600 mt-2">
                            Track vaccinations and medical history easily.
                        </p>
                    </div>

                    <div className="bg-gray-100 w-full p-6 rounded-2xl shadow hover:shadow-lg transition">
                        <h3 className="text-lg font-semibold">🏠 Adoption Tracking</h3>
                        <p className="text-gray-600 mt-2">
                            Manage adoption status and new pet owners.
                        </p>
                    </div>

                
            </div>
        </section>
    )
}

export default About_Page;