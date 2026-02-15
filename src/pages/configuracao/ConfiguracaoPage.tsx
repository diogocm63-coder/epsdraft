import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Package,
  RefreshCw,
  Sprout,
  Link,
} from "lucide-react";
import { StartPageSidebar } from "@/components/layout/StartPageSidebar";
import { EPSHeader } from "@/components/layout/EPSHeader";
import { Settings } from "lucide-react";

const configItems = [
  { id: "procura", label: "Procura", icon: Search, path: "/configuracao/planeamento-portfolio" },
  { id: "produtizacao", label: "Produtização", icon: Package, path: "/configuracao/planeamento-portfolio" },
  { id: "transformacao", label: "Transformação", icon: RefreshCw, path: "/configuracao/transformacao-adegas" },
  { id: "agricultura", label: "Agricultura", icon: Sprout, path: "/configuracao/planeamento-portfolio" },
];

const relationItems = [
  { id: "planeamento-portfolio", label: "Planeamento de Portfólio", path: "/configuracao/planeamento-portfolio" },
  { id: "planeamento-enologico", label: "Planeamento Enológico", path: "/configuracao/planeamento-enologico" },
  { id: "sourcing-materia-prima", label: "Sourcing de Matéria-Prima", path: "/configuracao/sourcing-materia-prima" },
];

const ConfiguracaoPage = () => {
  const navigate = useNavigate();
  const [activeConfigItem, setActiveConfigItem] = useState<string>("procura");

  return (
    <div className="min-h-screen flex w-full bg-eps-background">
      <StartPageSidebar
        activeTab="configuracao"
        onTabChange={() => navigate("/")}
        activeConfigItem={activeConfigItem}
        onConfigItemChange={setActiveConfigItem}
      />
      <div className="flex-1 flex flex-col min-h-screen">
        <EPSHeader title="Configuração" icon={<Settings className="w-4 h-4" />} />
        <main className="flex-1 flex flex-col items-center justify-center p-8 overflow-y-auto">
          <div className="w-full max-w-5xl">
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold text-eps-primary mb-2 tracking-tight">
                Configuração
              </h1>
              <p className="text-muted-foreground">
                Configure os parâmetros base do sistema
              </p>
            </div>

            {/* Config items in a row with relation buttons */}
            <div className="flex items-center justify-center gap-3">
              {configItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = activeConfigItem === item.id;
                const relation = index < relationItems.length ? relationItems[index] : null;
                return (
                  <div key={item.id} className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setActiveConfigItem(item.id);
                        navigate(item.path);
                      }}
                      className={`group flex flex-col items-center gap-3 p-6 rounded-2xl border transition-all duration-300 w-48 ${
                        isActive
                          ? "bg-eps-primary text-white border-eps-primary shadow-lg"
                          : "bg-white text-foreground border-border hover:border-eps-primary/30 hover:shadow-md hover:-translate-y-1"
                      }`}
                    >
                      <div
                        className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
                          isActive
                            ? "bg-white/20"
                            : "bg-eps-background group-hover:bg-eps-light"
                        }`}
                      >
                        <Icon
                          className={`w-7 h-7 ${
                            isActive ? "text-white" : "text-eps-primary"
                          }`}
                        />
                      </div>
                      <span className="font-semibold text-lg">{item.label}</span>
                    </button>
                    {relation && (
                      <button
                        onClick={() => navigate(relation.path)}
                        title={relation.label}
                        className="group flex flex-col items-center gap-1.5 p-2 rounded-xl border border-eps-primary/20 bg-white hover:bg-eps-primary hover:border-eps-primary transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
                      >
                        <Link className="w-5 h-5 text-eps-primary group-hover:text-white transition-colors" />
                        <span className="text-[9px] text-eps-primary group-hover:text-white font-medium leading-tight text-center max-w-[60px]">
                          {relation.label}
                        </span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ConfiguracaoPage;
