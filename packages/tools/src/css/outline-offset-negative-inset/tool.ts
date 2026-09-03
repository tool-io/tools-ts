import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedOutlineOffsetPx: number;
  readonly observedOutlineWidthPx: number;
}>;
export type Output = Readonly<{
  readonly outerOutlineEdgeRelativeBorderPx: number;
  readonly innerOutlineEdgeRelativeBorderPx: number;
}>;
const inputFields = [
  {
    id: "observedOutlineOffsetPx",
    label: "Observed outline offset px",
    kind: "number",
  },
  {
    id: "observedOutlineWidthPx",
    label: "Observed outline width px",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.observedOutlineWidthPx, "observedOutlineWidthPx");
  return {
    outerOutlineEdgeRelativeBorderPx:
      input.observedOutlineOffsetPx + input.observedOutlineWidthPx,
    innerOutlineEdgeRelativeBorderPx: input.observedOutlineOffsetPx,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedOutlineOffsetPx: -2,
  observedOutlineWidthPx: 1,
} satisfies Input;
export const exampleOutput = {
  outerOutlineEdgeRelativeBorderPx: -1,
  innerOutlineEdgeRelativeBorderPx: -2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "css/outline-offset-negative-inset",
  title: "outline-offset Negative Inset Ring",
  description:
    "Signed nominal outline edge locations from offset/width, negative offsets inset; browser outline shape/overlap and box geometry not inferred. Explicit supplied computed/layout context only; not a browser cascade/layout engine or cross-browser guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "outerOutlineEdgeRelativeBorderPx",
      label: "Outer outline edge relative border px",
      kind: "number",
    },
    {
      id: "innerOutlineEdgeRelativeBorderPx",
      label: "Inner outline edge relative border px",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedOutlineOffsetPx: value.observedOutlineOffsetPx as number,
      observedOutlineWidthPx: value.observedOutlineWidthPx as number,
    }),
});
export const run = tool.execute;
export default tool;
