import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  gradeTable,
} from "../batch45-shared.js";
export type Input = Readonly<{ readonly adjectivalBand: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "adjectivalBand", label: "Adjectival band", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (!Object.values(gradeTable).includes(input.adjectivalBand))
    simpleError("grade", "Exact published adjectival band key.");
  return {
    recognizedNumericGrades: Object.entries(gradeTable)
      .filter(([, v]) => v === input.adjectivalBand)
      .map(([k]) => Number(k)),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { adjectivalBand: "Good" },
  output: { result: { recognizedNumericGrades: [4, 6] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "numismatics/adjectival-to-numeric-grade",
  title: "Adjectival to Numeric Grade Converter",
  description:
    "Convert an exact bounded adjectival band to all supported numeric grades, retaining ambiguity instead of inventing a unique Sheldon grade. Strike/service context is caller verified; not grading or authentication.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
