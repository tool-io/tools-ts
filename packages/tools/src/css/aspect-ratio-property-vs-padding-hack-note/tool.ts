import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly definiteWidthPx: number;
  readonly ratioWidth: number;
  readonly ratioHeight: number;
  readonly containingBlockWidthPx: number;
}>;
export type Output = Readonly<{
  readonly aspectRatioHeightPx: number;
  readonly paddingHackHeightPx: number;
}>;
const inputFields = [
  { id: "definiteWidthPx", label: "Definite width px", kind: "number" },
  { id: "ratioWidth", label: "Ratio width", kind: "number" },
  { id: "ratioHeight", label: "Ratio height", kind: "number" },
  {
    id: "containingBlockWidthPx",
    label: "Containing block width px",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.ratioWidth, "ratioWidth");
  positive(input.ratioHeight, "ratioHeight");
  nonnegative(input.definiteWidthPx, "definiteWidthPx");
  nonnegative(input.containingBlockWidthPx, "containingBlockWidthPx");
  return {
    aspectRatioHeightPx:
      (input.definiteWidthPx * input.ratioHeight) / input.ratioWidth,
    paddingHackHeightPx:
      (input.containingBlockWidthPx * input.ratioHeight) / input.ratioWidth,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  definiteWidthPx: 200,
  ratioWidth: 16,
  ratioHeight: 9,
  containingBlockWidthPx: 300,
} satisfies Input;
export const exampleOutput = {
  aspectRatioHeightPx: 112.5,
  paddingHackHeightPx: 168.75,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "css/aspect-ratio-property-vs-padding-hack-note",
  title: "aspect-ratio Property vs Padding-Hack Note",
  description:
    "Compare explicit-width preferred aspect-ratio height with percentage-padding hack referencing containing-block width; constraints/replaced-element ratio behavior excluded. Explicit supplied computed/layout context only; not a browser cascade/layout engine or cross-browser guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "aspectRatioHeightPx",
      label: "Aspect ratio height px",
      kind: "number",
    },
    {
      id: "paddingHackHeightPx",
      label: "Padding hack height px",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      definiteWidthPx: value.definiteWidthPx as number,
      ratioWidth: value.ratioWidth as number,
      ratioHeight: value.ratioHeight as number,
      containingBlockWidthPx: value.containingBlockWidthPx as number,
    }),
});
export const run = tool.execute;
export default tool;
