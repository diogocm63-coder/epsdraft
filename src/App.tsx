import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import StartPage from "./pages/StartPage";
import ExecutivoPage from "./pages/ExecutivoPage";
import FlexbudgetPage from "./pages/FlexbudgetPage";
import ProducaoProcuraPage from "./pages/ProducaoProcuraPage";
import ControloPage from "./pages/ControloPage";
import DecisaoPage from "./pages/DecisaoPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<StartPage />} />
          <Route path="/executivo" element={<ExecutivoPage />} />
          <Route path="/flexbudget" element={<FlexbudgetPage />} />
          <Route path="/producao-procura" element={<ProducaoProcuraPage />} />
          <Route path="/controlo" element={<ControloPage />} />
          <Route path="/decisao" element={<DecisaoPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;