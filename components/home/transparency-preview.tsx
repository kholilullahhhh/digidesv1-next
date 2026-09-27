'use client';

import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SectionHeading } from '@/components/layout/section-heading';
import { formatCurrency } from '@/lib/format';
import type { BudgetView } from '@/lib/queries';

interface TransparencyPreviewProps {
  budgetYears: BudgetView[];
}

export function TransparencyPreview({ budgetYears }: TransparencyPreviewProps) {
  const [yearIdx, setYearIdx] = useState(0);
  const year: BudgetView | undefined = budgetYears[yearIdx] ?? budgetYears[0];

  if (!year) {
    return (
      <section className="py-16 lg:py-24 bg-muted/40 border-y">
        <div className="container-mx">
          <SectionHeading
            eyebrow="Transparansi"
            title="Transparansi Anggaran Desa"
            description="Pemerintah Desa Sukamaju berkomitmen untuk transparansi dalam pengelolaan keuangan desa."
          />
          <div className="mt-10 rounded-2xl border bg-card p-8 text-center text-muted-foreground">
            Laporan anggaran desa belum tersedia. Silakan kembali lagi nanti.
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 lg:py-24 bg-muted/40 border-y">
      <div className="container-mx">
        <SectionHeading
          eyebrow="Transparansi"
          title="Transparansi Anggaran Desa"
          description="Pemerintah Desa Sukamaju berkomitmen untuk transparansi dalam pengelolaan keuangan desa."
        />

        <div className="mt-10 grid lg:grid-cols-2 gap-8 items-center">
          {/* Charts */}
          <div className="rounded-2xl border bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display font-semibold">Pendapatan {year.year}</h3>
                <p className="text-xs text-muted-foreground">Sumber pendapatan desa</p>
              </div>
              <select
                value={yearIdx}
                onChange={(e) => setYearIdx(Number(e.target.value))}
                className="rounded-md border bg-background px-2 py-1.5 text-sm"
                aria-label="Pilih tahun"
              >
                {budgetYears.map((y, i) => (
                  <option key={y.year} value={i}>{y.year}</option>
                ))}
              </select>
            </div>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={year.income}
                    dataKey="value"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={2}
                  >
                    {year.income.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{ borderRadius: '8px', fontSize: '12px', border: '1px solid hsl(var(--border))' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {year.income.map((item) => (
                <div key={item.label} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    {item.label}
                  </span>
                  <span className="font-medium">{formatCurrency(item.value)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl border bg-card p-5">
                <div className="flex items-center gap-2 text-success mb-2">
                  <TrendingUp className="h-5 w-5" />
                  <span className="text-xs font-medium text-muted-foreground">Total Pendapatan</span>
                </div>
                <p className="text-xl font-bold font-display">{formatCurrency(year.totalIncome)}</p>
              </div>
              <div className="rounded-xl border bg-card p-5">
                <div className="flex items-center gap-2 text-destructive mb-2">
                  <TrendingDown className="h-5 w-5" />
                  <span className="text-xs font-medium text-muted-foreground">Total Belanja</span>
                </div>
                <p className="text-xl font-bold font-display">{formatCurrency(year.totalExpenditure)}</p>
              </div>
            </div>

            <div className="mt-4 rounded-xl border bg-card p-5">
              <div className="flex items-center gap-2 mb-3">
                <Wallet className="h-5 w-5 text-primary" />
                <h4 className="font-semibold">Belanja per Bidang</h4>
              </div>
              <div className="space-y-3">
                {year.expenditure.map((item) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>{item.label}</span>
                      <span className="font-medium">{formatCurrency(item.value)}</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${
                            year.totalExpenditure > 0
                              ? Math.min(100, (item.value / year.totalExpenditure) * 100)
                              : 0
                          }%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Button asChild className="mt-6">
              <Link href="/transparansi">
                Lihat Laporan Lengkap
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
