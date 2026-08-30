import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TupletRatioDurationCalculatorInput = Readonly<{
  readonly normalNoteSeconds: number;
  readonly normalNotesInSpan: number;
  readonly tupletNoteCount: number;
}>;
export type TupletRatioDurationCalculatorOutput = Readonly<{
  readonly tupletNoteSeconds: number;
}>;

export const calculateTupletRatioDurationCalculator = (
  x: TupletRatioDurationCalculatorInput,
): TupletRatioDurationCalculatorOutput => {
  if (!Number.isFinite(x.normalNoteSeconds) || x.normalNoteSeconds <= 0)
    simpleError("normalNoteSeconds", "Provide a finite positive number.");
  if (
    !Number.isFinite(x.normalNotesInSpan) ||
    !Number.isSafeInteger(x.normalNotesInSpan) ||
    x.normalNotesInSpan < 1
  )
    simpleError("normalNotesInSpan", "Provide a positive safe integer.");
  if (
    !Number.isFinite(x.tupletNoteCount) ||
    !Number.isSafeInteger(x.tupletNoteCount) ||
    x.tupletNoteCount < 1
  )
    simpleError("tupletNoteCount", "Provide a positive safe integer.");
  const tupletNoteSeconds =
    (x.normalNoteSeconds * x.normalNotesInSpan) / x.tupletNoteCount;
  if (!Number.isFinite(tupletNoteSeconds))
    simpleError(
      "tupletNoteSeconds",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    tupletNoteSeconds: Object.is(tupletNoteSeconds, -0) ? 0 : tupletNoteSeconds,
  };
};

export const example = {
  input: {
    normalNoteSeconds: 0.5,
    normalNotesInSpan: 2,
    tupletNoteCount: 3,
  },
  output: { tupletNoteSeconds: 0.3333333333333333 },
} satisfies ToolExample<
  TupletRatioDurationCalculatorInput,
  TupletRatioDurationCalculatorOutput
>;

export const tool = createSimpleTool({
  id: "music/tuplet-ratio-duration-calculator",
  title: "Tuplet Ratio Duration Calculator",
  description:
    "Duration of one tuplet note: a normal note duration times the number of normal notes in the span divided by tuplet note count.",
  inputs: [
    {
      id: "normalNoteSeconds",
      kind: "number",
      label: "Normal Note Seconds",
      unit: "s",
      minimum: 0,
    },
    {
      id: "normalNotesInSpan",
      kind: "integer",
      label: "Normal Notes In Span",
      minimum: 1,
    },
    {
      id: "tupletNoteCount",
      kind: "integer",
      label: "Tuplet Note Count",
      minimum: 1,
    },
  ],
  outputs: [
    {
      id: "tupletNoteSeconds",
      kind: "number",
      label: "Tuplet Note Seconds",
      unit: "s",
    },
  ],
  calculate: (input) =>
    calculateTupletRatioDurationCalculator({
      normalNoteSeconds: input.normalNoteSeconds as number,
      normalNotesInSpan: input.normalNotesInSpan as number,
      tupletNoteCount: input.tupletNoteCount as number,
    }),
});
export const tupletRatioDurationCalculatorTool = tool;
export const runTupletRatioDurationCalculator = tool.execute;
export default tool;
