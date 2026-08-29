import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DaylightInput = {
  readonly date: string;
  readonly latitudeDegrees: number;
  readonly longitudeDegrees: number;
  readonly utcOffsetHours: number;
};
export type DaylightResult = {
  readonly daylightMinutes: number;
  readonly solarNoonLocalMinutes: number;
  readonly status: "normal" | "polar-day" | "polar-night";
  readonly sunriseLocalMinutes: number | null;
  readonly sunsetLocalMinutes: number | null;
  readonly theoreticalSunshineMinutes: number;
};

const parseDate = (value: string): Date => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value))
    simpleError("date", "Date must use YYYY-MM-DD format.");
  const date = new Date(`${value}T00:00:00Z`);
  if (
    !Number.isFinite(date.getTime()) ||
    date.toISOString().slice(0, 10) !== value
  )
    simpleError("date", "Date must be a valid Gregorian calendar date.");
  return date;
};
const normalizeMinutes = (value: number) => ((value % 1_440) + 1_440) % 1_440;

export const calculateDaylight = (input: DaylightInput): DaylightResult => {
  const date = parseDate(input.date);
  const yearStart = Date.UTC(date.getUTCFullYear(), 0, 1);
  const dayOfYear = Math.floor((date.getTime() - yearStart) / 86_400_000) + 1;
  const gamma = ((2 * Math.PI) / 365) * (dayOfYear - 1);
  const equationOfTime =
    229.18 *
    (0.000075 +
      0.001868 * Math.cos(gamma) -
      0.032077 * Math.sin(gamma) -
      0.014615 * Math.cos(2 * gamma) -
      0.040849 * Math.sin(2 * gamma));
  const declination =
    0.006918 -
    0.399912 * Math.cos(gamma) +
    0.070257 * Math.sin(gamma) -
    0.006758 * Math.cos(2 * gamma) +
    0.000907 * Math.sin(2 * gamma) -
    0.002697 * Math.cos(3 * gamma) +
    0.00148 * Math.sin(3 * gamma);
  const latitude = (input.latitudeDegrees * Math.PI) / 180;
  const cosineHourAngle =
    Math.cos((90.833 * Math.PI) / 180) /
      (Math.cos(latitude) * Math.cos(declination)) -
    Math.tan(latitude) * Math.tan(declination);
  const solarNoon =
    720 -
    4 * input.longitudeDegrees -
    equationOfTime +
    input.utcOffsetHours * 60;
  if (cosineHourAngle > 1)
    return {
      daylightMinutes: 0,
      solarNoonLocalMinutes: normalizeMinutes(solarNoon),
      status: "polar-night",
      sunriseLocalMinutes: null,
      sunsetLocalMinutes: null,
      theoreticalSunshineMinutes: 0,
    };
  if (cosineHourAngle < -1)
    return {
      daylightMinutes: 1_440,
      solarNoonLocalMinutes: normalizeMinutes(solarNoon),
      status: "polar-day",
      sunriseLocalMinutes: null,
      sunsetLocalMinutes: null,
      theoreticalSunshineMinutes: 1_440,
    };
  const hourAngleDegrees = (Math.acos(cosineHourAngle) * 180) / Math.PI;
  const daylightMinutes = 8 * hourAngleDegrees;
  return {
    daylightMinutes,
    solarNoonLocalMinutes: normalizeMinutes(solarNoon),
    status: "normal",
    sunriseLocalMinutes: normalizeMinutes(solarNoon - 4 * hourAngleDegrees),
    sunsetLocalMinutes: normalizeMinutes(solarNoon + 4 * hourAngleDegrees),
    theoreticalSunshineMinutes: daylightMinutes,
  };
};

const exampleInput: DaylightInput = {
  date: "2026-06-21",
  latitudeDegrees: 52.52,
  longitudeDegrees: 13.405,
  utcOffsetHours: 2,
};
export const daylightExample = {
  input: exampleInput,
  output: { result: calculateDaylight(exampleInput) },
} satisfies ToolExample<DaylightInput, { readonly result: DaylightResult }>;

export const daylightTool = createSimpleTool({
  calculate: (input) => ({
    result: calculateDaylight({
      date: input.date as string,
      latitudeDegrees: input.latitudeDegrees as number,
      longitudeDegrees: input.longitudeDegrees as number,
      utcOffsetHours: input.utcOffsetHours as number,
    }),
  }),
  description:
    "Estimate local apparent sunrise, sunset, solar noon, and theoretical daylight from the NOAA solar equations. The sunshine duration is the astronomical maximum, not observed cloud-adjusted sunshine.",
  id: "astronomy/daylight",
  inputs: [
    { id: "date", kind: "string", label: "Date" },
    {
      id: "latitudeDegrees",
      kind: "number",
      label: "Latitude",
      maximum: 90,
      minimum: -90,
      unit: "degrees",
    },
    {
      id: "longitudeDegrees",
      kind: "number",
      label: "Longitude",
      maximum: 180,
      minimum: -180,
      unit: "degrees",
    },
    {
      id: "utcOffsetHours",
      kind: "number",
      label: "UTC offset",
      maximum: 14,
      minimum: -12,
      unit: "hours",
    },
  ],
  outputs: [
    {
      format: "astronomy/daylight-result",
      id: "result",
      kind: "object",
      label: "Daylight result",
    },
  ],
  title: "Sunrise, Sunset, and Daylight Calculator",
});
export const runDaylight = daylightTool.execute;
export default daylightTool;
