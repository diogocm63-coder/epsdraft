import { useNavigate, useLocation } from "react-router-dom";
import { Home } from "lucide-react";

const navItems = [
  { label: "Executivo", path: "/executivo" },
  { label: "Flexbudget", path: "/flexbudget" },
  { label: "Produção e Procura", path: "/producao-procura" },
  { label: "Controlo", path: "/controlo" },
  { label: "Decisão", path: "/decisao" },
];

interface EPSHeaderProps {
  title: string;
  icon: React.ReactNode;
}

export const EPSHeader = ({ title, icon }: EPSHeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-gray-600 hover:text-eps-primary transition-colors"
          >
            <Home className="w-4 h-4" />
            <span className="text-sm">Menu Inicial</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-eps-primary flex items-center justify-center text-white text-sm font-semibold">
              {icon}
            </div>
            <span className="font-semibold text-gray-800">{title}</span>
          </div>
        </div>
        <nav className="flex items-center gap-6">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`text-sm transition-colors ${
                location.pathname === item.path
                  ? "text-eps-primary font-medium"
                  : "text-gray-600 hover:text-eps-primary"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </header>
      <div className="h-1 bg-gradient-to-r from-eps-primary via-eps-gold to-eps-primary flex-shrink-0"></div>
    </>
  );
};
