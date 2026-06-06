import type { WeatherUnitSystem } from './types.js';

export const convertTemperature = (
  celsius: number,
  units: WeatherUnitSystem
): number => (units === 'us' ? (celsius * 9) / 5 + 32 : celsius);

export const convertWindSpeed = (
  metresPerSecond: number,
  units: WeatherUnitSystem
): number =>
  units === 'us' ? metresPerSecond * 2.236_936_292_1 : metresPerSecond * 3.6;

export const convertPrecipitation = (
  millimetres: number,
  units: WeatherUnitSystem
): number => (units === 'us' ? millimetres / 25.4 : millimetres);

export const temperatureUnit = (
  units: WeatherUnitSystem
): '°C' | '°F' => (units === 'us' ? '°F' : '°C');

export const windSpeedUnit = (
  units: WeatherUnitSystem
): 'km/h' | 'mph' => (units === 'us' ? 'mph' : 'km/h');

export const precipitationUnit = (
  units: WeatherUnitSystem
): 'in' | 'mm' => (units === 'us' ? 'in' : 'mm');

export const compassDirection = (
  degrees: number | null
): string => {
  if (degrees === null || !Number.isFinite(degrees)) return '';
  const directions = [
    'N',
    'NE',
    'E',
    'SE',
    'S',
    'SW',
    'W',
    'NW'
  ] as const;
  const normalized = ((degrees % 360) + 360) % 360;
  return directions[Math.round(normalized / 45) % directions.length] ?? '';
};
