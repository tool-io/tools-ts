import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly unitlessLineHeight: number;
  readonly parentFontPx: number;
  readonly childFontPx: number;
}>;
export type Output = Readonly<{
  readonly parentLineBoxPx: number;
  readonly inheritedChildLineBoxPx: number;
  readonly fixedParentLengthInheritedPx: number;
}>;
const inputFields = [
  { id: "unitlessLineHeight", label: "Unitless line height", kind: "number" },
  { id: "parentFontPx", label: "Parent font px", kind: "number" },
  { id: "childFontPx", label: "Child font px", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.parentFontPx, "parentFontPx");
  positive(input.childFontPx, "childFontPx");
  nonnegative(input.unitlessLineHeight, "unitlessLineHeight");
  return {
    parentLineBoxPx: input.unitlessLineHeight * input.parentFontPx,
    inheritedChildLineBoxPx: input.unitlessLineHeight * input.childFontPx,
    fixedParentLengthInheritedPx: input.unitlessLineHeight * input.parentFontPx,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  unitlessLineHeight: 1.5,
  parentFontPx: 20,
  childFontPx: 10,
} satisfies Input;
export const exampleOutput = {
  parentLineBoxPx: 30,
  inheritedChildLineBoxPx: 15,
  fixedParentLengthInheritedPx: 30,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "css/unitless-line-height-recommendation-lookup",
  title: "Unitless line-height Recommendation Lookup",
  description:
    "Unitless line-height inherited number recomputes with child font; contrast fixed parent used length, not specified universal 1.5 recommendation. Explicit supplied computed/layout context only; not a browser cascade/layout engine or cross-browser guarantee.",
  inputs: inputFields,
  outputs: [
    { id: "parentLineBoxPx", label: "Parent line box px", kind: "number" },
    {
      id: "inheritedChildLineBoxPx",
      label: "Inherited child line box px",
      kind: "number",
    },
    {
      id: "fixedParentLengthInheritedPx",
      label: "Fixed parent length inherited px",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      unitlessLineHeight: value.unitlessLineHeight as number,
      parentFontPx: value.parentFontPx as number,
      childFontPx: value.childFontPx as number,
    }),
});
export const run = tool.execute;
export default tool;
