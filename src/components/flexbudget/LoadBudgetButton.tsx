import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface LoadBudgetButtonProps {
  className?: string;
}

export const LoadBudgetButton = ({ className }: LoadBudgetButtonProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleClick = () => {
    setIsLoaded(true);
  };

  return (
    <Button 
      onClick={handleClick}
      className={cn(
        "text-white transition-colors",
        isLoaded 
          ? "bg-green-600 hover:bg-green-600" 
          : "bg-eps-primary hover:bg-eps-primary/90",
        className
      )}
    >
      {isLoaded && <Check className="w-4 h-4" />}
      {isLoaded ? "Budget Carregado" : "Carregar Budget a partir das Vendas"}
    </Button>
  );
};
