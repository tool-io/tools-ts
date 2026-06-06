import {
  invalidInput,
  toolSuccess,
  type ToolResult
} from '../core/result.js';
import type {
  WeatherExtendedOutlook,
  WeatherExtendedPeriod,
  WeatherLocation
} from './types.js';

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const finiteValues = (value: unknown): number[] =>
  Array.isArray(value)
    ? value.filter(
        (item): item is number =>
          typeof item === 'number' && Number.isFinite(item)
      )
    : [];

const memberSeries = (
  daily: UnknownRecord,
  variable: string
): number[][] =>
  Object.entries(daily)
    .filter(
      ([key]) => key === variable || key.startsWith(`${variable}_member`)
    )
    .map(([, value]) => finiteValues(value));

const mean = (values: readonly number[]): number | null =>
  values.length === 0
    ? null
    : values.reduce((total, value) => total + value, 0) / values.length;

const percentile = (
  values: readonly number[],
  fraction: number
): number | null => {
  if (values.length === 0) return null;
  const sorted = [...values].sort((first, second) => first - second);
  const index = Math.round((sorted.length - 1) * fraction);
  return sorted[index] ?? null;
};

const weeklyMemberValues = (
  series: readonly number[][],
  start: number,
  end: number,
  aggregate: 'mean' | 'sum'
): number[] =>
  series.flatMap((member) => {
    const values = member.slice(start, end);
    if (values.length !== end - start) return [];
    return [
      aggregate === 'sum'
        ? values.reduce((total, value) => total + value, 0)
        : (mean(values) as number)
    ];
  });

export type NormalizeOpenMeteoExtendedInput = {
  readonly fetchedAt: Date;
  readonly location: WeatherLocation;
  readonly response: unknown;
  readonly sourceUrl: string;
};

export const normalizeOpenMeteoExtendedOutlook = (
  input: NormalizeOpenMeteoExtendedInput
): ToolResult<WeatherExtendedOutlook> => {
  if (!isRecord(input.response) || !isRecord(input.response.daily)) {
    return invalidInput([
      {
        code: 'invalid_provider_response',
        field: 'response',
        message: 'The seasonal response must contain daily ensemble data.'
      }
    ]);
  }
  const daily = input.response.daily;
  const dates = Array.isArray(daily.time)
    ? daily.time.filter((value): value is string => typeof value === 'string')
    : [];
  const temperatures = memberSeries(daily, 'temperature_2m_mean');
  const precipitation = memberSeries(daily, 'precipitation_sum');
  if (dates.length < 14 || temperatures.length === 0) {
    return invalidInput([
      {
        code: 'invalid_provider_response',
        field: 'daily',
        message: 'The seasonal response does not contain an extended outlook.'
      }
    ]);
  }

  const periods: WeatherExtendedPeriod[] = [];
  for (let start = 7; start < Math.min(35, dates.length); start += 7) {
    const end = Math.min(start + 7, dates.length);
    const temperatureMembers = weeklyMemberValues(
      temperatures,
      start,
      end,
      'mean'
    );
    const precipitationMembers = weeklyMemberValues(
      precipitation,
      start,
      end,
      'sum'
    );
    periods.push({
      endDate: dates[end - 1] as string,
      precipitationMeanMm: mean(precipitationMembers),
      startDate: dates[start] as string,
      temperatureMeanC: mean(temperatureMembers),
      temperatureP10C: percentile(temperatureMembers, 0.1),
      temperatureP90C: percentile(temperatureMembers, 0.9)
    });
  }

  return toolSuccess({
    attribution: {
      expiresAt: new Date(
        input.fetchedAt.getTime() + 12 * 60 * 60 * 1000
      ).toISOString(),
      fetchedAt: input.fetchedAt.toISOString(),
      kind: 'forecast',
      license: 'CC-BY-4.0',
      licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
      model: 'ECMWF EC46 ensemble',
      provider: 'Open-Meteo',
      sourceUrl: input.sourceUrl
    },
    location: input.location,
    periods,
    timezone:
      typeof input.response.timezone === 'string'
        ? input.response.timezone
        : input.location.timezone
  });
};
