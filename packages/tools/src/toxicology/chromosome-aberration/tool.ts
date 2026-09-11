import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  positive,
  nonnegative,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualIndependentlyClassifiedAberrantMetaphases: number;
  readonly actualAssessedEligibleMetaphases: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualIndependentlyClassifiedAberrantMetaphases",
    label: "Actual independently classified aberrant metaphases",
    kind: "number",
  },
  {
    id: "actualAssessedEligibleMetaphases",
    label: "Actual assessed eligible metaphases",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(
    input.actualAssessedEligibleMetaphases,
    "eligible-count",
    1,
    10000000,
  );
  bounded(
    input.actualIndependentlyClassifiedAberrantMetaphases,
    "qualified-count",
    0,
    input.actualAssessedEligibleMetaphases,
  );
  nonnegative(
    input.actualIndependentlyClassifiedAberrantMetaphases,
    "numerator",
  );
  positive(input.actualAssessedEligibleMetaphases, "denominator");
  return {
    observedRatio:
      (100 * input.actualIndependentlyClassifiedAberrantMetaphases) /
      input.actualAssessedEligibleMetaphases,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualIndependentlyClassifiedAberrantMetaphases: 2,
    actualAssessedEligibleMetaphases: 4,
  },
  output: { result: { observedRatio: 50.0 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "toxicology/chromosome-aberration",
  title: "Chromosome Aberration Calculator",
  description:
    "Actual independently aberrant metaphase frequency, not number of individual chromosome aberrations. Actual independently matched quantities/units required; not infer causal effect, clinical guidance or safe design.",
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
