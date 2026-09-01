import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../shared.js";
export type Input = Readonly<{
  readonly bodyFontSizePx: number;
  readonly bodyXHeightUnits: number;
  readonly bodyUnitsPerEm: number;
  readonly codeXHeightUnits: number;
  readonly codeUnitsPerEm: number;
}>;
export type Output = Readonly<{
  readonly bodyVisibleXHeightPx: number;
  readonly matchedCodeFontSizePx: number;
  readonly codeToBodySizeRatio: number;
}>;
const inputFields = [
  { id: "bodyFontSizePx", label: "Body font size px", kind: "number" },
  { id: "bodyXHeightUnits", label: "Body x height units", kind: "number" },
  { id: "bodyUnitsPerEm", label: "Body units per em", kind: "number" },
  { id: "codeXHeightUnits", label: "Code x height units", kind: "number" },
  { id: "codeUnitsPerEm", label: "Code units per em", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.bodyFontSizePx, "bodyFontSizePx");
  positive(input.bodyXHeightUnits, "bodyXHeightUnits");
  positive(input.bodyUnitsPerEm, "bodyUnitsPerEm");
  positive(input.codeXHeightUnits, "codeXHeightUnits");
  positive(input.codeUnitsPerEm, "codeUnitsPerEm");
  const h =
      (input.bodyFontSizePx * input.bodyXHeightUnits) / input.bodyUnitsPerEm,
    size = (h * input.codeUnitsPerEm) / input.codeXHeightUnits;
  return {
    bodyVisibleXHeightPx: h,
    matchedCodeFontSizePx: size,
    codeToBodySizeRatio: size / input.bodyFontSizePx,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  bodyFontSizePx: 16,
  bodyXHeightUnits: 500,
  bodyUnitsPerEm: 1000,
  codeXHeightUnits: 450,
  codeUnitsPerEm: 1000,
} satisfies Input;
export const exampleOutput = {
  bodyVisibleXHeightPx: 8,
  matchedCodeFontSizePx: 17.77777777777778,
  codeToBodySizeRatio: 1.1111111111111112,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "typography/code-inline-monospace-size-match-xheight",
  title: "Inline Code Monospace x-Height Match",
  description:
    "Match inline-code and body actual x-height from independent font-unit metrics; not generic em conversion or assurance of equal stroke weight/baseline/cap height.",
  inputs: inputFields,
  outputs: [
    {
      id: "bodyVisibleXHeightPx",
      label: "Body visible x height px",
      kind: "number",
    },
    {
      id: "matchedCodeFontSizePx",
      label: "Matched code font size px",
      kind: "number",
    },
    {
      id: "codeToBodySizeRatio",
      label: "Code to body size ratio",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      bodyFontSizePx: value.bodyFontSizePx as number,
      bodyXHeightUnits: value.bodyXHeightUnits as number,
      bodyUnitsPerEm: value.bodyUnitsPerEm as number,
      codeXHeightUnits: value.codeXHeightUnits as number,
      codeUnitsPerEm: value.codeUnitsPerEm as number,
    }),
});
export const run = tool.execute;
export default tool;
