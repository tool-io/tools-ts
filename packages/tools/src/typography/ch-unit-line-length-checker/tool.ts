import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly cssChLength: number;
  readonly measuredZeroGlyphAdvancePx: number;
  readonly measuredMeanTextGlyphAdvancePx: number;
  readonly callerExpectedCpl: number;
}>;
export type Output = Readonly<{
  readonly modeledLineWidthPx: number;
  readonly estimatedActualCharactersPerLine: number;
  readonly signedCplDeparture: number;
}>;
const inputFields = [
  { id: "cssChLength", label: "Css ch length", kind: "number" },
  {
    id: "measuredZeroGlyphAdvancePx",
    label: "Measured zero glyph advance px",
    kind: "number",
  },
  {
    id: "measuredMeanTextGlyphAdvancePx",
    label: "Measured mean text glyph advance px",
    kind: "number",
  },
  { id: "callerExpectedCpl", label: "Caller expected cpl", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.measuredZeroGlyphAdvancePx, "measuredZeroGlyphAdvancePx");
  positive(
    input.measuredMeanTextGlyphAdvancePx,
    "measuredMeanTextGlyphAdvancePx",
  );
  nonnegative(input.cssChLength, "cssChLength");
  nonnegative(input.callerExpectedCpl, "callerExpectedCpl");
  const width = input.cssChLength * input.measuredZeroGlyphAdvancePx,
    cpl = width / input.measuredMeanTextGlyphAdvancePx;
  return {
    modeledLineWidthPx: width,
    estimatedActualCharactersPerLine: cpl,
    signedCplDeparture: cpl - input.callerExpectedCpl,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  cssChLength: 60,
  measuredZeroGlyphAdvancePx: 10,
  measuredMeanTextGlyphAdvancePx: 5,
  callerExpectedCpl: 60,
} satisfies Input;
export const exampleOutput = {
  modeledLineWidthPx: 600,
  estimatedActualCharactersPerLine: 120,
  signedCplDeparture: 60,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "typography/ch-unit-line-length-checker",
  title: "ch Unit Line Length Checker",
  description:
    "Distinguish CSS ch (zero-glyph advance) from caller observed text mean advance and nominal CPL; unlike em/ch-width conversion, actual glyph calibration is explicit, not exact wrapping.",
  inputs: inputFields,
  outputs: [
    {
      id: "modeledLineWidthPx",
      label: "Modeled line width px",
      kind: "number",
    },
    {
      id: "estimatedActualCharactersPerLine",
      label: "Estimated actual characters per line",
      kind: "number",
    },
    { id: "signedCplDeparture", label: "Signed cpl departure", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      cssChLength: value.cssChLength as number,
      measuredZeroGlyphAdvancePx: value.measuredZeroGlyphAdvancePx as number,
      measuredMeanTextGlyphAdvancePx:
        value.measuredMeanTextGlyphAdvancePx as number,
      callerExpectedCpl: value.callerExpectedCpl as number,
    }),
});
export const run = tool.execute;
export default tool;
