'use client';

import { useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';
import { TrendingUp, TrendingDown, Wallet, Download } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { BudgetView } from '@/lib/queries';
import { formatCurrency } from '@/lib/format';

interface TransparansiViewProps {
  budgets: BudgetView[];
}

export function TransparansiView({ budgets }: TransparansiViewProps) {
  const [yearIdx, setYearIdx] = useState(0);
  const year: BudgetView = budgets[yearIdx];

  const trendData = budgets.map((y) => ({
    year: y.year,
    Pendapatan: y.totalIncome,
    Belanja: y.totalExpenditure,
  }));

  return (
    <>
      <PageHeader
        eyebrow="Transparansi Anggaran"
        title="Transparansi Desa"
        description="Laporan keuangan dan anggaran Desa Sukamaju yang transparan dan akuntabel."
        breadcrumb={[{ label: 'Beranda', href: '/' }, { label: 'Transparansi' }]}
      />

      <section className="py-12 lg:py-16">
        <div className="container-mx">
          {/* Year selector */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div className="flex flex-wrap gap-2">
              {budgets.map((y, i) => (
                <button
                  key={y.year}
                  onClick={() => setYearIdx(i)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    yearIdx === i ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground hover:bg-muted/70'
                  }`}
                >
                  {y.year}
                </button>
              ))}
            </div>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Unduh Laporan
            </Button>
          </div>

          {/* Summary cards */}
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-2 text-success mb-2">
                  <TrendingUp className="h-5 w-5" />
                  <span className="text-xs font-medium text-muted-foreground">Total Pendapatan</span>
                </div>
                <p className="text-2xl font-bold font-display">{formatCurrency(year.totalIncome)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-2 text-destructive mb-2">
                  <TrendingDown className="h-5 w-5" />
                  <span className="text-xs font-medium text-muted-foreground">Total Belanja</span>
                </div>
                <p className="text-2xl font-bold font-display">{formatCurrency(year.totalExpenditure)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-2 text-primary mb-2">
                  <Wallet className="h-5 w-5" />
                  <span className="text-xs font-medium text-muted-foreground">Selisih</span>
                </div>
                <p className="text-2xl font-bold font-display">{formatCurrency(year.totalIncome - year.totalExpenditure)}</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Income pie */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Pendapatan Desa {year.year}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={year.income}
                        dataKey="value"
                        nameKey="label"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                      >
                        {year.income.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => formatCurrency(value)} contentStyle={{ borderRadius: '8px', fontSize: '12px', border: '1px solid hsl(var(--border))' }} />
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
              </CardContent>
            </Card>

            {/* Expenditure pie */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Belanja Desa {year.year}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={year.expenditure}
                        dataKey="value"
                        nameKey="label"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                      >
                        {year.expenditure.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => formatCurrency(value)} contentStyle={{ borderRadius: '8px', fontSize: '12px', border: '1px solid hsl(var(--border))' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                  {year.expenditure.map((item) => (
                    <div key={item.label} className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                        {item.label}
                      </span>
                      <span className="font-medium">{formatCurrency(item.value)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Trend chart */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Tren Anggaran {budgets[0].year}–{budgets[budgets.length - 1].year}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `${(v / 1e9).toFixed(1)}M`} />
                    <Tooltip formatter={(value: number) => formatCurrency(value)} contentStyle={{ borderRadius: '8px', fontSize: '12px', border: '1px solid hsl(var(--border))' }} />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Bar dataKey="Pendapatan" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Belanja" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
