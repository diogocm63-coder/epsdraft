import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Package, 
  TrendingUp, 
  Grape, 
  Wine, 
  Calendar 
} from 'lucide-react';

const menuItems = [
  { title: 'Decisão', path: '/decisao', icon: LayoutDashboard },
  { title: 'Stocks Iniciais', path: '/decisao/stocks-iniciais', icon: Package },
  { title: 'Previsão de Vendima', path: '/decisao/previsao-vendima', icon: TrendingUp },
  { title: 'Plano de Engarrafamento', path: '/decisao/plano-engarrafamento', icon: Package },
  { title: 'Compra de Uva', path: '/decisao/compra-uva', icon: Grape },
  { title: 'Compra de Vinho', path: '/decisao/compra-vinho', icon: Wine },
  { title: 'Data de Mudança de Colheita', path: '/decisao/mudanca-colheita', icon: Calendar },
];

export function DecisaoSidebar() {
  const location = useLocation();

  return (
    <Sidebar className="border-r-0 bg-eps-primary w-56" collapsible="none">
      <SidebarHeader className="p-0">
        <div className="px-4 py-3 text-white font-semibold text-base bg-[#6a0f2a]">
          Módulo Decisão
        </div>
      </SidebarHeader>
      
      <SidebarContent className="bg-eps-primary px-0">
        <SidebarMenu className="gap-0">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const IconComponent = item.icon;
            
            return (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton asChild>
                  <NavLink
                    to={item.path}
                    className={cn(
                      'pl-4 pr-3 py-2.5 text-sm hover:bg-white/10 transition-colors flex items-center gap-3 w-full',
                      isActive ? 'bg-white/20 text-white font-medium' : 'text-white/90'
                    )}
                  >
                    <IconComponent className="w-4 h-4 flex-shrink-0" />
                    <span>{item.title}</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
