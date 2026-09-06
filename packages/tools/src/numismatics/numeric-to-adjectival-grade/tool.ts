import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  pick,
  bounded,
  gradeTable,
} from "../batch45-shared.js";
export type Input = Readonly<{
  readonly numericGrade: number;
  readonly callerVerifiedStrikeFamily: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "numericGrade", label: "Numeric grade", kind: "number" },
  {
    id: "callerVerifiedStrikeFamily",
    label: "Caller verified strike family",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(input.numericGrade, "grade", 1, 70);
  if (!["business", "proof"].includes(input.callerVerifiedStrikeFamily))
    simpleError(
      "strike",
      "Independently verified business/proof strike family.",
    );
  const band = pick(String(input.numericGrade), gradeTable, "grade");
  return {
    adjectivalBand:
      input.numericGrade >= 60 && input.callerVerifiedStrikeFamily === "proof"
        ? "Proof, uncirculated-wear-state numeric range"
        : band,
    strikeFamily: input.callerVerifiedStrikeFamily,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { numericGrade: 12, callerVerifiedStrikeFamily: "business" },
  output: { result: { adjectivalBand: "Fine", strikeFamily: "business" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "numismatics/numeric-to-adjectival-grade",
  title: "Numeric to Adjectival Grade Converter",
  description:
    "Convert a supported numeric grade and independently established business/proof family to a wear-state label. Proof is a manufacture designation, not automatically Mint State or perfect; unsupported numbers rejected.",
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
