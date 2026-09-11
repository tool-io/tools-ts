import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualIndependentlyAssessedAbsorbedMass: number;
  readonly actualAdministeredMass: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualIndependentlyAssessedAbsorbedMass",
    label: "Actual independently assessed absorbed mass",
    kind: "number",
  },
  {
    id: "actualAdministeredMass",
    label: "Actual administered mass",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.actualIndependentlyAssessedAbsorbedMass, "numerator");
  positive(input.actualAdministeredMass, "denominator");
  return {
    observedRatio:
      (1 * input.actualIndependentlyAssessedAbsorbedMass) /
      input.actualAdministeredMass,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualIndependentlyAssessedAbsorbedMass: 2,
    actualAdministeredMass: 4,
  },
  output: { result: { observedRatio: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "toxicology/adme-absorption-fraction",
  title: "Absorption Fraction Calculator",
  description:
    "Actual independently assessed absorbed/administered mass fraction, not oral AUCbioavailability or route toxicity. Actual independently matched quantities/units required; not infer causal effect, clinical guidance or safe design.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
