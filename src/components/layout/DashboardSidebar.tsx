import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Store,
  ChevronLeft,
  ClipboardList,
  DollarSign,
  Users2,
  ListTodo,
  BarChart3,
  PieChart,
  Clock,
  Package,
  Grape,
} from "lucide-react";
import { useState } from "react";

const mainNavItems: { path: string; label: string; subtitle?: string; icon: any }[] = [];

const operacoesNavItems = [
  { path: "/operacoes/painel-geral", label: "Painel Geral", icon: ClipboardList },
  { path: "/operacoes/controlo-producao", label: "Controlo da Produção", icon: Grape },
  { path: "/operacoes/analise-custos", label: "Análise de Custos", icon: DollarSign },
  { path: "/operacoes/mao-de-obra", label: "Mão de Obra", icon: Users2 },
  { path: "/operacoes/gestao-atividades", label: "Gestão de Atividades", icon: ListTodo },
  { path: "/operacoes/kpis", label: "Indicadores (KPIs)", icon: BarChart3 },
  { path: "/operacoes/controlo-orcamental", label: "Controlo Orçamental", icon: PieChart },
  { path: "/operacoes/orcamentacao-horas", label: "Orçamentação de Horas", icon: Clock },
  { path: "/operacoes/orcamentacao-produtos", label: "Orçamentação de Produtos", icon: Package },
];

export const DashboardSidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const renderNavItem = (item: { path: string; label: string; subtitle?: string; icon: any }, showSubtitle = true) => {
    const isActive = location.pathname === item.path;
    const Icon = item.icon;

    return (
      <NavLink
        key={item.path}
        to={item.path}
        className={`
          flex items-center gap-3 mx-2 px-3 py-2 rounded-lg transition-all duration-200 mb-1
          ${
            isActive
              ? "bg-sidebar-primary text-sidebar-primary-foreground"
              : "text-sidebar-foreground hover:bg-sidebar-accent"
          }
        `}
      >
        <Icon className="h-4 w-4 flex-shrink-0" />
        {!collapsed && (
          <div className="flex flex-col">
            <span className="text-xs font-medium">{item.label}</span>
            {showSubtitle && item.subtitle && (
              <span
                className={`text-[10px] ${isActive ? "text-sidebar-primary-foreground/70" : "text-sidebar-foreground/60"}`}
              >
                {item.subtitle}
              </span>
            )}
          </div>
        )}
      </NavLink>
    );
  };

  return (
    <aside
      className={`${collapsed ? "w-14" : "w-52"} min-h-screen bg-sidebar flex flex-col transition-all duration-300`}
    >
      {/* Navigation */}
      <nav className="flex-1 py-3 overflow-y-auto">
        {/* Main Nav Items */}
        {mainNavItems.map((item) => renderNavItem(item))}

        {/* Operações Separator */}
        {!collapsed && (
          <div className="mx-2 mt-4 mb-2 px-3">
            <span className="text-[10px] font-semibold text-sidebar-foreground/50 uppercase tracking-wider">
              Operações
            </span>
          </div>
        )}
        {collapsed && <div className="border-t border-sidebar-border mx-2 my-3" />}

        {/* Operações Nav Items */}
        {operacoesNavItems.map((item) => renderNavItem(item, false))}
      </nav>

      {/* Collapse button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center gap-2 mx-2 mb-4 px-3 py-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
      >
        <ChevronLeft className={`h-4 w-4 transition-transform ${collapsed ? "rotate-180" : ""}`} />
        {!collapsed && <span className="text-xs">Recolher</span>}
      </button>
    </aside>
  );
};
