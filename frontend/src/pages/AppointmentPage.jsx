import {
  availablePets,
  reminderItems,
  screeningSteps,
  services,
} from "../data/mockData";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {Link} from "react-router-dom";
import {Badge} from "../components/ui/badge";
import {Button} from "../components/ui/button";

const AppointmentPage = () =>{
    return(
        <section className="bg-transparent h-screen w-full">
                 <div className="space-y-6">
                     <div className="justify-between items-end flex">
                       <div>
                         <h1 className="text-lg font-semibold tracking-tight text-white">Pet Appointments Table</h1>
                           <p className="text-sm leading-6 text-white">
                             Upcoming vaccinations, follow-ups, and appointment reminders.
                           </p>
                       </div>
                     </div>
                 
                     <div>
                 
                       {/* TABLE HEADER */}
                       <div className="grid grid-cols-4 bg-slate-100 p-3 rounded-t-xl font-semibold text-sm">
                         <div className="text-gray-800">Title</div>
                         <div className="text-gray-800">Detail</div>
                         <div className="text-gray-800">Status</div>
                         <div className="text-gray-800 text-right">Actions</div>
                       </div>
                 
                       {/* TABLE BODY */}
                       <div className="divide-y">
                         {reminderItems.map((item, index) => (
                           <div
                             key={index}
                             className="grid grid-cols-4 items-center p-3 bg-white hover:bg-slate-50"
                           >
                             {/* TITLE */}
                             <div className="font-medium text-gray-800">{item.title}</div>
                 
                             {/* DETAIL */}
                             <div className="text-sm text-slate-600">{item.detail}</div>
                 
                             {/* STATUS */}
                             <div>
                               <Badge
                                 variant={
                                   item.tone === "primary"
                                     ? "default"
                                     : item.tone === "warning"
                                     ? "secondary"
                                     : "outline"
                                 }
                               >
                                 {item.tone}
                               </Badge>
                             </div>
                 
                             {/* ACTIONS */}
                             <div className="flex justify-end gap-2">
                               <button className="bg-emerald-500 h-10 w-10 text-white text-xs font-semibold rounded-full cursor-pointer hover:bg-emerald-600">✓</button>
                               <button className="bg-red-500 h-10 w-10 text-white text-xs font-semibold rounded-full cursor-pointer hover:bg-red-600">🗑</button>
                             </div>
                           </div>
                         ))}
                       </div>
                     </div>
                   </div>
        </section>
    )
}
export default AppointmentPage