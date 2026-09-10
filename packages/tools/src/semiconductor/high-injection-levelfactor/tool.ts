import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly independentlyMeasuredExcessMinorityCarrierDensity: number;
  readonly matchedEquilibriumMajorityCarrierDensity: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyMeasuredExcessMinorityCarrierDensity",
    label: "Independently measured excess minority carrier density",
    kind: "number",
  },
  {
    id: "matchedEquilibriumMajorityCarrierDensity",
    label: "Matched equilibrium majority carrier density",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.independentlyMeasuredExcessMinorityCarrierDensity,
    "numerator",
  );
  positive(input.matchedEquilibriumMajorityCarrierDensity, "denominator");
  return {
    observedRatio:
      (1 * input.independentlyMeasuredExcessMinorityCarrierDensity) /
      input.matchedEquilibriumMajorityCarrierDensity,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyMeasuredExcessMinorityCarrierDensity: 2,
    matchedEquilibriumMajorityCarrierDensity: 4,
  },
  output: { result: { observedRatio: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/high-injection-levelfactor",
  title: "Semiconductor High Injection Levelfactor Calculator",
  description:
    "Actual high-injection excess/minority-to-equilibrium-majority density indicator, not device operating eligibility. Actual independently matched quantities/units required; not infer causal effect, clinical guidance or safe design.",
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
