import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SolarToSiderealInput = Readonly<{
  readonly solarHours: number;
}>;
export type SolarToSiderealOutput = Readonly<{
  readonly siderealHours: number;
}>;

export const calculateSolarToSidereal = (
  x: SolarToSiderealInput,
): SolarToSiderealOutput => {
  if (!Number.isFinite(x.solarHours) || x.solarHours < 0)
    simpleError("solarHours", "Provide a finite nonnegative number.");
  const siderealHours = (x.solarHours * 86400) / 86164.0905;
  if (!Number.isFinite(siderealHours))
    simpleError(
      "siderealHours",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { siderealHours: Object.is(siderealHours, -0) ? 0 : siderealHours };
};

export const example = {
  input: {
    solarHours: 24,
  },
  output: { siderealHours: 24.06570983303073 },
} satisfies ToolExample<SolarToSiderealInput, SolarToSiderealOutput>;

export const tool = createSimpleTool({
  id: "horology/solar-to-sidereal",
  title: "Solar To Sidereal",
  description:
    "Sidereal hours corresponding to a duration measured in mean-solar hours, using a sidereal day of 86164.0905 SI seconds.",
  inputs: [
    {
      id: "solarHours",
      kind: "number",
      label: "Solar Hours",
      unit: "h",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "siderealHours",
      kind: "number",
      label: "Sidereal Hours",
      unit: "sidereal-hour",
    },
  ],
  calculate: (input) =>
    calculateSolarToSidereal({
      solarHours: input.solarHours as number,
    }),
});
export const solarToSiderealTool = tool;
export const runSolarToSidereal = tool.execute;
export default tool;
