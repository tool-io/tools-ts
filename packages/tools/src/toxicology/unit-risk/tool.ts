import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly callerIndependentlyEstablishedExcessRiskScreen: number;
  readonly matchedIndependentlyAssessedConcentration: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerIndependentlyEstablishedExcessRiskScreen",
    label: "Caller independently established excess risk screen",
    kind: "number",
  },
  {
    id: "matchedIndependentlyAssessedConcentration",
    label: "Matched independently assessed concentration",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.callerIndependentlyEstablishedExcessRiskScreen,
    "numerator",
  );
  positive(input.matchedIndependentlyAssessedConcentration, "denominator");
  return {
    observedRatio:
      (1 * input.callerIndependentlyEstablishedExcessRiskScreen) /
      input.matchedIndependentlyAssessedConcentration,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerIndependentlyEstablishedExcessRiskScreen: 2,
    matchedIndependentlyAssessedConcentration: 4,
  },
  output: { result: { observedRatio: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "toxicology/unit-risk",
  title: "Unit Risk Calculator",
  description:
    "Empirical risk-screen/concentration unit-risk coefficient extraction, not assigning toxic potency from one unvalidated exposure scenario. Actual independently matched quantities/units required; not infer causal effect, clinical guidance or safe design.",
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
