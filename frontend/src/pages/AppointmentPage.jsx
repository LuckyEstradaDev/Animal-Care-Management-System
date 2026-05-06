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
                 <Card>
                     <div className="justify-between items-end flex p-6">
                       <div>
                         <h1 className="text-lg font-semibold tracking-tight text-slate-900">Pet Appointments Table</h1>
                           <p className="text-sm leading-6 text-slate-600">
                             Upcoming vaccinations, follow-ups, and appointment reminders.
                           </p>
                       </div>
                     </div>
                 
                     <CardContent>
                 
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
                               <Button
                                 variant="outline"
                                 size="sm"
                                 onClick={() => alert('Tipaklong')}
                               >
                                 Edit
                               </Button>
                 
                               <Button
                                 variant="destructive"
                                 size="sm"
                                 onClick={() => alert('Tipaklong')}
                               >
                                 Delete
                               </Button>
                             </div>
                           </div>
                         ))}
                       </div>
                     </CardContent>
                   </Card>
        </section>
    )
}
export default AppointmentPage