
const NavigationBar = () => {
    return(
       <nav className="fixed top-0 w-full flex justify-between items-center p-6">
                <h1 className="text-2xl font-bold text-green-800">
                    🐾 Animal Care
                </h1>

                <div className="space-x-4">
                    <button className="text-green-800 font-medium">
                        Register
                    </button>
                    <button className="bg-emerald-600 text-white px-4 py-2 rounded-full hover:bg-emerald-700">
                        Create your account
                    </button>
                </div>
            </nav>
    )
}
export default NavigationBar;