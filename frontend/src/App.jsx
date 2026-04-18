import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import DashboardPage from "./pages/DashboardPage";
import AdoptionPage from "./pages/AdoptionPage";
import MatchingPage from "./pages/MatchingPage";
import AppointmentsPage from "./pages/AppointmentsPage";
import MyPetsPage from "./pages/MyPetsPage";
import NotificationsPage from "./pages/NotificationsPage";
import ScreeningPage from "./pages/ScreeningPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="adoption" element={<AdoptionPage />} />
          <Route path="matching" element={<MatchingPage />} />
          <Route path="appointments" element={<AppointmentsPage />} />
          <Route path="my-pets" element={<MyPetsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="adoption-status" element={<ScreeningPage />} />
          <Route path="*" element={<DashboardPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
