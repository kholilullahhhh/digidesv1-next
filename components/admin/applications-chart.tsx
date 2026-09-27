'use client';

import { useMemo, useState } from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getDayOfMonth, getMonthShort } from '@/lib/format';

export type SeriesPoint = { date: string; total: number };

const PERIODS = [
  { value: '7', label: '7 Hari', days: 7 },
  { value: '30', label: '30 Hari', days: 30 },
  { value: '90', label: '3 Bulan', days: 90 },
] as const;

const chartConfig = {
  total: {
    label: 'Pengajuan',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export function ApplicationsChart({ data }: { data: SeriesPoint[] }) {
  const [period, setPeriod] = useState<string>('7');
  const days = PERIODS.find((item) => item.value === period)?.days ?? 7;
  const rows = useMemo(() => data.slice(-days), [data, days]);
  const total = rows.reduce((sum, row) => sum + row.total, 0);
  const max = rows.reduce((peak, row) => Math.max(peak, row.total), 0);

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 space-y-0 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <CardTitle className="text-base">Grafik Pengajuan</CardTitle>
          <CardDescription>Pengajuan layanan yang masuk per hari.</CardDescription>
        </div>
        <Tabs value={period} onValueChange={setPeriod}>
          <TabsList>
            {PERIODS.map((item) => (
              <TabsTrigger key={item.value} value={item.value}>
                {item.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        {total === 0 ? (
          <div className="flex h-[260px] items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
            Belum ada pengajuan pada periode ini.
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[260px] w-full">
            <AreaChart data={rows} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={28}
                tickFormatter={(value: string) => `${getDayOfMonth(value)} ${getMonthShort(value)}`}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                allowDecimals={false}
                width={36}
                domain={[0, Math.max(max + 1, 4)]}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
              <Area
                dataKey="total"
                type="monotone"
                fill="var(--color-total)"
                fillOpacity={0.18}
                stroke="var(--color-total)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
