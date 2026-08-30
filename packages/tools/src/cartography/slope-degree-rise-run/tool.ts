import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SlopeDegreeRiseRunInput = Readonly<{
  readonly riseMeters: number;
  readonly runMeters: number;
}>;
export type SlopeDegreeRiseRunOutput = Readonly<{
  readonly slopeDegrees: number;
}>;

export const calculateSlopeDegreeRiseRun = (
  x: SlopeDegreeRiseRunInput,
): SlopeDegreeRiseRunOutput => {
  if (!Number.isFinite(x.riseMeters))
    simpleError("riseMeters", "Provide a finite number.");
  if (!Number.isFinite(x.runMeters) || x.runMeters <= 0)
    simpleError("runMeters", "Provide a finite positive number.");
  const slopeDegrees = (Math.atan(x.riseMeters / x.runMeters) * 180) / Math.PI;
  if (!Number.isFinite(slopeDegrees))
    simpleError(
      "slopeDegrees",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { slopeDegrees: Object.is(slopeDegrees, -0) ? 0 : slopeDegrees };
};

export const example = {
  input: {
    riseMeters: 10,
    runMeters: 100,
  },
  output: { slopeDegrees: 5.710593137499643 },
} satisfies ToolExample<SlopeDegreeRiseRunInput, SlopeDegreeRiseRunOutput>;

export const tool = createSimpleTool({
  id: "cartography/slope-degree-rise-run",
  title: "Slope Degree Rise Run",
  description:
    "Incline angle in degrees from signed vertical rise and positive horizontal run.",
  inputs: [
    { id: "riseMeters", kind: "number", label: "Rise Meters", unit: "m" },
    {
      id: "runMeters",
      kind: "number",
      label: "Run Meters",
      unit: "m",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "slopeDegrees", kind: "number", label: "Slope Degrees", unit: "deg" },
  ],
  calculate: (input) =>
    calculateSlopeDegreeRiseRun({
      riseMeters: input.riseMeters as number,
      runMeters: input.runMeters as number,
    }),
});
export const slopeDegreeRiseRunTool = tool;
export const runSlopeDegreeRiseRun = tool.execute;
export default tool;
