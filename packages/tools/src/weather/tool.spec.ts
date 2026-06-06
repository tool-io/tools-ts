import { describe, expect, it } from 'vitest';
import fixture from '../../../../fixtures/weather/open-meteo-forecast.json' with {
  type: 'json'
};
import { weatherConditionFromWmo } from './conditions.js';
import { normalizeOpenMeteoExtendedOutlook } from './extended.js';
import { normalizeOpenMeteoForecast } from './open-meteo.js';
import {
  compassDirection,
  convertPrecipitation,
  convertTemperature,
  convertWindSpeed
} from './units.js';
import type { WeatherLocation } from './types.js';

const berlin: WeatherLocation = {
  admin1: 'Berlin',
  country: 'Germany',
  countryCode: 'DE',
  elevationM: 38,
  id: '2950159',
  latitude: 52.52,
  longitude: 13.42,
  name: 'Berlin',
  timezone: 'Europe/Berlin'
};

describe('weather conditions', () => {
  it('maps WMO codes to stable semantic conditions', () => {
    expect(weatherConditionFromWmo(0, true).id).toBe('clear-day');
    expect(weatherConditionFromWmo(0, false).id).toBe('clear-night');
    expect(weatherConditionFromWmo(66).id).toBe('freezing-rain');
    expect(weatherConditionFromWmo(95).id).toBe('thunderstorm');
    expect(weatherConditionFromWmo('95').id).toBe('unknown');
  });
});

describe('weather units', () => {
  it('converts canonical SI values for US presentation', () => {
    expect(convertTemperature(20, 'us')).toBeCloseTo(68, 12);
    expect(convertWindSpeed(10, 'us')).toBeCloseTo(22.369362921, 9);
    expect(convertPrecipitation(25.4, 'us')).toBeCloseTo(1, 12);
  });

  it('formats compass directions', () => {
    expect(compassDirection(0)).toBe('N');
    expect(compassDirection(225)).toBe('SW');
    expect(compassDirection(null)).toBe('');
  });
});

describe('Open-Meteo forecast normalization', () => {
  it('normalizes the portable provider fixture', () => {
    const result = normalizeOpenMeteoForecast({
      expiresAt: new Date('2026-07-29T10:45:00.000Z'),
      fetchedAt: new Date('2026-07-29T10:00:00.000Z'),
      location: berlin,
      response: fixture,
      sourceUrl: 'https://api.open-meteo.com/v1/forecast'
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.output.current).toMatchObject({
        capeJkg: 80,
        condition: { id: 'partly-cloudy-day' },
        dewPointC: 12.8,
        temperatureC: 24.5,
        uvIndex: 5.2,
        windGustMs: 6.7,
        windSpeedMs: 3.2
      });
      expect(result.output.hourly).toHaveLength(3);
      expect(result.output.daily).toHaveLength(2);
      expect(result.output.daily[0]).toMatchObject({
        sunshineDurationSeconds: 43200,
        uvIndexMax: 5.7,
        windGustMaxMs: 7.6
      });
      expect(result.output.attribution).toMatchObject({
        kind: 'forecast',
        license: 'CC-BY-4.0',
        provider: 'Open-Meteo'
      });
    }
  });

  it('rejects incomplete provider data without returning undefined', () => {
    expect(
      normalizeOpenMeteoForecast({
        expiresAt: new Date('2026-07-29T10:45:00.000Z'),
        fetchedAt: new Date('2026-07-29T10:00:00.000Z'),
        location: berlin,
        response: {},
        sourceUrl: 'https://api.open-meteo.com/v1/forecast'
      })
    ).toMatchObject({
      error: { code: 'invalid_input' },
      ok: false
    });
  });
});

describe('Open-Meteo extended outlook normalization', () => {
  it('aggregates ensemble members into weekly means and ranges', () => {
    const dates = Array.from(
      { length: 14 },
      (_, index) => `2026-08-${String(index + 1).padStart(2, '0')}`
    );
    const series = (value: number) => [
      ...Array(7).fill(0),
      ...Array(7).fill(value)
    ];
    const result = normalizeOpenMeteoExtendedOutlook({
      fetchedAt: new Date('2026-07-29T10:00:00.000Z'),
      location: berlin,
      response: {
        timezone: 'Europe/Berlin',
        daily: {
          time: dates,
          temperature_2m_mean: series(10),
          temperature_2m_mean_member01: series(20),
          temperature_2m_mean_member02: series(30),
          precipitation_sum: series(1),
          precipitation_sum_member01: series(2),
          precipitation_sum_member02: series(3)
        }
      },
      sourceUrl: 'https://seasonal-api.open-meteo.com/v1/seasonal'
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.output.periods).toEqual([
        {
          endDate: '2026-08-14',
          precipitationMeanMm: 14,
          startDate: '2026-08-08',
          temperatureMeanC: 20,
          temperatureP10C: 10,
          temperatureP90C: 30
        }
      ]);
    }
  });
});
