import { DecisaoLayout } from '@/components/decisao/DecisaoLayout';
import { TrendingUp } from 'lucide-react';

const PrevisaoVendimaPage = () => {
  return (
    <DecisaoLayout title="Decisão" icon="D">
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-eps-primary/10 flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-eps-primary" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Previsão de Vendima</h1>
          <p className="text-gray-500">Análise e previsão da produção de vendima</p>
        </div>
      </div>
    </DecisaoLayout>
  );
};

export default PrevisaoVendimaPage;
