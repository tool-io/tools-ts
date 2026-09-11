import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly callerSiteSpecificPredictedEnvironmentalConcentration: number;
  readonly callerIndependentlyApplicablePnec: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerSiteSpecificPredictedEnvironmentalConcentration",
    label: "Caller site specific predicted environmental concentration",
    kind: "number",
  },
  {
    id: "callerIndependentlyApplicablePnec",
    label: "Caller independently applicable pnec",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.callerSiteSpecificPredictedEnvironmentalConcentration,
    "numerator",
  );
  positive(input.callerIndependentlyApplicablePnec, "denominator");
  return {
    observedRatio:
      (1 * input.callerSiteSpecificPredictedEnvironmentalConcentration) /
      input.callerIndependentlyApplicablePnec,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerSiteSpecificPredictedEnvironmentalConcentration: 2,
    callerIndependentlyApplicablePnec: 4,
  },
  output: { result: { observedRatio: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "toxicology/pec-pnec-ratio",
  title: "PEC-PNEC Ratio Calculator",
  description:
    "Independently matched PEC/PNEC risk-screen ratio, not probability, safe concentration or an authoritative PNEC derivation. Actual independently matched quantities/units required; not infer causal effect, clinical guidance or safe design.",
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
