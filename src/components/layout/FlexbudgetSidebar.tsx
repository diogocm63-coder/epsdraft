import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
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

interface MenuItemType {
  title: string;
  path?: string;
  children?: MenuItemType[];
}

const menuStructure: MenuItemType[] = [
  {
    title: 'Vendas',
    children: [
      {
        title: 'Reporting',
        children: [
          { title: 'Visão Geral', path: '/flexbudget/vendas/reporting/visao-geral' },
          { title: 'Histórico', path: '/flexbudget/vendas/reporting/historico' },
          { title: 'Artigos', path: '/flexbudget/vendas/reporting/artigos' },
          { title: 'Clientes', path: '/flexbudget/vendas/reporting/clientes' },
        ],
      },
      {
        title: 'Orçamento',
        children: [
          { title: 'Definição de Volumes', path: '/flexbudget/vendas/orcamento/volumes' },
          { title: 'Definição de Pricing', path: '/flexbudget/vendas/orcamento/pricing' },
          { title: 'Ajuste por Cliente', path: '/flexbudget/vendas/orcamento/ajuste-cliente' },
        ],
      },
    ],
  },
  {
    title: 'Investimentos',
    children: [
      { title: 'Visão Geral', path: '/flexbudget/investimentos/visao-geral' },
      { title: 'Ativações', path: '/flexbudget/investimentos/ativacoes' },
      { title: 'Orçamento por Canal', path: '/flexbudget/investimentos/orcamento-canal' },
      { title: 'Orçamento por Marca', path: '/flexbudget/investimentos/orcamento-marca' },
    ],
  },
  {
    title: 'Dívidas',
    children: [
      { title: 'Vista Geral', path: '/flexbudget/dividas/vista-geral' },
      { title: 'Dívida de Clientes', path: '/flexbudget/dividas/clientes' },
      { title: 'Dívida a Fornecedores', path: '/flexbudget/dividas/fornecedores' },
    ],
  },
  {
    title: 'Demonstração de Resultados',
    children: [
      { title: 'Demonstração de Resultados', path: '/flexbudget/demonstracao/resultados' },
      { title: 'Análise de Contas', path: '/flexbudget/demonstracao/analise-contas' },
    ],
  },
];

interface CollapsibleMenuItemProps {
  item: MenuItemType;
  level?: number;
  expandedItems: Record<string, boolean>;
  toggleItem: (title: string) => void;
}

const CollapsibleMenuItem = ({ item, level = 0, expandedItems, toggleItem }: CollapsibleMenuItemProps) => {
  const location = useLocation();
  const isExpanded = expandedItems[item.title] ?? true;
  const hasChildren = item.children && item.children.length > 0;
  
  const paddingLeft = level === 0 ? 'pl-4' : level === 1 ? 'pl-6' : 'pl-10';

  if (!hasChildren && item.path) {
    const isActive = location.pathname === item.path;
    return (
      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <NavLink
            to={item.path}
            className={cn(
              paddingLeft,
              'py-2 text-sm hover:bg-white/10 transition-colors block w-full',
              isActive ? 'bg-white/20 text-white font-medium' : 'text-white/90'
            )}
          >
            {item.title}
          </NavLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  return (
    <div>
      <button
        onClick={() => toggleItem(item.title)}
        className={cn(
          paddingLeft,
          'w-full flex items-center justify-between py-2 pr-3 text-sm font-medium hover:bg-white/10 transition-colors',
          level === 0 ? 'text-white' : 'text-white/90'
        )}
      >
        <span>{item.title}</span>
        {isExpanded ? (
          <ChevronDown className="w-4 h-4 text-white/70" />
        ) : (
          <ChevronRight className="w-4 h-4 text-white/70" />
        )}
      </button>
      {isExpanded && hasChildren && (
        <div>
          {item.children!.map((child) => (
            <CollapsibleMenuItem
              key={child.title}
              item={child}
              level={level + 1}
              expandedItems={expandedItems}
              toggleItem={toggleItem}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export function FlexbudgetSidebar() {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    'Vendas': true,
    'Reporting': true,
    'Orçamento': true,
    'Investimentos': true,
    'Dívidas': true,
    'Demonstração de Resultados': true,
  });

  const toggleItem = (title: string) => {
    setExpandedItems((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <Sidebar className="border-r-0 bg-[#2a7d8c]" collapsible="none">
      <SidebarHeader className="p-0">
        <NavLink
          to="/flexbudget"
          className="block px-4 py-3 text-white font-semibold text-base bg-[#1e5f6b] hover:bg-[#1a5560] transition-colors"
        >
          Dashboard
        </NavLink>
      </SidebarHeader>
      
      <SidebarContent className="bg-[#2a7d8c] px-0">
        <SidebarMenu className="gap-0">
          {menuStructure.map((item) => (
            <CollapsibleMenuItem
              key={item.title}
              item={item}
              expandedItems={expandedItems}
              toggleItem={toggleItem}
            />
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
