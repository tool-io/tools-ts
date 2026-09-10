import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualTransientEnhancedDiffusivity: number;
  readonly matchedEquilibriumDiffusivity: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualTransientEnhancedDiffusivity",
    label: "Actual transient enhanced diffusivity",
    kind: "number",
  },
  {
    id: "matchedEquilibriumDiffusivity",
    label: "Matched equilibrium diffusivity",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.actualTransientEnhancedDiffusivity, "numerator");
  positive(input.matchedEquilibriumDiffusivity, "denominator");
  return {
    observedRatio:
      (1 * input.actualTransientEnhancedDiffusivity) /
      input.matchedEquilibriumDiffusivity,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualTransientEnhancedDiffusivity: 2,
    matchedEquilibriumDiffusivity: 4,
  },
  output: { result: { observedRatio: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/transient-enhanced-diffusion-factor",
  title: "Semiconductor Transient Enhanced Diffusion Factor Calculator",
  description:
    "Actual matched transient-enhancement diffusivity factor, not assume universal transient defect kinetics. Actual independently matched quantities/units required; not infer causal effect, clinical guidance or safe design.",
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
