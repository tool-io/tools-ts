import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly ellipsisGlyphAdvanceUnits: number;
  readonly periodGlyphAdvanceUnits: number;
  readonly measuredPeriodPairKernUnits: number;
  readonly unitsPerEm: number;
}>;
export type Output = Readonly<{
  readonly ellipsisAdvanceEm: number;
  readonly threePeriodsAdvanceEm: number;
  readonly signedEllipsisMinusPeriodsEm: number;
}>;
const inputFields = [
  {
    id: "ellipsisGlyphAdvanceUnits",
    label: "Ellipsis glyph advance units",
    kind: "number",
  },
  {
    id: "periodGlyphAdvanceUnits",
    label: "Period glyph advance units",
    kind: "number",
  },
  {
    id: "measuredPeriodPairKernUnits",
    label: "Measured period pair kern units",
    kind: "number",
  },
  { id: "unitsPerEm", label: "Units per em", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.unitsPerEm, "unitsPerEm");
  nonnegative(input.ellipsisGlyphAdvanceUnits, "ellipsisGlyphAdvanceUnits");
  nonnegative(input.periodGlyphAdvanceUnits, "periodGlyphAdvanceUnits");
  const three = nonnegative(
    3 * input.periodGlyphAdvanceUnits + 2 * input.measuredPeriodPairKernUnits,
    "periodsAdvance",
  );
  return {
    ellipsisAdvanceEm: input.ellipsisGlyphAdvanceUnits / input.unitsPerEm,
    threePeriodsAdvanceEm: three / input.unitsPerEm,
    signedEllipsisMinusPeriodsEm:
      (input.ellipsisGlyphAdvanceUnits - three) / input.unitsPerEm,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  ellipsisGlyphAdvanceUnits: 800,
  periodGlyphAdvanceUnits: 250,
  measuredPeriodPairKernUnits: -10,
  unitsPerEm: 1000,
} satisfies Input;
export const exampleOutput = {
  ellipsisAdvanceEm: 0.8,
  threePeriodsAdvanceEm: 0.73,
  signedEllipsisMinusPeriodsEm: 0.07,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "typography/ellipsis-character-vs-three-periods-width",
  title: "Ellipsis vs Three Periods Width Compare",
  description:
    "Compare measured ellipsis glyph versus three periods including both pair-kerning adjustments and font units; no assumed glyph equivalence or font lookup.",
  inputs: inputFields,
  outputs: [
    { id: "ellipsisAdvanceEm", label: "Ellipsis advance em", kind: "number" },
    {
      id: "threePeriodsAdvanceEm",
      label: "Three periods advance em",
      kind: "number",
    },
    {
      id: "signedEllipsisMinusPeriodsEm",
      label: "Signed ellipsis minus periods em",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      ellipsisGlyphAdvanceUnits: value.ellipsisGlyphAdvanceUnits as number,
      periodGlyphAdvanceUnits: value.periodGlyphAdvanceUnits as number,
      measuredPeriodPairKernUnits: value.measuredPeriodPairKernUnits as number,
      unitsPerEm: value.unitsPerEm as number,
    }),
});
export const run = tool.execute;
export default tool;
