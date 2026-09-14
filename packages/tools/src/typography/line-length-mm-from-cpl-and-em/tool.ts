import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch52-shared.js";
export type Input = Readonly<{
  readonly charactersPerLine: number;
  readonly emMm: number;
  readonly measuredMeanAdvanceEm: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "charactersPerLine", label: "Characters per line", kind: "number" },
  { id: "emMm", label: "Em mm", kind: "number" },
  {
    id: "measuredMeanAdvanceEm",
    label: "Measured mean advance em",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  nonnegative(i.charactersPerLine, "cpl");
  positive(i.emMm, "em");
  positive(i.measuredMeanAdvanceEm, "advance");
  return {
    lineLengthMm: i.charactersPerLine * i.emMm * i.measuredMeanAdvanceEm,
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { charactersPerLine: 60, emMm: 4, measuredMeanAdvanceEm: 0.5 },
  output: { result: { lineLengthMm: 120 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "typography/line-length-mm-from-cpl-and-em",
  title: "Line Length mm From CPL and Em",
  description:
    "Line length from actual mean glyph advance in em and CPL, not a fixed half-em font assumption.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
