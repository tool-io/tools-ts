import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PeriodFromFrequencyInput = Readonly<{
  readonly hertz: number;
}>;
export type PeriodFromFrequencyOutput = Readonly<{
  readonly periodSeconds: number;
}>;

export const calculatePeriodFromFrequency = (
  x: PeriodFromFrequencyInput,
): PeriodFromFrequencyOutput => {
  if (!Number.isFinite(x.hertz) || x.hertz <= 0)
    simpleError("hertz", "Provide a finite positive number.");
  const periodSeconds = 1 / x.hertz;
  if (!Number.isFinite(periodSeconds))
    simpleError(
      "periodSeconds",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { periodSeconds: Object.is(periodSeconds, -0) ? 0 : periodSeconds };
};

export const example = {
  input: {
    hertz: 4,
  },
  output: { periodSeconds: 0.25 },
} satisfies ToolExample<PeriodFromFrequencyInput, PeriodFromFrequencyOutput>;

export const tool = createSimpleTool({
  id: "horology/period-from-frequency",
  title: "Period From Frequency",
  description:
    "Full oscillation period in seconds from positive cycle frequency in hertz.",
  inputs: [
    { id: "hertz", kind: "number", label: "Hertz", unit: "Hz", minimum: 0 },
  ],
  outputs: [
    { id: "periodSeconds", kind: "number", label: "Period Seconds", unit: "s" },
  ],
  calculate: (input) =>
    calculatePeriodFromFrequency({
      hertz: input.hertz as number,
    }),
});
export const periodFromFrequencyTool = tool;
export const runPeriodFromFrequency = tool.execute;
export default tool;
