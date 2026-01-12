import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Store } from 'lucide-react';

const navItems = [
  { path: '/', label: 'Gestão', icon: LayoutDashboard },
  { path: '/consultores', label: 'Consultores', icon: Users },
  { path: '/lojas', label: 'Lojas', icon: Store },
];

export const DashboardSidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-16 min-h-screen bg-sidebar flex flex-col items-center py-4 border-r border-sidebar-border">
      <nav className="flex flex-col gap-2 mt-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`
                flex flex-col items-center justify-center w-12 h-12 rounded-lg transition-all duration-200
                ${isActive 
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground' 
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                }
              `}
              title={item.label}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[9px] mt-1 font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};
