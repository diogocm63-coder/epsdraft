import React, { createContext, useContext, useState, ReactNode } from 'react';
import { anos, meses, tiposProduto, distritos } from '@/data/mockData';

interface FilterState {
  ano: number;
  mes: string;
  tipoProduto: string;
  produto: string;
  zona: string;
  concelho: string;
  consultor: string;
}

interface FilterContextType {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
}

const defaultFilters: FilterState = {
  ano: 2025,
  mes: "Todos",
  tipoProduto: "Todos",
  produto: "Todos",
  zona: "Portugal",
  concelho: "Todos",
  consultor: "Todos",
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider = ({ children }: { children: ReactNode }) => {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  const resetFilters = () => setFilters(defaultFilters);

  return (
    <FilterContext.Provider value={{ filters, setFilters, resetFilters }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilters = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
};
