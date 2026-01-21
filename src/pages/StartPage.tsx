import { useNavigate } from "react-router-dom";
import { Briefcase, TrendingUp, BarChart3, Shield, Brain, ArrowRight } from "lucide-react";
const modules = [{
  id: "executivo",
  step: 1,
  title: "Executivo",
  description: "Visão Unificada do Negócio",
  icon: Briefcase,
  path: "/executivo"
}, {
  id: "flexbudget",
  step: 2,
  title: "Flexbudget",
  description: "Orçamentação flexível e previsões",
  icon: TrendingUp,
  path: "/flexbudget"
}, {
  id: "producao-procura",
  step: 3,
  title: "Produção e Procura",
  description: "Inteligência Preditiva: Alinhamento Perfeito Entre Produção e Procura",
  icon: BarChart3,
  path: "/producao-procura"
}, {
  id: "controlo",
  step: 4,
  title: "Controlo",
  description: "Controlo Correlacional: Intervenção Atempada e Estratégica",
  icon: Shield,
  path: "/controlo"
}, {
  id: "decisao",
  step: 5,
  title: "Decisão",
  description: "Suporte à Tomada de Decisão Estratégica",
  icon: Brain,
  path: "/decisao"
}];
const StartPage = () => {
  const navigate = useNavigate();
  return <div className="min-h-screen bg-gradient-to-b from-eps-background via-white to-eps-background flex flex-col items-center justify-center p-8">
      {/* Logo */}
      <div className="w-20 h-20 rounded-2xl bg-eps-primary flex items-center justify-center mb-6 shadow-lg">
        <span className="text-white text-3xl font-serif font-bold">E</span>
      </div>

      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-eps-primary mb-2 tracking-tight">Enterprise Planning Solution</h1>
        <div className="flex items-center justify-center gap-3">
          <div className="w-8 h-px bg-eps-muted"></div>
          <p className="text-eps-muted text-lg">EPS</p>
          <div className="w-8 h-px bg-eps-muted"></div>
        </div>
      </div>

      {/* Flow Process */}
      <div className="w-full max-w-6xl px-4">
        {/* Flow line background */}
        <div className="relative">
          {/* Connecting line */}
          <div className="absolute top-12 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-eps-primary/20 via-eps-primary/40 to-eps-primary/20 hidden lg:block" />
          
          {/* Module cards in flow */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-2">
            {modules.map((module, index) => {
            const Icon = module.icon;
            const isLast = index === modules.length - 1;
            return <div key={module.id} className="flex items-center gap-2 lg:gap-0">
                  {/* Module card */}
                  <button onClick={() => navigate(module.path)} className="group relative bg-white hover:bg-eps-background border border-gray-200 hover:border-eps-primary/30 rounded-2xl p-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col items-center text-center w-full lg:w-44 min-h-[180px]">
                    {/* Step number badge */}
                    
                    
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-full bg-eps-background group-hover:bg-eps-light flex items-center justify-center mt-2 mb-3 transition-colors">
                      <Icon className="w-6 h-6 text-eps-primary" />
                    </div>
                    
                    {/* Title */}
                    <h2 className="font-semibold text-gray-800 mb-1.5 text-xl">{module.title}</h2>
                    
                    {/* Description */}
                    <p className="text-xs text-gray-500 leading-relaxed flex-1 line-clamp-3">{module.description}</p>
                    
                    {/* Action */}
                    <span className="mt-2 text-eps-primary text-xs font-medium flex items-center gap-1 group-hover:gap-2 transition-all opacity-0 group-hover:opacity-100">
                      Aceder <ArrowRight className="w-3 h-3" />
                    </span>
                  </button>
                  
                  {/* Arrow connector (hidden on last item and on mobile) */}
                  {!isLast && <div className="hidden lg:flex items-center justify-center w-8 text-eps-primary/40">
                      <ArrowRight className="w-5 h-5" />
                    </div>}
                  
                  {/* Vertical arrow for mobile */}
                  {!isLast && <div className="lg:hidden flex items-center justify-center h-6 text-eps-primary/40 rotate-90">
                      <ArrowRight className="w-5 h-5" />
                    </div>}
                </div>;
          })}
          </div>
        </div>
        
        {/* Flow label */}
        <div className="flex items-center justify-center mt-8">
          
        </div>
      </div>
    </div>;
};
export default StartPage;