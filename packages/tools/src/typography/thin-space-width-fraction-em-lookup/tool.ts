import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch52-shared.js";
export type Input = Readonly<{
  readonly measuredGlyphAdvanceUnits: number;
  readonly unitsPerEm: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "measuredGlyphAdvanceUnits",
    label: "Measured glyph advance units",
    kind: "number",
  },
  { id: "unitsPerEm", label: "Units per em", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  nonnegative(i.measuredGlyphAdvanceUnits, "advance");
  positive(i.unitsPerEm, "upem");
  return { measuredFractionEm: i.measuredGlyphAdvanceUnits / i.unitsPerEm };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { measuredGlyphAdvanceUnits: 250, unitsPerEm: 1000 },
  output: { result: { measuredFractionEm: 0.25 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "typography/thin-space-width-fraction-em-lookup",
  title: "Thin Space Fraction of Em Lookup",
  description:
    "Measured thin space advance/em ratio; Unicode does not impose one font-independent width.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { measuredFractionEm: { type: "number" } },
        required: ["measuredFractionEm"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
