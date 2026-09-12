import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  bounded,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualAmountMeq: number;
  readonly callerVerifiedSpeciesMolarMassGramsPerMole: number;
  readonly callerVerifiedAbsoluteChargeValence: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualAmountMeq", label: "Actual amount meq", kind: "number" },
  {
    id: "callerVerifiedSpeciesMolarMassGramsPerMole",
    label: "Caller verified species molar mass grams per mole",
    kind: "number",
  },
  {
    id: "callerVerifiedAbsoluteChargeValence",
    label: "Caller verified absolute charge valence",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.actualAmountMeq, "actualAmountMeq");
  positive(
    input.callerVerifiedSpeciesMolarMassGramsPerMole,
    "callerVerifiedSpeciesMolarMassGramsPerMole",
  );
  bounded(
    input.callerVerifiedAbsoluteChargeValence,
    "callerVerifiedAbsoluteChargeValence",
    1,
    1000000,
  );
  return {
    value:
      (input.actualAmountMeq *
        input.callerVerifiedSpeciesMolarMassGramsPerMole) /
      input.callerVerifiedAbsoluteChargeValence,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualAmountMeq: 2,
    callerVerifiedSpeciesMolarMassGramsPerMole: 50,
    callerVerifiedAbsoluteChargeValence: 2,
  },
  output: { result: { value: 50 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pharmacy/meq-to-mg-electrolyte-converter",
  title: "mEq to mg Electrolyte Converter",
  description:
    "DeclaredmEq\u2192mg species molar-mass/absolute valence, actual ion/salt basis must independently match; not infer counter ions, hydration or electrolyte prescription. All patient/product/route/units and applicable inputs independently clinically established; no dose, route, frequency, eligibility, titration, diagnosis or permission to administer is supplied.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
