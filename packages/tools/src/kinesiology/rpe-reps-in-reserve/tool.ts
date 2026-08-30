import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly exertionRating: number;
  readonly scaleMaximum: number;
}>;
export type Output = Readonly<{
  readonly repsInReserveEstimate: number;
}>;
export const calculate = (input: Input): Output => {
  if (
    input.scaleMaximum <= 0 ||
    input.exertionRating < 0 ||
    input.exertionRating > input.scaleMaximum
  )
    simpleError(
      "exertionRating",
      "RPE must lie within the positive caller-specified scale.",
    );
  return { repsInReserveEstimate: input.scaleMaximum - input.exertionRating };
};
export const exampleInput = {
  exertionRating: 8,
  scaleMaximum: 10,
} satisfies Input;
export const exampleOutput = { repsInReserveEstimate: 2 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/rpe-reps-in-reserve",
  title: "RPE Reps In Reserve",
  description:
    "Convert a strength-set RPE rating to estimated reps in reserve on a chosen scale.",
  inputs: [
    { id: "exertionRating", label: "Exertion rating", kind: "number" },
    { id: "scaleMaximum", label: "Scale maximum", kind: "number" },
  ],
  outputs: [
    {
      id: "repsInReserveEstimate",
      label: "Reps in reserve estimate",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      exertionRating: value.exertionRating as number,
      scaleMaximum: value.scaleMaximum as number,
    }),
});
export const run = tool.execute;
export default tool;
