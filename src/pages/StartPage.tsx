import { useNavigate } from "react-router-dom";
import { Briefcase, TrendingUp, BarChart3, Shield, Brain } from "lucide-react";

const modules = [
  {
    id: "executivo",
    title: "Executivo",
    description: "Visão estratégica e indicadores chave",
    icon: Briefcase,
    path: "/executivo",
  },
  {
    id: "flexbudget",
    title: "Flexbudget",
    description: "Orçamentação flexível e previsões",
    icon: TrendingUp,
    path: "/flexbudget",
  },
  {
    id: "producao-procura",
    title: "Produção e Procura",
    description: "Gestão operacional integrada",
    icon: BarChart3,
    path: "/producao-procura",
  },
  {
    id: "controlo",
    title: "Controlo",
    description: "Monitorização e análise de desvios",
    icon: Shield,
    path: "/controlo",
  },
  {
    id: "decisao",
    title: "Decisão",
    description: "Suporte à tomada de decisão",
    icon: Brain,
    path: "/decisao",
  },
];

const StartPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-eps-background via-white to-eps-background flex flex-col items-center justify-center p-8">
      {/* Logo */}
      <div className="w-20 h-20 rounded-2xl bg-eps-primary flex items-center justify-center mb-6 shadow-lg">
        <span className="text-white text-3xl font-serif font-bold">E</span>
      </div>

      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-eps-primary mb-2 tracking-tight">
          Enterprise Planning Solution
        </h1>
        <div className="flex items-center justify-center gap-3">
          <div className="w-8 h-px bg-eps-muted"></div>
          <p className="text-eps-muted text-lg">EPS</p>
          <div className="w-8 h-px bg-eps-muted"></div>
        </div>
      </div>

      {/* Module Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl w-full px-4">
        {modules.map((module) => {
          const Icon = module.icon;
          return (
            <button
              key={module.id}
              onClick={() => navigate(module.path)}
              className="group bg-white hover:bg-white border border-gray-100 rounded-xl p-6 transition-all duration-300 hover:shadow-xl flex flex-col items-center text-center min-h-[200px]"
            >
              <div className="w-14 h-14 rounded-full bg-eps-background flex items-center justify-center mb-4 group-hover:bg-eps-light transition-colors">
                <Icon className="w-7 h-7 text-eps-primary" />
              </div>
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                {module.title}
              </h2>
              <p className="text-sm text-gray-500 leading-relaxed mb-4 flex-1">
                {module.description}
              </p>
              <span className="text-eps-primary text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                Aceder <span className="text-lg">→</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-16 text-gray-500 text-sm">
        Soluções integradas para gestão empresarial de excelência
      </div>
    </div>
  );
};

export default StartPage;
