import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FilterProvider } from "@/contexts/FilterContext";
import StartPage from "./pages/StartPage";
import GestaoPage from "./pages/GestaoPage";
import ConsultoresPage from "./pages/ConsultoresPage";
import LojasPage from "./pages/LojasPage";
import NotFound from "./pages/NotFound";

// Operações Pages
import PainelGeralPage from "./pages/operacoes/PainelGeralPage";
import ControloProducaoPage from "./pages/operacoes/ControloProducaoPage";
import AnaliseCustosPage from "./pages/operacoes/AnaliseCustosPage";
import MaoDeObraPage from "./pages/operacoes/MaoDeObraPage";
import GestaoAtividadesPage from "./pages/operacoes/GestaoAtividadesPage";
import IndicadoresKPIsPage from "./pages/operacoes/IndicadoresKPIsPage";
import ControloOrcamentalPage from "./pages/operacoes/ControloOrcamentalPage";
import OrcamentacaoHorasPage from "./pages/operacoes/OrcamentacaoHorasPage";
import OrcamentacaoProdutosPage from "./pages/operacoes/OrcamentacaoProdutosPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <FilterProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<StartPage />} />
            <Route path="/gestao" element={<GestaoPage />} />
            <Route path="/consultores" element={<ConsultoresPage />} />
            <Route path="/lojas" element={<LojasPage />} />
            
            {/* Operações */}
            <Route path="/operacoes/painel-geral" element={<PainelGeralPage />} />
            <Route path="/operacoes/controlo-producao" element={<ControloProducaoPage />} />
            <Route path="/operacoes/analise-custos" element={<AnaliseCustosPage />} />
            <Route path="/operacoes/mao-de-obra" element={<MaoDeObraPage />} />
            <Route path="/operacoes/gestao-atividades" element={<GestaoAtividadesPage />} />
            <Route path="/operacoes/kpis" element={<IndicadoresKPIsPage />} />
            <Route path="/operacoes/controlo-orcamental" element={<ControloOrcamentalPage />} />
            <Route path="/operacoes/orcamentacao-horas" element={<OrcamentacaoHorasPage />} />
            <Route path="/operacoes/orcamentacao-produtos" element={<OrcamentacaoProdutosPage />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </FilterProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
