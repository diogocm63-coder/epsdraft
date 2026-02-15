import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FilterProvider } from "@/contexts/FilterContext";
import StartPage from "./pages/StartPage";
import ProducaoProcuraPage from "./pages/ProducaoProcuraPage";
import FlexbudgetPage from "./pages/FlexbudgetPage";
import LojasPage from "./pages/LojasPage";
import NotFound from "./pages/NotFound";
import ExecutivoPage from "./pages/ExecutivoPage";
import ControloPage from "./pages/ControloPage";
import DecisaoPage from "./pages/DecisaoPage";

// Decisão Pages
import StocksIniciaisPage from "./pages/decisao/StocksIniciaisPage";
import PrevisaoVendimaPage from "./pages/decisao/PrevisaoVendimaPage";
import CompraUvaPage from "./pages/decisao/CompraUvaPage";
import CompraVinhoPage from "./pages/decisao/CompraVinhoPage";
import MudancaColheitaPage from "./pages/decisao/MudancaColheitaPage";
import PlanoEngarrafamentoPage from "./pages/decisao/PlanoEngarrafamentoPage";
import AvaliacaoNecessidadesPage from "./pages/decisao/AvaliacaoNecessidadesPage";
import OrcamentoLoteamentoPage from "./pages/decisao/OrcamentoLoteamentoPage";

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

// Flexbudget Pages
import VisaoGeralVendasPage from "./pages/flexbudget/VisaoGeralVendasPage";
import HistoricoVendasPage from "./pages/flexbudget/HistoricoVendasPage";
import ArtigosPage from "./pages/flexbudget/ArtigosPage";
import ClientesPage from "./pages/flexbudget/ClientesPage";
import VolumesPage from "./pages/flexbudget/VolumesPage";
import PricingPage from "./pages/flexbudget/PricingPage";
import AjusteClientePage from "./pages/flexbudget/AjusteClientePage";
import InvestimentosVisaoGeralPage from "./pages/flexbudget/InvestimentosVisaoGeralPage";
import AtivacoesPage from "./pages/flexbudget/AtivacoesPage";
import OrcamentoCanalPage from "./pages/flexbudget/OrcamentoCanalPage";
import OrcamentoMarcaPage from "./pages/flexbudget/OrcamentoMarcaPage";
import DividasVisaoGeralPage from "./pages/flexbudget/DividasVisaoGeralPage";
import DividaClientesPage from "./pages/flexbudget/DividaClientesPage";
import DividaFornecedoresPage from "./pages/flexbudget/DividaFornecedoresPage";
import DemonstracaoResultadosPage from "./pages/flexbudget/DemonstracaoResultadosPage";
import AnaliseContasPage from "./pages/flexbudget/AnaliseContasPage";

// Configuração Pages
import PlaneamentoPortfolioPage from "./pages/configuracao/PlaneamentoPortfolioPage";
import PlaneamentoEnologicoPage from "./pages/configuracao/PlaneamentoEnologicoPage";
import SourcingMateriaPrimaPage from "./pages/configuracao/SourcingMateriaPrimaPage";
import TransformacaoAdegasPage from "./pages/configuracao/TransformacaoAdegasPage";

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
            <Route path="/executivo" element={<ExecutivoPage />} />
            <Route path="/controlo" element={<ControloPage />} />
            <Route path="/decisao" element={<DecisaoPage />} />
            <Route path="/decisao/stocks-iniciais" element={<StocksIniciaisPage />} />
            <Route path="/decisao/previsao-vendima" element={<PrevisaoVendimaPage />} />
            <Route path="/decisao/plano-engarrafamento" element={<PlanoEngarrafamentoPage />} />
            <Route path="/decisao/avaliacao-necessidades" element={<AvaliacaoNecessidadesPage />} />
            <Route path="/decisao/compra-uva" element={<CompraUvaPage />} />
            <Route path="/decisao/compra-vinho" element={<CompraVinhoPage />} />
            <Route path="/decisao/orcamento-loteamento" element={<OrcamentoLoteamentoPage />} />
            <Route path="/decisao/mudanca-colheita" element={<MudancaColheitaPage />} />
            <Route path="/producao-procura" element={<ProducaoProcuraPage />} />
            <Route path="/flexbudget" element={<FlexbudgetPage />} />
            
            {/* Flexbudget Sub-pages */}
            <Route path="/flexbudget/vendas/reporting/visao-geral" element={<VisaoGeralVendasPage />} />
            <Route path="/flexbudget/vendas/reporting/historico" element={<HistoricoVendasPage />} />
            <Route path="/flexbudget/vendas/reporting/artigos" element={<ArtigosPage />} />
            <Route path="/flexbudget/vendas/reporting/clientes" element={<ClientesPage />} />
            <Route path="/flexbudget/vendas/orcamento/volumes" element={<VolumesPage />} />
            <Route path="/flexbudget/vendas/orcamento/pricing" element={<PricingPage />} />
            <Route path="/flexbudget/vendas/orcamento/ajuste-cliente" element={<AjusteClientePage />} />
            
            {/* Investimentos */}
            <Route path="/flexbudget/investimentos/visao-geral" element={<InvestimentosVisaoGeralPage />} />
            <Route path="/flexbudget/investimentos/ativacoes" element={<AtivacoesPage />} />
            <Route path="/flexbudget/investimentos/orcamento-canal" element={<OrcamentoCanalPage />} />
            <Route path="/flexbudget/investimentos/orcamento-marca" element={<OrcamentoMarcaPage />} />
            
            {/* Dívidas */}
            <Route path="/flexbudget/dividas/vista-geral" element={<DividasVisaoGeralPage />} />
            <Route path="/flexbudget/dividas/clientes" element={<DividaClientesPage />} />
            <Route path="/flexbudget/dividas/fornecedores" element={<DividaFornecedoresPage />} />
            
            {/* Demonstração de Resultados */}
            <Route path="/flexbudget/demonstracao/resultados" element={<DemonstracaoResultadosPage />} />
            <Route path="/flexbudget/demonstracao/analise-contas" element={<AnaliseContasPage />} />
            
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
            
            {/* Configuração */}
            <Route path="/configuracao/planeamento-portfolio" element={<PlaneamentoPortfolioPage />} />
            <Route path="/configuracao/planeamento-enologico" element={<PlaneamentoEnologicoPage />} />
            <Route path="/configuracao/sourcing-materia-prima" element={<SourcingMateriaPrimaPage />} />
            <Route path="/configuracao/transformacao-adegas" element={<TransformacaoAdegasPage />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </FilterProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
