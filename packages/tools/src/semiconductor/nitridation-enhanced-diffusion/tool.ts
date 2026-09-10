import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualNitridationDiffusivity: number;
  readonly matchedUnnitridatedDiffusivity: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualNitridationDiffusivity",
    label: "Actual nitridation diffusivity",
    kind: "number",
  },
  {
    id: "matchedUnnitridatedDiffusivity",
    label: "Matched unnitridated diffusivity",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.actualNitridationDiffusivity, "numerator");
  positive(input.matchedUnnitridatedDiffusivity, "denominator");
  return {
    observedRatio:
      (1 * input.actualNitridationDiffusivity) /
      input.matchedUnnitridatedDiffusivity,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualNitridationDiffusivity: 2, matchedUnnitridatedDiffusivity: 4 },
  output: { result: { observedRatio: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/nitridation-enhanced-diffusion",
  title: "Semiconductor Nitridation Enhanced Diffusion Calculator",
  description:
    "Actual matched nitridation diffusivity enhancement, not a universal process factor. Actual independently matched quantities/units required; not infer causal effect, clinical guidance or safe design.",
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
