import { ReactNode } from 'react';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';
import { OperacoesFilterSidebar } from './OperacoesFilterSidebar';
import { EPSHeader } from '@/components/layout/EPSHeader';
import { OperacoesFilterProvider } from '@/contexts/OperacoesFilterContext';
import { areaHa, percentExecucao } from '@/data/operacoesData';
import { Settings } from 'lucide-react';
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
  return <OperacoesFilterProvider>
      <div className="flex h-screen bg-[#f8f8f8] overflow-hidden">
        <DashboardSidebar />
        
        <div className="flex flex-1 flex-col overflow-hidden">
          <EPSHeader title="Operações" icon={<Settings className="w-4 h-4" />} />
          
          <div className="flex flex-1 overflow-hidden">
            <OperacoesFilterSidebar showAtividade={showAtividade} showTipoProduto={showTipoProduto} />
            
            <div className="flex-1 flex flex-col overflow-hidden min-h-0">
              {/* Title Bar */}
              <div className="flex items-center justify-between px-3 py-1 flex-shrink-0">
              <div className="flex-1">
                
              </div>
              
              {showAreaExecucao && <div className="flex gap-3 ml-4">
                  <div className="border border-gray-300 rounded px-3 py-1 text-xs bg-white">
                    <span className="text-gray-600">Área (ha):</span>
                    <span className="font-bold ml-2">{areaHa}</span>
                  </div>
                  <div className="border border-gray-300 rounded px-3 py-1 text-xs bg-white">
                    <span className="text-gray-600">% Execução:</span>
                    <span className="font-bold ml-2">{percentExecucao}%</span>
                  </div>
                </div>}
            </div>
            
              {/* Content - flex-1 with min-h-0 to allow shrinking */}
              <div className="flex-1 min-h-0 overflow-hidden p-3">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </OperacoesFilterProvider>;
};