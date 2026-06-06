export type WeatherUnitSystem = 'metric' | 'us';

export type WeatherConditionId =
  | 'clear-day'
  | 'clear-night'
  | 'drizzle'
  | 'fog'
  | 'freezing-rain'
  | 'overcast'
  | 'partly-cloudy-day'
  | 'partly-cloudy-night'
  | 'rain'
  | 'showers'
  | 'snow'
  | 'thunderstorm'
  | 'unknown';

export type WeatherCondition = {
  readonly id: WeatherConditionId;
  readonly label: string;
  readonly wmoCode: number | null;
};

export type WeatherLocation = {
  readonly admin1: string | null;
  readonly country: string;
  readonly countryCode: string;
  readonly elevationM: number | null;
  readonly id: string;
  readonly latitude: number;
  readonly longitude: number;
  readonly name: string;
  readonly timezone: string;
};

export type WeatherAttribution = {
  readonly expiresAt: string;
  readonly fetchedAt: string;
  readonly kind: 'forecast' | 'observation' | 'reanalysis';
  readonly license: string;
  readonly licenseUrl: string;
  readonly model: string | null;
  readonly provider: string;
  readonly sourceUrl: string;
};

export type WeatherCurrent = {
  readonly apparentTemperatureC: number | null;
  readonly capeJkg: number | null;
  readonly cloudCoverPercent: number | null;
  readonly condition: WeatherCondition;
  readonly dewPointC: number | null;
  readonly evapotranspirationMm: number | null;
  readonly freezingLevelHeightM: number | null;
  readonly humidityPercent: number | null;
  readonly isDay: boolean;
  readonly liftedIndex: number | null;
  readonly precipitationMm: number | null;
  readonly pressureHpa: number | null;
  readonly rainMm: number | null;
  readonly shortwaveRadiationWm2: number | null;
  readonly showersMm: number | null;
  readonly snowDepthM: number | null;
  readonly snowfallCm: number | null;
  readonly soilMoistureM3M3: number | null;
  readonly soilTemperatureC: number | null;
  readonly temperatureC: number | null;
  readonly time: string;
  readonly uvIndex: number | null;
  readonly visibilityM: number | null;
  readonly wetBulbTemperatureC: number | null;
  readonly windDirectionDegrees: number | null;
  readonly windGustMs: number | null;
  readonly windSpeedMs: number | null;
};

export type WeatherHourlyPoint = {
  readonly apparentTemperatureC: number | null;
  readonly capeJkg: number | null;
  readonly cloudCoverPercent: number | null;
  readonly condition: WeatherCondition;
  readonly dewPointC: number | null;
  readonly evapotranspirationMm: number | null;
  readonly freezingLevelHeightM: number | null;
  readonly humidityPercent: number | null;
  readonly liftedIndex: number | null;
  readonly precipitationMm: number | null;
  readonly precipitationProbabilityPercent: number | null;
  readonly pressureHpa: number | null;
  readonly rainMm: number | null;
  readonly shortwaveRadiationWm2: number | null;
  readonly showersMm: number | null;
  readonly snowDepthM: number | null;
  readonly snowfallCm: number | null;
  readonly soilMoistureM3M3: number | null;
  readonly soilTemperatureC: number | null;
  readonly temperatureC: number | null;
  readonly time: string;
  readonly uvIndex: number | null;
  readonly visibilityM: number | null;
  readonly wetBulbTemperatureC: number | null;
  readonly windDirectionDegrees: number | null;
  readonly windGustMs: number | null;
  readonly windSpeedMs: number | null;
};

export type WeatherDailyPoint = {
  readonly condition: WeatherCondition;
  readonly date: string;
  readonly evapotranspirationMm: number | null;
  readonly precipitationMm: number | null;
  readonly precipitationProbabilityPercent: number | null;
  readonly rainMm: number | null;
  readonly showersMm: number | null;
  readonly snowfallCm: number | null;
  readonly sunshineDurationSeconds: number | null;
  readonly sunrise: string | null;
  readonly sunset: string | null;
  readonly temperatureMaxC: number | null;
  readonly temperatureMinC: number | null;
  readonly uvIndexMax: number | null;
  readonly windGustMaxMs: number | null;
};

export type WeatherForecast = {
  readonly attribution: WeatherAttribution;
  readonly current: WeatherCurrent;
  readonly daily: readonly WeatherDailyPoint[];
  readonly elevationM: number | null;
  readonly hourly: readonly WeatherHourlyPoint[];
  readonly location: WeatherLocation;
  readonly timezone: string;
  readonly timezoneAbbreviation: string;
  readonly utcOffsetSeconds: number;
};

export type WeatherExtendedPeriod = {
  readonly endDate: string;
  readonly precipitationMeanMm: number | null;
  readonly startDate: string;
  readonly temperatureMeanC: number | null;
  readonly temperatureP10C: number | null;
  readonly temperatureP90C: number | null;
};

export type WeatherExtendedOutlook = {
  readonly attribution: WeatherAttribution;
  readonly location: WeatherLocation;
  readonly periods: readonly WeatherExtendedPeriod[];
  readonly timezone: string;
};
