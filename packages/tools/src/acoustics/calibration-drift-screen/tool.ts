import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly afterLevelDecibels: number;
  readonly beforeLevelDecibels: number;
  readonly maximumDriftDecibels: number;
}>;
export type Output = Readonly<{
  readonly driftDecibels: number;
  readonly withinCallerLimit: boolean;
}>;

export const calculate = (input: Input): Output => {
  for (const [field, value] of Object.entries(input))
    if (!Number.isFinite(value))
      simpleError(
        field,
        "Levels and drift limit must be finite.",
        "invalid_value",
      );
  if (input.maximumDriftDecibels < 0)
    simpleError(
      "maximumDriftDecibels",
      "Drift limit must be nonnegative.",
      "invalid_limit",
    );
  const driftDecibels = Math.abs(
    input.afterLevelDecibels - input.beforeLevelDecibels,
  );
  if (!Number.isFinite(driftDecibels))
    simpleError(
      "afterLevelDecibels",
      "Calibration drift is out of range.",
      "numeric_overflow",
    );
  return {
    driftDecibels,
    withinCallerLimit: driftDecibels <= input.maximumDriftDecibels,
  };
};

export const example = {
  input: {
    afterLevelDecibels: 94.3,
    beforeLevelDecibels: 94,
    maximumDriftDecibels: 0.5,
  },
  output: { driftDecibels: 0.29999999999999716, withinCallerLimit: true },
} satisfies ToolExample<Input, Output>;
export const edgeCase = {
  input: {
    afterLevelDecibels: 95,
    beforeLevelDecibels: 94,
    maximumDriftDecibels: 0.5,
  },
  output: { driftDecibels: 1, withinCallerLimit: false },
} satisfies { readonly input: Input; readonly output: Output };

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      afterLevelDecibels: input.afterLevelDecibels as number,
      beforeLevelDecibels: input.beforeLevelDecibels as number,
      maximumDriftDecibels: input.maximumDriftDecibels as number,
    }),
  description:
    "Calculate absolute before-versus-after sound-calibrator drift and compare it with an explicit acceptance limit.",
  id: "acoustics/calibration-drift-screen",
  inputs: [
    {
      id: "afterLevelDecibels",
      kind: "number",
      label: "After-check level",
      unit: "dB",
    },
    {
      id: "beforeLevelDecibels",
      kind: "number",
      label: "Before-check level",
      unit: "dB",
    },
    {
      id: "maximumDriftDecibels",
      kind: "number",
      label: "Maximum accepted drift",
      minimum: 0,
      unit: "dB",
    },
  ],
  outputs: [
    {
      id: "driftDecibels",
      kind: "number",
      label: "Absolute calibration drift",
      minimum: 0,
      unit: "dB",
    },
    { id: "withinCallerLimit", kind: "boolean", label: "Within caller limit" },
  ],
  title: "Calibration Drift Screen",
});

export const run = tool.execute;
export default tool;
