import { useNavigate } from "react-router-dom";
import {
  Search,
  Package,
  RefreshCw,
  Sprout,
  LayoutGrid,
  Settings,
  Link,
} from "lucide-react";
import { cn } from "@/lib/utils";

const configSubItems = [
  { id: "procura", label: "Procura", icon: Search },
  { id: "produtizacao", label: "Produtização", icon: Package },
  { id: "transformacao", label: "Transformação", icon: RefreshCw },
  { id: "agricultura", label: "Agricultura", icon: Sprout },
];

const relationLinks = [
  { id: "planeamento-portfolio", label: "Planeamento de Portfólio", path: "/configuracao/planeamento-portfolio" },
  { id: "planeamento-enologico", label: "Planeamento Enológico", path: "/configuracao/planeamento-enologico" },
  { id: "sourcing-materia-prima", label: "Sourcing de Matéria-Prima", path: "/configuracao/sourcing-materia-prima" },
];

interface StartPageSidebarProps {
  activeTab: "gestao" | "configuracao";
  onTabChange: (tab: "gestao" | "configuracao") => void;
  activeConfigItem?: string;
  onConfigItemChange?: (id: string) => void;
}

export const StartPageSidebar = ({
  activeTab,
  onTabChange,
  activeConfigItem,
  onConfigItemChange,
}: StartPageSidebarProps) => {
  const navigate = useNavigate();

  return (
    <aside className="w-56 min-h-screen bg-eps-dark flex flex-col border-r border-eps-border">
      {/* Logo area */}
      <div className="px-4 py-5 border-b border-eps-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-eps-primary flex items-center justify-center">
            <span className="text-white text-sm font-serif font-bold">E</span>
          </div>
          <span className="text-white font-semibold text-sm">EPS</span>
        </div>
      </div>

      {/* Tabs */}
      <nav className="flex-1 py-3 overflow-y-auto">
        {/* Gestão da Informação */}
        <button
          onClick={() => onTabChange("gestao")}
          className={cn(
            "w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors",
            activeTab === "gestao"
              ? "bg-eps-primary/20 text-white border-r-2 border-eps-accent"
              : "text-white/60 hover:text-white hover:bg-white/5"
          )}
        >
          <LayoutGrid className="w-4 h-4 flex-shrink-0" />
          <span className="font-medium">Gestão da Informação</span>
        </button>

        {/* Configuração */}
        <button
          onClick={() => {
            onTabChange("configuracao");
            navigate("/configuracao");
          }}
          className={cn(
            "w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors",
            activeTab === "configuracao"
              ? "bg-eps-primary/20 text-white border-r-2 border-eps-accent"
              : "text-white/60 hover:text-white hover:bg-white/5"
          )}
        >
          <Settings className="w-4 h-4 flex-shrink-0" />
          <span className="font-medium">Configuração</span>
        </button>

        {/* Config Sub-items (visible when configuração is active) */}
        {activeTab === "configuracao" && (
          <div className="mt-1">
            {configSubItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeConfigItem === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onConfigItemChange?.(item.id);
                    if (item.id === "transformacao") {
                      navigate("/configuracao/transformacao-adegas");
                    } else {
                      navigate("/configuracao/planeamento-portfolio");
                    }
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 pl-8 pr-4 py-2 text-xs transition-colors",
                    isActive
                      ? "bg-eps-primary/15 text-eps-accent"
                      : "text-white/50 hover:text-white/80 hover:bg-white/5"
                  )}
                >
                  <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="flex-1 text-left">{item.label}</span>
                </button>
              );
            })}

            {/* Relation links */}
            <div className="mt-2 border-t border-eps-border/30 pt-2">
              <span className="pl-8 text-[10px] text-white/30 uppercase tracking-wider">Relações</span>
              {relationLinks.map((rel) => (
                <button
                  key={rel.id}
                  onClick={() => navigate(rel.path)}
                  className="w-full flex items-center gap-3 pl-8 pr-4 py-2 text-xs text-white/50 hover:text-white/80 hover:bg-white/5 transition-colors"
                >
                  <Link className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="flex-1 text-left">{rel.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>
    </aside>
  );
};