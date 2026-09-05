import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch41-shared.js";
export type Input = Readonly<{ readonly observedColumnDepthPicas: number }>;
export type Output = Readonly<{ readonly traditionalAgateLineDepth: number }>;
const inputFields = [
  {
    id: "observedColumnDepthPicas",
    label: "Observed column depth picas",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.observedColumnDepthPicas, "observedColumnDepthPicas");
  return {
    traditionalAgateLineDepth: (input.observedColumnDepthPicas * 7) / 3,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { observedColumnDepthPicas: 7 } satisfies Input;
export const exampleOutput = {
  traditionalAgateLineDepth: 49 / 3,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "journalism/pica-agate-line-depth-measure-converter",
  title: "Pica Agate Line Depth Measure Converter",
  description:
    "Traditional nominal agate 14 lines/inch vs pica 6/inch conversion, not actual selected font leading or word density. Caller independently verifies context, evidence, reference edition and applicability; not factual authenticity, current legal advice or publication clearance.",
  inputs: inputFields,
  outputs: [
    {
      id: "traditionalAgateLineDepth",
      label: "Traditional agate line depth",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedColumnDepthPicas: value.observedColumnDepthPicas as number,
    }),
});
export const run = tool.execute;
export default tool;
