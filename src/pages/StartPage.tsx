import { useNavigate } from "react-router-dom";
import { 
  BarChart3, 
  Wallet, 
  Factory, 
  Shield, 
  Lightbulb 
} from "lucide-react";

const menuItems = [
  {
    title: "Executivo",
    description: "Visão executiva e indicadores estratégicos",
    icon: BarChart3,
    path: "/executivo",
  },
  {
    title: "Flexbudget",
    description: "Orçamentação flexível e cenários",
    icon: Wallet,
    path: "/flexbudget",
  },
  {
    title: "Produção e Procura",
    description: "Gestão de produção e análise de procura",
    icon: Factory,
    path: "/producao-procura",
  },
  {
    title: "Controlo",
    description: "Controlo operacional e monitorização",
    icon: Shield,
    path: "/controlo",
  },
  {
    title: "Decisão",
    description: "Apoio à decisão e análise avançada",
    icon: Lightbulb,
    path: "/decisao",
  },
];

const StartPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex flex-col">
      {/* Header */}
      <header className="py-8 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-lg">
              <span className="text-primary-foreground font-bold text-xl">E</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground tracking-tight">
                Enterprise Planning Solution
              </h1>
              <p className="text-muted-foreground text-sm">EPS - Sistema Integrado de Planeamento Empresarial</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-8 pb-12">
        <div className="max-w-6xl w-full">
          <div className="grid grid-cols-5 gap-6">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className="eps-button group"
                >
                  <div className="relative z-10 flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-primary-foreground/10 flex items-center justify-center 
                                  group-hover:bg-primary-foreground/20 transition-colors duration-300">
                      <Icon className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-primary-foreground mb-1">
                        {item.title}
                      </h3>
                      <p className="text-xs text-primary-foreground/70 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 px-8 border-t border-border/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            © 2026 Enterprise Planning Solution
          </p>
          <p className="text-xs text-muted-foreground/60">
            v1.0.0
          </p>
        </div>
      </footer>
    </div>
  );
};

export default StartPage;