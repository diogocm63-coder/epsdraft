import { ReactNode } from 'react';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';
import { OperacoesFilterSidebar } from './OperacoesFilterSidebar';
import { EPSHeader } from '@/components/layout/EPSHeader';
import { OperacoesFilterProvider } from '@/contexts/OperacoesFilterContext';
import { Settings } from 'lucide-react';

interface OperacoesLayoutProps {
  children: ReactNode;
  title: string;
  showAtividade?: boolean;
  showTipoProduto?: boolean;
}
export const OperacoesLayout = ({
  children,
  title,
  showAtividade = false,
  showTipoProduto = false
}: OperacoesLayoutProps) => {
  return <OperacoesFilterProvider>
      <div className="flex h-screen bg-[#f8f8f8] overflow-hidden">
        <DashboardSidebar />
        
        <div className="flex flex-1 flex-col overflow-hidden">
          <EPSHeader title="Operações" icon={<Settings className="w-4 h-4" />} />
          
          <div className="flex flex-1 overflow-hidden">
            <OperacoesFilterSidebar showAtividade={showAtividade} showTipoProduto={showTipoProduto} />
            
            <div className="flex-1 flex flex-col overflow-hidden min-h-0">
            
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