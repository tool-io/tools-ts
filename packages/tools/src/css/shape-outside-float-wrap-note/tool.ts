import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly isFloat: boolean;
  readonly callerShapeBoundsWidthPx: number;
  readonly callerShapeMarginPx: number;
}>;
export type Output = Readonly<{
  readonly conditionalWrapExtentPx: number;
  readonly shapeWrapEligible: boolean;
}>;
const inputFields = [
  { id: "isFloat", label: "Is float", kind: "boolean" },
  {
    id: "callerShapeBoundsWidthPx",
    label: "Caller shape bounds width px",
    kind: "number",
  },
  {
    id: "callerShapeMarginPx",
    label: "Caller shape margin px",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.callerShapeBoundsWidthPx, "callerShapeBoundsWidthPx");
  nonnegative(input.callerShapeMarginPx, "callerShapeMarginPx");
  return {
    conditionalWrapExtentPx: input.isFloat
      ? input.callerShapeBoundsWidthPx + 2 * input.callerShapeMarginPx
      : 0,
    shapeWrapEligible: input.isFloat,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  isFloat: true,
  callerShapeBoundsWidthPx: 100,
  callerShapeMarginPx: 10,
} satisfies Input;
export const exampleOutput = {
  conditionalWrapExtentPx: 120,
  shapeWrapEligible: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "css/shape-outside-float-wrap-note",
  title: "shape-outside Float Text-Wrap Note",
  description:
    "Supplied shape bounds and margin envelope for an explicitly floated element; shape-outside does not wrap around an arbitrary nonfloat, no curve text layout. Explicit supplied computed/layout context only; not a browser cascade/layout engine or cross-browser guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "conditionalWrapExtentPx",
      label: "Conditional wrap extent px",
      kind: "number",
    },
    { id: "shapeWrapEligible", label: "Shape wrap eligible", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      isFloat: value.isFloat as boolean,
      callerShapeBoundsWidthPx: value.callerShapeBoundsWidthPx as number,
      callerShapeMarginPx: value.callerShapeMarginPx as number,
    }),
});
export const run = tool.execute;
export default tool;
