import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, integer } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly intrinsicPixelWidth: number;
  readonly renderedWidthPx: number;
}>;
export type Output = Readonly<{
  readonly scaleFactor: number;
  readonly uniformIntegerPixelScale: boolean;
}>;
const inputFields = [
  { id: "intrinsicPixelWidth", label: "Intrinsic pixel width", kind: "number" },
  { id: "renderedWidthPx", label: "Rendered width px", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.intrinsicPixelWidth, "intrinsicPixelWidth");
  positive(input.renderedWidthPx, "renderedWidthPx");
  integer(input.intrinsicPixelWidth, "intrinsic pixel width");
  const s = input.renderedWidthPx / input.intrinsicPixelWidth;
  return { scaleFactor: s, uniformIntegerPixelScale: Number.isInteger(s) };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  intrinsicPixelWidth: 10,
  renderedWidthPx: 25,
} satisfies Input;
export const exampleOutput = {
  scaleFactor: 2.5,
  uniformIntegerPixelScale: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "css/image-rendering-pixelated-integer-scale",
  title: "image-rendering:pixelated Integer Scale Note",
  description:
    "Observed geometric integer magnification check; image-rendering:pixelated can operate at noninteger scales and does not require exact integer zoom. Explicit supplied computed/layout context only; not a browser cascade/layout engine or cross-browser guarantee.",
  inputs: inputFields,
  outputs: [
    { id: "scaleFactor", label: "Scale factor", kind: "number" },
    {
      id: "uniformIntegerPixelScale",
      label: "Uniform integer pixel scale",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      intrinsicPixelWidth: value.intrinsicPixelWidth as number,
      renderedWidthPx: value.renderedWidthPx as number,
    }),
});
export const run = tool.execute;
export default tool;
