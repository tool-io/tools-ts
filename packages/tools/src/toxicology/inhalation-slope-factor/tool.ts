import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly callerIndependentlyValidatedInhalationRiskScreen: number;
  readonly matchedInhaledLifetimeDose: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerIndependentlyValidatedInhalationRiskScreen",
    label: "Caller independently validated inhalation risk screen",
    kind: "number",
  },
  {
    id: "matchedInhaledLifetimeDose",
    label: "Matched inhaled lifetime dose",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.callerIndependentlyValidatedInhalationRiskScreen,
    "numerator",
  );
  positive(input.matchedInhaledLifetimeDose, "denominator");
  return {
    observedRatio:
      (1 * input.callerIndependentlyValidatedInhalationRiskScreen) /
      input.matchedInhaledLifetimeDose,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerIndependentlyValidatedInhalationRiskScreen: 2,
    matchedInhaledLifetimeDose: 4,
  },
  output: { result: { observedRatio: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "toxicology/inhalation-slope-factor",
  title: "Inhalation Slope Factor Calculator",
  description:
    "Inhalation-route dose-slope coefficient extraction only, not reuse oral slope or infer cross-route equivalence. Actual independently matched quantities/units required; not infer causal effect, clinical guidance or safe design.",
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
