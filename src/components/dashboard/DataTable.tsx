import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Column {
  key: string;
  header: string;
  align?: 'left' | 'center' | 'right';
}

interface DataTableProps {
  columns: Column[];
  data: Record<string, any>[];
  maxHeight?: string;
}

export const DataTable = ({ columns, data, maxHeight = "200px" }: DataTableProps) => {
  return (
    <ScrollArea className={`rounded-md border`} style={{ maxHeight }}>
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            {columns.map((col) => (
              <TableHead 
                key={col.key} 
                className={`text-xs font-semibold ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : ''}`}
              >
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.slice(0, 10).map((row, idx) => (
            <TableRow key={idx} className="text-sm">
              {columns.map((col) => (
                <TableCell 
                  key={col.key} 
                  className={col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : ''}
                >
                  {row[col.key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
};
