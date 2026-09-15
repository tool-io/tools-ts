import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  rad,
  deg,
  angle,
} from "../batch52-shared.js";
export type Input = Readonly<{
  readonly dayOfYear: number;
  readonly latitudeDegrees: number;
  readonly solarAltitudeDegrees: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "dayOfYear", label: "Day of year", kind: "number" },
  { id: "latitudeDegrees", label: "Latitude degrees", kind: "number" },
  {
    id: "solarAltitudeDegrees",
    label: "Solar altitude degrees",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  bounded(i.dayOfYear, "day", 1, 366);
  angle(i.latitudeDegrees, "latitude", -89.9, 89.9);
  angle(i.solarAltitudeDegrees, "altitude", -90, 90);
  const decl = 23.44 * Math.sin((2 * Math.PI * (i.dayOfYear - 81)) / 365),
    q =
      (Math.sin(rad(i.solarAltitudeDegrees)) -
        Math.sin(rad(i.latitudeDegrees)) * Math.sin(rad(decl))) /
      (Math.cos(rad(i.latitudeDegrees)) * Math.cos(rad(decl)));
  return {
    approximateDeclinationDegrees: decl,
    altitudeAttainable: q >= -1 && q <= 1,
    hourAngleDegrees: q >= -1 && q <= 1 ? deg(Math.acos(q)) : 0,
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { dayOfYear: 81, latitudeDegrees: 0, solarAltitudeDegrees: 0 },
  output: {
    result: {
      approximateDeclinationDegrees: 0,
      altitudeAttainable: true,
      hourAngleDegrees: 90,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "meteorology/solar-declination-hour-angle",
  title: "Solar Declination Hour Angle Calculator",
  description:
    "Sinusoidal day-of-year solar declination with geometric altitude hour angle; unattainable flagged, no ephemeris/refraction/rise-time guarantee.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
