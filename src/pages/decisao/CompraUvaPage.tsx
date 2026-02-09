import { DecisaoLayout } from '@/components/decisao/DecisaoLayout';
import { Grape } from 'lucide-react';

const CompraUvaPage = () => {
  return (
    <DecisaoLayout title="Decisão" icon="D">
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-eps-primary/10 flex items-center justify-center mx-auto mb-4">
            <Grape className="w-8 h-8 text-eps-primary" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Compra de Uva</h1>
          <p className="text-gray-500">Gestão de compras de uva a terceiros</p>
        </div>
      </div>
    </DecisaoLayout>
  );
};

export default CompraUvaPage;
