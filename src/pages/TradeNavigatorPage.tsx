import { EPSHeader } from "@/components/layout/EPSHeader";
import { Compass } from "lucide-react";

const TradeNavigatorPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-eps-background">
      <EPSHeader title="Trade Navigator" icon={<Compass className="w-4 h-4" />} />
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-eps-primary flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Compass className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-eps-primary mb-2">Trade Navigator</h1>
          <p className="text-muted-foreground">Conteúdo em desenvolvimento</p>
        </div>
      </main>
    </div>
  );
};

export default TradeNavigatorPage;
