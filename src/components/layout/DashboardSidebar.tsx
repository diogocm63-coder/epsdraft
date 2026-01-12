import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Store, ChevronLeft } from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { path: '/', label: 'Visão 360º', subtitle: 'Resumo geral', icon: LayoutDashboard },
  { path: '/consultores', label: 'Consultores', subtitle: 'Gestão de consultores', icon: Users },
  { path: '/lojas', label: 'Lojas', subtitle: 'Gestão de lojas', icon: Store },
];

export const DashboardSidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`${collapsed ? 'w-16' : 'w-56'} min-h-screen bg-sidebar flex flex-col transition-all duration-300`}>
      {/* Navigation */}
      <nav className="flex-1 py-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`
                flex items-center gap-3 mx-2 px-3 py-3 rounded-lg transition-all duration-200 mb-1
                ${isActive 
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground' 
                  : 'text-sidebar-foreground hover:bg-sidebar-accent'
                }
              `}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && (
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{item.label}</span>
                  <span className={`text-xs ${isActive ? 'text-sidebar-primary-foreground/70' : 'text-sidebar-foreground/60'}`}>
                    {item.subtitle}
                  </span>
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Collapse button */}
      <button 
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center gap-2 mx-2 mb-4 px-3 py-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
      >
        <ChevronLeft className={`h-4 w-4 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
        {!collapsed && <span className="text-sm">Recolher</span>}
      </button>
    </aside>
  );
};
