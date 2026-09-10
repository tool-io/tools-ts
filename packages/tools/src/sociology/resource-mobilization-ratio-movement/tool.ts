import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, surveyRatio } from "../batch46-shared.js";
export type Input = Readonly<{
  readonly verifiedAvailableResourceUnits: readonly number[];
  readonly matchedDeclaredResourceNeedUnits: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "verifiedAvailableResourceUnits",
    label: "Verified available resource units",
    kind: "numberList",
  },
  {
    id: "matchedDeclaredResourceNeedUnits",
    label: "Matched declared resource need units",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return surveyRatio(
    input.verifiedAvailableResourceUnits,
    input.matchedDeclaredResourceNeedUnits,
    1,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    verifiedAvailableResourceUnits: [2, 4],
    matchedDeclaredResourceNeedUnits: [10, 20],
  },
  output: {
    result: {
      observedPooledRate: 0.2,
      observedNumeratorTotal: 6,
      observedDenominatorTotal: 30,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/resource-mobilization-ratio-movement",
  title: "Movement Resource Mobilization Ratio Calculator",
  description:
    "Movement resource-mobilization ratio on independently defined compatible units, not likelihood of success. Actual aligned same-period numerator/denominator strata, pooled by exposure not unweighted mean. Nonnegative counts/exposures and positive total denominator; overlapping strata must be independently resolved. No cohort representativeness, causation or eligibility inferred.",
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
