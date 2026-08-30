import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DoubleDottedDurationCalculatorInput = Readonly<{
  readonly undottedSeconds: number;
}>;
export type DoubleDottedDurationCalculatorOutput = Readonly<{
  readonly doubleDottedSeconds: number;
}>;

export const calculateDoubleDottedDurationCalculator = (
  x: DoubleDottedDurationCalculatorInput,
): DoubleDottedDurationCalculatorOutput => {
  if (!Number.isFinite(x.undottedSeconds) || x.undottedSeconds <= 0)
    simpleError("undottedSeconds", "Provide a finite positive number.");
  const doubleDottedSeconds = 1.75 * x.undottedSeconds;
  if (!Number.isFinite(doubleDottedSeconds))
    simpleError(
      "doubleDottedSeconds",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    doubleDottedSeconds: Object.is(doubleDottedSeconds, -0)
      ? 0
      : doubleDottedSeconds,
  };
};

export const example = {
  input: {
    undottedSeconds: 1,
  },
  output: { doubleDottedSeconds: 1.75 },
} satisfies ToolExample<
  DoubleDottedDurationCalculatorInput,
  DoubleDottedDurationCalculatorOutput
>;

export const tool = createSimpleTool({
  id: "music/double-dotted-duration-calculator",
  title: "Double Dotted Duration Calculator",
  description:
    "Duration of a double-dotted note: seven quarters of its undotted duration.",
  inputs: [
    {
      id: "undottedSeconds",
      kind: "number",
      label: "Undotted Seconds",
      unit: "s",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "doubleDottedSeconds",
      kind: "number",
      label: "Double Dotted Seconds",
      unit: "s",
    },
  ],
  calculate: (input) =>
    calculateDoubleDottedDurationCalculator({
      undottedSeconds: input.undottedSeconds as number,
    }),
});
export const doubleDottedDurationCalculatorTool = tool;
export const runDoubleDottedDurationCalculator = tool.execute;
export default tool;
