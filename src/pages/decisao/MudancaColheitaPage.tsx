import { DecisaoLayout } from '@/components/decisao/DecisaoLayout';
import { Calendar } from 'lucide-react';

const MudancaColheitaPage = () => {
  return (
    <DecisaoLayout title="Decisão" icon="D">
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-eps-primary/10 flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-eps-primary" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Data de Mudança de Colheita</h1>
          <p className="text-gray-500">Definição das datas de transição entre colheitas</p>
        </div>
      </div>
    </DecisaoLayout>
  );
};

export default MudancaColheitaPage;
