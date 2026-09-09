import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualIndependentlyResolvedCosmogenicHelium3Concentration: number;
  readonly callerMatchedHelium3ProductionPerYear: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualIndependentlyResolvedCosmogenicHelium3Concentration",
    label: "Actual independently resolved cosmogenic helium3 concentration",
    kind: "number",
  },
  {
    id: "callerMatchedHelium3ProductionPerYear",
    label: "Caller matched helium3 production per year",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.actualIndependentlyResolvedCosmogenicHelium3Concentration,
    "numerator",
  );
  positive(input.callerMatchedHelium3ProductionPerYear, "denominator");
  return {
    observedRatio:
      (1 * input.actualIndependentlyResolvedCosmogenicHelium3Concentration) /
      input.callerMatchedHelium3ProductionPerYear,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualIndependentlyResolvedCosmogenicHelium3Concentration: 2,
    callerMatchedHelium3ProductionPerYear: 4,
  },
  output: { result: { observedRatio: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/cosmogenic-helium-3-age",
  title: "Geology Cosmogenic Helium 3 Age Calculator",
  description:
    "Stable cosmogenic helium-3 zero-initial-pool/noerosion age, N/P; noncosmogenic helium, shielding and matched production independently resolved. Actual independently matched quantities/units required; not infer causal effect, clinical guidance or safe design.",
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
