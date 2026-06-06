import type {
  WeatherCondition,
  WeatherConditionId
} from './types.js';

const condition = (
  id: WeatherConditionId,
  label: string,
  wmoCode: number | null
): WeatherCondition => ({ id, label, wmoCode });

export const weatherConditionFromWmo = (
  code: unknown,
  isDay = true
): WeatherCondition => {
  if (typeof code !== 'number' || !Number.isInteger(code)) {
    return condition('unknown', 'Unknown', null);
  }
  if (code === 0) {
    return condition(
      isDay ? 'clear-day' : 'clear-night',
      'Clear sky',
      code
    );
  }
  if (code === 1 || code === 2) {
    return condition(
      isDay ? 'partly-cloudy-day' : 'partly-cloudy-night',
      code === 1 ? 'Mainly clear' : 'Partly cloudy',
      code
    );
  }
  if (code === 3) return condition('overcast', 'Overcast', code);
  if (code === 45 || code === 48) {
    return condition('fog', code === 48 ? 'Rime fog' : 'Fog', code);
  }
  if (code >= 51 && code <= 57) {
    return condition(
      code >= 56 ? 'freezing-rain' : 'drizzle',
      code >= 56 ? 'Freezing drizzle' : 'Drizzle',
      code
    );
  }
  if (code >= 61 && code <= 67) {
    return condition(
      code >= 66 ? 'freezing-rain' : 'rain',
      code >= 66 ? 'Freezing rain' : 'Rain',
      code
    );
  }
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) {
    return condition('snow', 'Snow', code);
  }
  if (code >= 80 && code <= 82) {
    return condition('showers', 'Rain showers', code);
  }
  if (code >= 95 && code <= 99) {
    return condition('thunderstorm', 'Thunderstorm', code);
  }
  return condition('unknown', 'Unknown', code);
};
