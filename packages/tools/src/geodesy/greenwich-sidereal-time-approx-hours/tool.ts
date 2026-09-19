import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../batch58-shared.js";
export type Input = Readonly<{ ut1JulianDay: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "ut1JulianDay", label: "Ut1 julian day", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.ut1JulianDay >= 2415020.5 && i.ut1JulianDay <= 2488070.5);
  const T = (i.ut1JulianDay - 2451545) / 36525;
  return H.finish({
    greenwichMeanSiderealHours:
      H.mod(
        280.46061837 +
          360.98564736629 * (i.ut1JulianDay - 2451545) +
          0.000387933 * T * T -
          T ** 3 / 38710000,
        360,
      ) / 15,
  });
};
export const example = {
  input: { ut1JulianDay: 2451545 },
  output: { result: { greenwichMeanSiderealHours: 18.697374558 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geodesy/greenwich-sidereal-time-approx-hours",
  title: "Greenwich Sidereal Time Approximation Hours Calculator",
  description:
    "Compute the historical IAU-1982-style approximate Greenwich mean sidereal time from an explicit UT1 Julian date within 1900-2100; no apparent sidereal time, nutation or automatic UTC-to-UT1 correction.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit geodesy result; see field names for units",
      kind: "object",
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
