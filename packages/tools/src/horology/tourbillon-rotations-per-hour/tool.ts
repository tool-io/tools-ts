import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TourbillonRotationsPerHourInput = Readonly<{
  readonly periodSeconds: number;
}>;
export type TourbillonRotationsPerHourOutput = Readonly<{
  readonly rotationsPerHour: number;
}>;

export const calculateTourbillonRotationsPerHour = (
  x: TourbillonRotationsPerHourInput,
): TourbillonRotationsPerHourOutput => {
  if (!Number.isFinite(x.periodSeconds) || x.periodSeconds <= 0)
    simpleError("periodSeconds", "Provide a finite positive number.");
  const rotationsPerHour = 3600 / x.periodSeconds;
  if (!Number.isFinite(rotationsPerHour))
    simpleError(
      "rotationsPerHour",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    rotationsPerHour: Object.is(rotationsPerHour, -0) ? 0 : rotationsPerHour,
  };
};

export const example = {
  input: {
    periodSeconds: 60,
  },
  output: { rotationsPerHour: 60 },
} satisfies ToolExample<
  TourbillonRotationsPerHourInput,
  TourbillonRotationsPerHourOutput
>;

export const tool = createSimpleTool({
  id: "horology/tourbillon-rotations-per-hour",
  title: "Tourbillon Rotations Per Hour",
  description:
    "Tourbillon cage rotations per hour from its rotation period in seconds.",
  inputs: [
    {
      id: "periodSeconds",
      kind: "number",
      label: "Period Seconds",
      unit: "s",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "rotationsPerHour",
      kind: "number",
      label: "Rotations Per Hour",
      unit: "rev/h",
    },
  ],
  calculate: (input) =>
    calculateTourbillonRotationsPerHour({
      periodSeconds: input.periodSeconds as number,
    }),
});
export const tourbillonRotationsPerHourTool = tool;
export const runTourbillonRotationsPerHour = tool.execute;
export default tool;
