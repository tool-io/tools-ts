import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SiderealToSolarInput = Readonly<{
  readonly siderealHours: number;
}>;
export type SiderealToSolarOutput = Readonly<{
  readonly solarHours: number;
}>;

export const calculateSiderealToSolar = (
  x: SiderealToSolarInput,
): SiderealToSolarOutput => {
  if (!Number.isFinite(x.siderealHours) || x.siderealHours < 0)
    simpleError("siderealHours", "Provide a finite nonnegative number.");
  const solarHours = (x.siderealHours * 86164.0905) / 86400;
  if (!Number.isFinite(solarHours))
    simpleError(
      "solarHours",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { solarHours: Object.is(solarHours, -0) ? 0 : solarHours };
};

export const example = {
  input: {
    siderealHours: 24,
  },
  output: { solarHours: 23.934469583333335 },
} satisfies ToolExample<SiderealToSolarInput, SiderealToSolarOutput>;

export const tool = createSimpleTool({
  id: "horology/sidereal-to-solar",
  title: "Sidereal To Solar",
  description:
    "Mean-solar hours corresponding to a duration measured in sidereal hours, using a sidereal day of 86164.0905 SI seconds.",
  inputs: [
    {
      id: "siderealHours",
      kind: "number",
      label: "Sidereal Hours",
      unit: "sidereal-hour",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "solarHours", kind: "number", label: "Solar Hours", unit: "h" },
  ],
  calculate: (input) =>
    calculateSiderealToSolar({
      siderealHours: input.siderealHours as number,
    }),
});
export const siderealToSolarTool = tool;
export const runSiderealToSolar = tool.execute;
export default tool;
