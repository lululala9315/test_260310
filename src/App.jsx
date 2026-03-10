import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ContentProvider } from "./context/ContentContext";
import LandingPage from "./pages/LandingPage";
import AdminPage from "./components/admin/AdminPage";

export default function App() {
  return (
    <ContentProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </BrowserRouter>
    </ContentProvider>
  );
}
