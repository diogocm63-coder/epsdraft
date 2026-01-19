import { useNavigate } from "react-router-dom";
import { ArrowLeft, Factory } from "lucide-react";
import { Button } from "@/components/ui/button";

const ProducaoProcuraPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <Factory className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">Produção e Procura</h1>
              <p className="text-sm text-muted-foreground">Gestão de produção e análise de procura</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-card rounded-lg border p-8 text-center">
          <p className="text-muted-foreground">Conteúdo da página Produção e Procura em desenvolvimento...</p>
        </div>
      </main>
    </div>
  );
};

export default ProducaoProcuraPage;