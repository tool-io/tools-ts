import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DottedNoteDurationCalculatorInput = Readonly<{
  readonly undottedSeconds: number;
}>;
export type DottedNoteDurationCalculatorOutput = Readonly<{
  readonly dottedSeconds: number;
}>;

export const calculateDottedNoteDurationCalculator = (
  x: DottedNoteDurationCalculatorInput,
): DottedNoteDurationCalculatorOutput => {
  if (!Number.isFinite(x.undottedSeconds) || x.undottedSeconds <= 0)
    simpleError("undottedSeconds", "Provide a finite positive number.");
  const dottedSeconds = 1.5 * x.undottedSeconds;
  if (!Number.isFinite(dottedSeconds))
    simpleError(
      "dottedSeconds",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { dottedSeconds: Object.is(dottedSeconds, -0) ? 0 : dottedSeconds };
};

export const example = {
  input: {
    undottedSeconds: 1,
  },
  output: { dottedSeconds: 1.5 },
} satisfies ToolExample<
  DottedNoteDurationCalculatorInput,
  DottedNoteDurationCalculatorOutput
>;

export const tool = createSimpleTool({
  id: "music/dotted-note-duration-calculator",
  title: "Dotted Note Duration Calculator",
  description:
    "Duration of a single-dotted note: one and a half times its undotted duration.",
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
    { id: "dottedSeconds", kind: "number", label: "Dotted Seconds", unit: "s" },
  ],
  calculate: (input) =>
    calculateDottedNoteDurationCalculator({
      undottedSeconds: input.undottedSeconds as number,
    }),
});
export const dottedNoteDurationCalculatorTool = tool;
export const runDottedNoteDurationCalculator = tool.execute;
export default tool;
