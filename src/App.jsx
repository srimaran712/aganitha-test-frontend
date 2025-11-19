
import './App.css'
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Stats from "./pages/Stats";
import Health from "./pages/Health";
import Redirect from "./pages/Redirect";
import NotFound from "./pages/NotFound";

function App() {
  return (
     <TooltipProvider>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/code/:code" element={<Stats />} />
        <Route path="/healthz" element={<Health />} />
        <Route path="/:code" element={<Redirect />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </TooltipProvider>
  )
}

export default App
