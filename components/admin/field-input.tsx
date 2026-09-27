'use client';

import type { AdminMeta } from '@/lib/admin-meta';
import type { FieldDef } from '@/lib/admin-resources';
import { optionsFor } from '@/lib/admin-form';
import { cn } from '@/lib/utils';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export function FieldInput({
  field,
  meta,
  value,
  error,
  onChange,
}: {
  field: FieldDef;
  meta: AdminMeta;
  value: any;
  error?: string;
  onChange: (value: any) => void;
}) {
  const options = optionsFor(field, meta);
  const wide = field.type === 'textarea' || field.type === 'lines' || field.type === 'table';

  return (
    <div className={cn('space-y-2', wide && 'sm:col-span-2')}>
      {field.type !== 'checkbox' && <Label htmlFor={field.name}>{field.label}</Label>}

      {field.type === 'text' && (
        <Input
          id={field.name}
          type={field.name === 'password' ? 'password' : 'text'}
          value={value ?? ''}
          placeholder={field.placeholder}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
      {field.type === 'email' && (
        <Input
          id={field.name}
          type="email"
          value={value ?? ''}
          placeholder={field.placeholder}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
      {field.type === 'url' && (
        <Input
          id={field.name}
          type="url"
          value={value ?? ''}
          placeholder={field.placeholder}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
      {field.type === 'number' && (
        <Input
          id={field.name}
          type="number"
          value={value ?? 0}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
      {field.type === 'date' && (
        <Input
          id={field.name}
          type="date"
          value={value ?? ''}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
      {field.type === 'textarea' && (
        <Textarea
          id={field.name}
          rows={field.rows ?? 3}
          value={value ?? ''}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
      {field.type === 'lines' && (
        <Textarea
          id={field.name}
          rows={field.rows ?? 4}
          value={value ?? ''}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
      {field.type === 'select' && (
        <Select value={String(value ?? '')} onValueChange={onChange}>
          <SelectTrigger id={field.name}>
            <SelectValue placeholder="Pilih..." />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      {field.type === 'checkbox' && (
        <div className="flex items-center gap-2 pt-1">
          <Checkbox
            id={field.name}
            checked={Boolean(value)}
            onCheckedChange={(checked) => onChange(checked === true)}
          />
          <Label htmlFor={field.name} className="font-normal">
            {field.label}
          </Label>
        </div>
      )}
      {field.type === 'table' && (
        <TableField field={field} value={Array.isArray(value) ? value : []} onChange={onChange} />
      )}

      {field.help && !error && <p className="text-xs text-muted-foreground">{field.help}</p>}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

function TableField({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: any[];
  onChange: (value: any[]) => void;
}) {
  const columns = field.columns ?? [];

  function update(index: number, key: string, cellValue: string) {
    const next = value.map((row, rowIndex) => {
      if (rowIndex !== index) return row;
      const column = columns.find((item) => item.key === key);
      return { ...row, [key]: column?.type === 'number' ? Number(cellValue || 0) : cellValue };
    });
    onChange(next);
  }

  return (
    <div className="space-y-2">
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key}>{column.label}</TableHead>
              ))}
              <TableHead className="w-[60px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {value.map((row, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <TableCell key={column.key}>
                    <Input
                      type={column.type === 'number' ? 'number' : 'text'}
                      value={row?.[column.key] ?? ''}
                      onChange={(event) => update(index, column.key, event.target.value)}
                    />
                  </TableCell>
                ))}
                <TableCell className="text-right">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Hapus baris"
                    className="text-destructive hover:text-destructive"
                    onClick={() => onChange(value.filter((_, rowIndex) => rowIndex !== index))}
                    disabled={value.length <= 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() =>
          onChange([
            ...value,
            Object.fromEntries(
              columns.map((column) => [column.key, column.type === 'number' ? 0 : '']),
            ),
          ])
        }
      >
        <Plus className="mr-2 h-4 w-4" />
        Tambah Baris
      </Button>
    </div>
  );
}
