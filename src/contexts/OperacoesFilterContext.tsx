import React, { createContext, useContext, useState, ReactNode } from 'react';

interface OperacoesFilterState {
  ano: number;
  mes: string;
  organizacao: string;
  espaco: string;
  local: string;
  atividade: string;
  tipoProduto: string;
  produto: string;
  variedade: string;
}

interface OperacoesFilterContextType {
  filters: OperacoesFilterState;
  setFilters: React.Dispatch<React.SetStateAction<OperacoesFilterState>>;
  resetFilters: () => void;
}

const defaultFilters: OperacoesFilterState = {
  ano: 2025,
  mes: "Tudo",
  organizacao: "Vine & Wine",
  espaco: "Tudo",
  local: "Tudo",
  atividade: "Tudo",
  tipoProduto: "Fertilizantes",
  produto: "Tudo",
  variedade: "Tudo",
};

const OperacoesFilterContext = createContext<OperacoesFilterContextType | undefined>(undefined);

export const OperacoesFilterProvider = ({ children }: { children: ReactNode }) => {
  const [filters, setFilters] = useState<OperacoesFilterState>(defaultFilters);

  const resetFilters = () => setFilters(defaultFilters);

  return (
    <OperacoesFilterContext.Provider value={{ filters, setFilters, resetFilters }}>
      {children}
    </OperacoesFilterContext.Provider>
  );
};

export const useOperacoesFilters = () => {
  const context = useContext(OperacoesFilterContext);
  if (!context) {
    throw new Error('useOperacoesFilters must be used within a OperacoesFilterProvider');
  }
  return context;
};
