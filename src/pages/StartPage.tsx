import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  TrendingUp,
  BarChart3,
  Shield,
  Brain,
  ArrowRight,
  Search,
  Package,
  RefreshCw,
  Sprout,
  Link,
} from "lucide-react";
import { StartPageSidebar } from "@/components/layout/StartPageSidebar";

const modules = [
  {
    id: "executivo",
    step: 1,
    title: "Executivo",
    description: "Visão Unificada do Negócio",
    icon: Briefcase,
    path: "/executivo",
  },
  {
    id: "flexbudget",
    step: 2,
    title: "Flexbudget",
    description: "Orçamentação flexível e previsões",
    icon: TrendingUp,
    path: "/flexbudget",
  },
  {
    id: "producao-procura",
    step: 3,
    title: "Produção e Procura",
    description: "Inteligência Preditiva: Alinhamento entre Produção e Procura",
    icon: BarChart3,
    path: "/producao-procura",
  },
  {
    id: "controlo",
    step: 4,
    title: "Controlo",
    description: "Controlo Correlacional: Intervenção Atempada e Estratégica",
    icon: Shield,
    path: "/controlo",
  },
  {
    id: "decisao",
    step: 5,
    title: "Decisão",
    description: "Suporte à Tomada de Decisão Estratégica",
    icon: Brain,
    path: "/decisao",
  },
];

const configItems = [
  { id: "procura", label: "Procura", icon: Search },
  { id: "produtizacao", label: "Produtização", icon: Package },
  { id: "transformacao", label: "Transformação", icon: RefreshCw },
  { id: "agricultura", label: "Agricultura", icon: Sprout },
];

const relationItems = [
  { id: "planeamento-portfolio", label: "Planeamento de Portfólio", path: "/configuracao/planeamento-portfolio" },
  { id: "planeamento-enologico", label: "Planeamento Enológico", path: "/configuracao/planeamento-enologico" },
  { id: "sourcing-materia-prima", label: "Sourcing de Matéria-Prima", path: "/configuracao/sourcing-materia-prima" },
];

const StartPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"gestao" | "configuracao">("gestao");
  const [activeConfigItem, setActiveConfigItem] = useState<string>("procura");

  return (
    <div className="min-h-screen flex w-full bg-eps-background">
      <StartPageSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        activeConfigItem={activeConfigItem}
        onConfigItemChange={setActiveConfigItem}
      />

      <main className="flex-1 flex flex-col items-center justify-center p-8 overflow-y-auto">
        {activeTab === "gestao" ? (
          <>
            {/* Logo */}
            <div className="w-20 h-20 rounded-2xl bg-eps-primary flex items-center justify-center mb-6 shadow-lg">
              <span className="text-white text-3xl font-serif font-bold">E</span>
            </div>

            {/* Header */}
            <div className="text-center mb-16">
              <h1 className="text-4xl font-bold text-eps-primary mb-2 tracking-tight">
                Enterprise Planning Solution
              </h1>
              <div className="flex items-center justify-center gap-3">
                <div className="w-8 h-px bg-eps-muted"></div>
                <p className="text-eps-muted text-lg">EPS</p>
                <div className="w-8 h-px bg-eps-muted"></div>
              </div>
            </div>

            {/* Flow Process */}
            <div className="w-full max-w-6xl px-4">
              <div className="relative">
                <div className="absolute top-12 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-eps-primary/20 via-eps-primary/40 to-eps-primary/20 hidden lg:block" />
                <div className="flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-2">
                  {modules.map((module, index) => {
                    const Icon = module.icon;
                    const isLast = index === modules.length - 1;
                    return (
                      <div key={module.id} className="flex items-center gap-2 lg:gap-0">
                        <button
                          onClick={() => navigate(module.path)}
                          className="group relative bg-white hover:bg-eps-background border border-border hover:border-eps-primary/30 rounded-2xl p-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col items-center text-center w-full lg:w-44 min-h-[180px]"
                        >
                          <div className="w-12 h-12 rounded-full bg-eps-background group-hover:bg-eps-light flex items-center justify-center mt-2 mb-3 transition-colors">
                            <Icon className="w-6 h-6 text-eps-primary" />
                          </div>
                          <h2 className="font-semibold text-foreground mb-1.5 text-xl">
                            {module.title}
                          </h2>
                          <p className="text-xs text-muted-foreground leading-relaxed flex-1 line-clamp-3">
                            {module.description}
                          </p>
                          <span className="mt-2 text-eps-primary text-xs font-medium flex items-center gap-1 group-hover:gap-2 transition-all opacity-0 group-hover:opacity-100">
                            Aceder <ArrowRight className="w-3 h-3" />
                          </span>
                        </button>
                        {!isLast && (
                          <div className="hidden lg:flex items-center justify-center w-8 text-eps-primary/40">
                            <ArrowRight className="w-5 h-5" />
                          </div>
                        )}
                        {!isLast && (
                          <div className="lg:hidden flex items-center justify-center h-6 text-eps-primary/40 rotate-90">
                            <ArrowRight className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Configuração Content */
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
                        navigate("/configuracao/planeamento-portfolio");
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

            {/* Placeholder content area */}
            <div className="mt-10 bg-white rounded-2xl border border-border p-8 min-h-[300px] flex items-center justify-center">
              <p className="text-muted-foreground text-sm">
                Configuração de{" "}
                <span className="font-semibold text-eps-primary">
                  {configItems.find((i) => i.id === activeConfigItem)?.label}
                </span>{" "}
                — conteúdo em desenvolvimento
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default StartPage;
