import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly inseamCm: number;
  readonly saddleHeightFactor: number;
}>;
export type Output = Readonly<{
  readonly saddleHeightCm: number;
}>;
export const calculate = (input: Input): Output => {
  if (input.inseamCm <= 0 || input.saddleHeightFactor <= 0)
    simpleError(
      "inseamCm",
      "Positive inseam and caller-selected saddle-height factor required.",
    );
  return { saddleHeightCm: input.inseamCm * input.saddleHeightFactor };
};
export const exampleInput = {
  inseamCm: 80,
  saddleHeightFactor: 0.883,
} satisfies Input;
export const exampleOutput = { saddleHeightCm: 70.64 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/bike-saddle-inseam-fit",
  title: "Bike Saddle Inseam Fit",
  description:
    "Estimate saddle height from inseam and a caller-selected fitting factor.",
  inputs: [
    { id: "inseamCm", label: "Inseam cm", kind: "number" },
    { id: "saddleHeightFactor", label: "Saddle height factor", kind: "number" },
  ],
  outputs: [
    { id: "saddleHeightCm", label: "Saddle height cm", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      inseamCm: value.inseamCm as number,
      saddleHeightFactor: value.saddleHeightFactor as number,
    }),
});
export const run = tool.execute;
export default tool;
