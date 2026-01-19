import { useNavigate } from "react-router-dom";
import { BarChart3, Calculator, Factory, Settings, Brain } from "lucide-react";

const modules = [
  {
    id: "executivo",
    title: "Executivo",
    description: "Visão estratégica e indicadores de alto nível",
    icon: BarChart3,
    path: "/executivo",
  },
  {
    id: "flexbudget",
    title: "Flexbudget",
    description: "Orçamentação flexível e cenários",
    icon: Calculator,
    path: "/flexbudget",
  },
  {
    id: "producao-procura",
    title: "Produção e Procura",
    description: "Gestão de produção e análise de procura",
    icon: Factory,
    path: "/producao-procura",
  },
  {
    id: "controlo",
    title: "Controlo",
    description: "Controlo operacional e monitorização",
    icon: Settings,
    path: "/controlo",
  },
  {
    id: "decisao",
    title: "Decisão",
    description: "Apoio à decisão e análises avançadas",
    icon: Brain,
    path: "/decisao",
  },
];

const StartPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-eps-dark flex flex-col items-center justify-center p-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-white mb-3 tracking-tight">
          Enterprise Planning Solution
        </h1>
        <p className="text-eps-light text-xl font-light">EPS</p>
      </div>

      {/* Module Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl w-full">
        {modules.map((module) => {
          const Icon = module.icon;
          return (
            <button
              key={module.id}
              onClick={() => navigate(module.path)}
              className="group relative bg-eps-card hover:bg-eps-hover border border-eps-border rounded-xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-eps-glow/20 flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 rounded-full bg-eps-accent/20 flex items-center justify-center mb-4 group-hover:bg-eps-accent/30 transition-colors">
                <Icon className="w-8 h-8 text-eps-accent" />
              </div>
              <h2 className="text-lg font-semibold text-white mb-2">
                {module.title}
              </h2>
              <p className="text-sm text-eps-muted leading-relaxed">
                {module.description}
              </p>
              <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-eps-accent/50 transition-colors pointer-events-none" />
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-12 text-eps-muted text-sm">
        © 2026 Enterprise Planning Solution
      </div>
    </div>
  );
};

export default StartPage;
