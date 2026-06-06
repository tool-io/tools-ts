import {
  invalidInput,
  toolSuccess,
  type ToolResult
} from '../core/result.js';
import { weatherConditionFromWmo } from './conditions.js';
import type {
  WeatherDailyPoint,
  WeatherForecast,
  WeatherHourlyPoint,
  WeatherLocation
} from './types.js';

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const finiteOrNull = (value: unknown): number | null =>
  typeof value === 'number' && Number.isFinite(value) ? value : null;

const integerOrNull = (value: unknown): number | null => {
  const number = finiteOrNull(value);
  return number !== null && Number.isInteger(number) ? number : null;
};

const stringOrNull = (value: unknown): string | null =>
  typeof value === 'string' && value.length > 0 ? value : null;

const array = (record: UnknownRecord, field: string): readonly unknown[] =>
  Array.isArray(record[field]) ? record[field] : [];

const arrayValue = (
  record: UnknownRecord,
  field: string,
  index: number
): unknown => array(record, field)[index];

export type NormalizeOpenMeteoForecastInput = {
  readonly expiresAt: Date;
  readonly fetchedAt: Date;
  readonly location: WeatherLocation;
  readonly response: unknown;
  readonly sourceUrl: string;
};

export const normalizeOpenMeteoForecast = (
  input: NormalizeOpenMeteoForecastInput
): ToolResult<WeatherForecast> => {
  if (!isRecord(input.response)) {
    return invalidInput([
      {
        code: 'invalid_provider_response',
        field: 'response',
        message:
          'Open-Meteo response must include current, hourly, and daily data.'
      }
    ]);
  }

  const response = input.response;
  if (
    !isRecord(response.current) ||
    !isRecord(response.hourly) ||
    !isRecord(response.daily)
  ) {
    return invalidInput([
      {
        code: 'invalid_provider_response',
        field: 'response',
        message:
          'Open-Meteo response must include current, hourly, and daily data.'
      }
    ]);
  }
  const current = response.current;
  const hourly = response.hourly;
  const daily = response.daily;
  const currentTime = stringOrNull(current.time);
  const timezone = stringOrNull(response.timezone);

  if (currentTime === null || timezone === null) {
    return invalidInput([
      {
        code: 'invalid_provider_response',
        field: currentTime === null ? 'current.time' : 'timezone',
        message: 'Open-Meteo response is missing time information.'
      }
    ]);
  }

  const isDay = finiteOrNull(current.is_day) !== 0;
  const hourlyTimes = array(hourly, 'time');
  const hourlyPoints: WeatherHourlyPoint[] = hourlyTimes.flatMap(
    (time, index) => {
      if (typeof time !== 'string') return [];
      const code = integerOrNull(arrayValue(hourly, 'weather_code', index));
      return [
        {
          apparentTemperatureC: finiteOrNull(
            arrayValue(hourly, 'apparent_temperature', index)
          ),
          capeJkg: finiteOrNull(arrayValue(hourly, 'cape', index)),
          cloudCoverPercent: finiteOrNull(
            arrayValue(hourly, 'cloud_cover', index)
          ),
          condition: weatherConditionFromWmo(code, true),
          dewPointC: finiteOrNull(
            arrayValue(hourly, 'dew_point_2m', index)
          ),
          evapotranspirationMm: finiteOrNull(
            arrayValue(hourly, 'et0_fao_evapotranspiration', index)
          ),
          freezingLevelHeightM: finiteOrNull(
            arrayValue(hourly, 'freezing_level_height', index)
          ),
          humidityPercent: finiteOrNull(
            arrayValue(hourly, 'relative_humidity_2m', index)
          ),
          liftedIndex: finiteOrNull(
            arrayValue(hourly, 'lifted_index', index)
          ),
          precipitationMm: finiteOrNull(
            arrayValue(hourly, 'precipitation', index)
          ),
          precipitationProbabilityPercent: finiteOrNull(
            arrayValue(hourly, 'precipitation_probability', index)
          ),
          pressureHpa: finiteOrNull(
            arrayValue(hourly, 'surface_pressure', index)
          ),
          rainMm: finiteOrNull(arrayValue(hourly, 'rain', index)),
          shortwaveRadiationWm2: finiteOrNull(
            arrayValue(hourly, 'shortwave_radiation', index)
          ),
          showersMm: finiteOrNull(arrayValue(hourly, 'showers', index)),
          snowDepthM: finiteOrNull(
            arrayValue(hourly, 'snow_depth', index)
          ),
          snowfallCm: finiteOrNull(
            arrayValue(hourly, 'snowfall', index)
          ),
          soilMoistureM3M3: finiteOrNull(
            arrayValue(hourly, 'soil_moisture_0_to_1cm', index)
          ),
          soilTemperatureC: finiteOrNull(
            arrayValue(hourly, 'soil_temperature_0cm', index)
          ),
          temperatureC: finiteOrNull(
            arrayValue(hourly, 'temperature_2m', index)
          ),
          time,
          uvIndex: finiteOrNull(arrayValue(hourly, 'uv_index', index)),
          visibilityM: finiteOrNull(
            arrayValue(hourly, 'visibility', index)
          ),
          wetBulbTemperatureC: finiteOrNull(
            arrayValue(hourly, 'wet_bulb_temperature_2m', index)
          ),
          windDirectionDegrees: finiteOrNull(
            arrayValue(hourly, 'wind_direction_10m', index)
          ),
          windGustMs: finiteOrNull(
            arrayValue(hourly, 'wind_gusts_10m', index)
          ),
          windSpeedMs: finiteOrNull(
            arrayValue(hourly, 'wind_speed_10m', index)
          )
        }
      ];
    }
  );

  const dailyTimes = array(daily, 'time');
  const dailyPoints: WeatherDailyPoint[] = dailyTimes.flatMap(
    (date, index) => {
      if (typeof date !== 'string') return [];
      return [
        {
          condition: weatherConditionFromWmo(
            integerOrNull(arrayValue(daily, 'weather_code', index)),
            true
          ),
          date,
          evapotranspirationMm: finiteOrNull(
            arrayValue(daily, 'et0_fao_evapotranspiration_sum', index)
          ),
          precipitationMm: finiteOrNull(
            arrayValue(daily, 'precipitation_sum', index)
          ),
          precipitationProbabilityPercent: finiteOrNull(
            arrayValue(daily, 'precipitation_probability_max', index)
          ),
          rainMm: finiteOrNull(arrayValue(daily, 'rain_sum', index)),
          showersMm: finiteOrNull(
            arrayValue(daily, 'showers_sum', index)
          ),
          snowfallCm: finiteOrNull(
            arrayValue(daily, 'snowfall_sum', index)
          ),
          sunshineDurationSeconds: finiteOrNull(
            arrayValue(daily, 'sunshine_duration', index)
          ),
          sunrise: stringOrNull(arrayValue(daily, 'sunrise', index)),
          sunset: stringOrNull(arrayValue(daily, 'sunset', index)),
          temperatureMaxC: finiteOrNull(
            arrayValue(daily, 'temperature_2m_max', index)
          ),
          temperatureMinC: finiteOrNull(
            arrayValue(daily, 'temperature_2m_min', index)
          ),
          uvIndexMax: finiteOrNull(
            arrayValue(daily, 'uv_index_max', index)
          ),
          windGustMaxMs: finiteOrNull(
            arrayValue(daily, 'wind_gusts_10m_max', index)
          )
        }
      ];
    }
  );

  return toolSuccess({
    attribution: {
      expiresAt: input.expiresAt.toISOString(),
      fetchedAt: input.fetchedAt.toISOString(),
      kind: 'forecast',
      license: 'CC-BY-4.0',
      licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
      model: 'best_match',
      provider: 'Open-Meteo',
      sourceUrl: input.sourceUrl
    },
    current: {
      apparentTemperatureC: finiteOrNull(current.apparent_temperature),
      capeJkg: finiteOrNull(current.cape),
      cloudCoverPercent: finiteOrNull(current.cloud_cover),
      condition: weatherConditionFromWmo(
        integerOrNull(current.weather_code),
        isDay
      ),
      dewPointC: finiteOrNull(current.dew_point_2m),
      evapotranspirationMm: finiteOrNull(
        current.et0_fao_evapotranspiration
      ),
      freezingLevelHeightM: finiteOrNull(
        current.freezing_level_height
      ),
      humidityPercent: finiteOrNull(current.relative_humidity_2m),
      isDay,
      liftedIndex: finiteOrNull(current.lifted_index),
      precipitationMm: finiteOrNull(current.precipitation),
      pressureHpa: finiteOrNull(current.surface_pressure),
      rainMm: finiteOrNull(current.rain),
      shortwaveRadiationWm2: finiteOrNull(current.shortwave_radiation),
      showersMm: finiteOrNull(current.showers),
      snowDepthM: finiteOrNull(current.snow_depth),
      snowfallCm: finiteOrNull(current.snowfall),
      soilMoistureM3M3: finiteOrNull(current.soil_moisture_0_to_1cm),
      soilTemperatureC: finiteOrNull(current.soil_temperature_0cm),
      temperatureC: finiteOrNull(current.temperature_2m),
      time: currentTime,
      uvIndex: finiteOrNull(current.uv_index),
      visibilityM: finiteOrNull(current.visibility),
      wetBulbTemperatureC: finiteOrNull(
        current.wet_bulb_temperature_2m
      ),
      windDirectionDegrees: finiteOrNull(current.wind_direction_10m),
      windGustMs: finiteOrNull(current.wind_gusts_10m),
      windSpeedMs: finiteOrNull(current.wind_speed_10m)
    },
    daily: dailyPoints,
    elevationM: finiteOrNull(response.elevation),
    hourly: hourlyPoints,
    location: input.location,
    timezone,
    timezoneAbbreviation:
      stringOrNull(response.timezone_abbreviation) ?? timezone,
    utcOffsetSeconds: integerOrNull(response.utc_offset_seconds) ?? 0
  });
};
