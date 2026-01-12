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
      <div className="flex h-screen bg-[#f8f8f8] overflow-hidden">
        <DashboardSidebar />
        
        <div className="flex flex-1 overflow-hidden">
          <OperacoesFilterSidebar 
            showAtividade={showAtividade} 
            showTipoProduto={showTipoProduto} 
          />
          
          <div className="flex-1 flex flex-col overflow-hidden min-h-0">
            <OperacoesHeader />
            
            {/* Title Bar */}
            <div className="flex items-center justify-between px-3 py-1 flex-shrink-0">
              <div className="flex-1">
                <div className="bg-gradient-to-r from-[#f5e6d3] via-[#f5e6d3]/50 to-transparent py-1.5 px-4 rounded inline-block">
                  <h1 className="text-[#8B1538] font-light text-base tracking-[0.25em]">{title}</h1>
                </div>
              </div>
              
              {showAreaExecucao && (
                <div className="flex gap-3 ml-4">
                  <div className="border border-gray-300 rounded px-3 py-1 text-xs bg-white">
                    <span className="text-gray-600">Área (ha):</span>
                    <span className="font-bold ml-2">{areaHa}</span>
                  </div>
                  <div className="border border-gray-300 rounded px-3 py-1 text-xs bg-white">
                    <span className="text-gray-600">% Execução:</span>
                    <span className="font-bold ml-2">{percentExecucao}%</span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Content - flex-1 with min-h-0 to allow shrinking */}
            <div className="flex-1 min-h-0 overflow-hidden p-3">
              {children}
            </div>
          </div>
        </div>
      </div>
    </OperacoesFilterProvider>
  );
};
