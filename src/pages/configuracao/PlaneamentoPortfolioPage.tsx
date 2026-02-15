import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Briefcase, Search, Package, ArrowRightLeft } from "lucide-react";
import { EPSHeader } from "@/components/layout/EPSHeader";
import { StartPageSidebar } from "@/components/layout/StartPageSidebar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { portfolioMercados, produtoMercadoAssociations, type PortfolioMercado, type ProdutoMercadoAssoc } from "@/data/portfolioData";
import { ProcuraView } from "@/components/portfolio/ProcuraView";
import { ProdutizacaoView } from "@/components/portfolio/ProdutizacaoView";
import { PortfolioView } from "@/components/portfolio/PortfolioView";

const PlaneamentoPortfolioPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");
  const defaultTab = tabParam === "procura" ? "procura" : tabParam === "portfolio" ? "portfolio" : "produtizacao";
  const [mercadosState, setMercadosState] = useState<PortfolioMercado[]>(portfolioMercados);
  const [assocState, setAssocState] = useState<ProdutoMercadoAssoc[]>(produtoMercadoAssociations);

  const updateMercado = (mercado: string, patch: Partial<PortfolioMercado>) => {
    setMercadosState(prev => prev.map(m => m.mercado === mercado ? { ...m, ...patch } : m));
  };

  return (
    <div className="min-h-screen flex w-full bg-eps-background">
      <StartPageSidebar
        activeTab="configuracao"
        onTabChange={() => navigate("/")}
        activeConfigItem="portfolio"
        onConfigItemChange={() => {}}
      />
      <div className="flex-1 flex flex-col min-h-screen">
        <EPSHeader title="Planeamento de Portfólio" icon={<Briefcase className="w-4 h-4" />} />
        <main className="flex-1 p-4 overflow-auto">
          <Tabs key={defaultTab} defaultValue={defaultTab} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="produtizacao" className="gap-1.5 text-xs">
                <Package className="w-3.5 h-3.5" /> Produtização
              </TabsTrigger>
              <TabsTrigger value="procura" className="gap-1.5 text-xs">
                <Search className="w-3.5 h-3.5" /> Procura
              </TabsTrigger>
              <TabsTrigger value="portfolio" className="gap-1.5 text-xs">
                <ArrowRightLeft className="w-3.5 h-3.5" /> Portfólio
              </TabsTrigger>
            </TabsList>

            <TabsContent value="produtizacao">
              <ProdutizacaoView associations={assocState} onUpdateAssociations={setAssocState} />
            </TabsContent>

            <TabsContent value="procura">
              <ProcuraView mercadosState={mercadosState} onUpdateMercado={updateMercado} />
            </TabsContent>

            <TabsContent value="portfolio">
              <PortfolioView />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default PlaneamentoPortfolioPage;
