import { ReactNode } from 'react';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';
import { OperacoesFilterSidebar } from './OperacoesFilterSidebar';
import { OperacoesHeader } from './OperacoesHeader';
import { OperacoesFilterProvider } from '@/contexts/OperacoesFilterContext';
import { areaHa, percentExecucao } from '@/data/operacoesData';

interface OperacoesLayoutProps {
  children: ReactNode;
  title: string;
  showAtividade?: boolean;
  showTipoProduto?: boolean;
  showAreaExecucao?: boolean;
}

export const OperacoesLayout = ({ 
  children, 
  title,
  showAtividade = false,
  showTipoProduto = false,
  showAreaExecucao = true
}: OperacoesLayoutProps) => {
  return (
    <OperacoesFilterProvider>
      <div className="flex h-screen bg-background overflow-hidden">
        <DashboardSidebar />
        
        <div className="flex flex-1 overflow-hidden">
          <OperacoesFilterSidebar 
            showAtividade={showAtividade} 
            showTipoProduto={showTipoProduto} 
          />
          
          <div className="flex-1 flex flex-col overflow-hidden">
            <OperacoesHeader />
            
            {/* Title Bar */}
            <div className="flex items-center justify-between px-4 py-2">
              <div className="flex-1">
                <div className="bg-gradient-to-r from-[#f5e6d3] to-transparent py-2 px-4 rounded">
                  <h1 className="text-[#8B1538] font-light text-lg tracking-[0.3em]">{title}</h1>
                </div>
              </div>
              
              {showAreaExecucao && (
                <div className="flex gap-4 ml-4">
                  <div className="border rounded px-3 py-1 text-sm">
                    <span className="text-gray-600">Área (ha):</span>
                    <span className="font-bold ml-2">{areaHa}</span>
                  </div>
                  <div className="border rounded px-3 py-1 text-sm">
                    <span className="text-gray-600">% Execução:</span>
                    <span className="font-bold ml-2">{percentExecucao}%</span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-auto p-4">
              {children}
            </div>
          </div>
        </div>
      </div>
    </OperacoesFilterProvider>
  );
};
