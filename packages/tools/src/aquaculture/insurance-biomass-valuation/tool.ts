import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualIndependentlyVerifiedCoveredBiomassKg: number;
  readonly callerPolicyVerifiedValuationMinorUnitsPerKg: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualIndependentlyVerifiedCoveredBiomassKg",
    label: "Actual independently verified covered biomass kg",
    kind: "number",
  },
  {
    id: "callerPolicyVerifiedValuationMinorUnitsPerKg",
    label: "Caller policy verified valuation minor units per kg",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  nonnegative(
    input.actualIndependentlyVerifiedCoveredBiomassKg,
    "actualIndependentlyVerifiedCoveredBiomassKg",
  );
  nonnegative(
    input.callerPolicyVerifiedValuationMinorUnitsPerKg,
    "callerPolicyVerifiedValuationMinorUnitsPerKg",
  );
  return {
    value:
      input.actualIndependentlyVerifiedCoveredBiomassKg *
      input.callerPolicyVerifiedValuationMinorUnitsPerKg,
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualIndependentlyVerifiedCoveredBiomassKg: 10,
    callerPolicyVerifiedValuationMinorUnitsPerKg: 2,
  },
  output: { result: { value: 20 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aquaculture/insurance-biomass-valuation",
  title: "Insurance Biomass Valuation Calculator",
  description:
    "Actual verified covered biomass\u00d7independent policy valuation rate, not market price or infer insurance coverage, compensation/claim approval or animal value from count alone.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { value: { type: "number" } },
        required: ["value"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
