import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly averagePowerWatts: number;
  readonly dwellSecondsPerPass: number;
  readonly spotAreaSquareMeters: number;
  readonly passCount: number;
  readonly exposureLimitJPerM2: number;
}>;
export type Output = Readonly<{
  readonly radiantExposureJPerM2: number;
  readonly limitMarginJPerM2: number;
  readonly withinLimit: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (input.spotAreaSquareMeters <= 0)
    simpleError(
      "spotAreaSquareMeters",
      "Spot area must be positive.",
      "invalid_area",
    );
  const radiantExposureJPerM2 =
    (input.averagePowerWatts * input.dwellSecondsPerPass * input.passCount) /
    input.spotAreaSquareMeters;
  return {
    radiantExposureJPerM2,
    limitMarginJPerM2: input.exposureLimitJPerM2 - radiantExposureJPerM2,
    withinLimit: radiantExposureJPerM2 <= input.exposureLimitJPerM2,
  };
};

export const exampleInput = {
  averagePowerWatts: 0.01,
  dwellSecondsPerPass: 0.001,
  spotAreaSquareMeters: 1e-6,
  passCount: 2,
  exposureLimitJPerM2: 25,
} satisfies Input;
export const exampleOutput = {
  radiantExposureJPerM2: 20.000000000000004,
  limitMarginJPerM2: 4.9999999999999964,
  withinLimit: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      averagePowerWatts: input.averagePowerWatts as number,
      dwellSecondsPerPass: input.dwellSecondsPerPass as number,
      spotAreaSquareMeters: input.spotAreaSquareMeters as number,
      passCount: input.passCount as number,
      exposureLimitJPerM2: input.exposureLimitJPerM2 as number,
    }),
  description:
    "Calculate accumulated scan exposure and compare it with a caller-supplied limit.",
  id: "laser/audience-scan-exposure",
  inputs: [
    {
      id: "averagePowerWatts",
      label: "Average beam power",
      kind: "number",
      minimum: 0,
      unit: "W",
    },
    {
      id: "dwellSecondsPerPass",
      label: "Dwell time per pass",
      kind: "number",
      minimum: 0,
      unit: "s",
    },
    {
      id: "spotAreaSquareMeters",
      label: "Spot area",
      kind: "number",
      minimum: 0,
      unit: "m²",
    },
    { id: "passCount", label: "Pass count", kind: "integer", minimum: 0 },
    {
      id: "exposureLimitJPerM2",
      label: "Caller exposure limit",
      kind: "number",
      minimum: 0,
      unit: "J/m²",
    },
  ],
  outputs: [
    {
      id: "radiantExposureJPerM2",
      label: "Accumulated radiant exposure",
      kind: "number",
      minimum: 0,
      unit: "J/m²",
    },
    {
      id: "limitMarginJPerM2",
      label: "Exposure-limit margin",
      kind: "number",
      unit: "J/m²",
    },
    { id: "withinLimit", label: "Within limit", kind: "boolean" },
  ],
  title: "Audience-Scan Exposure",
});

export const run = tool.execute;
export default tool;
