import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly independentlyCountedGeneratedExcitons: number;
  readonly actualAbsorbedPhotonCount: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyCountedGeneratedExcitons",
    label: "Independently counted generated excitons",
    kind: "number",
  },
  {
    id: "actualAbsorbedPhotonCount",
    label: "Actual absorbed photon count",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.independentlyCountedGeneratedExcitons, "numerator");
  positive(input.actualAbsorbedPhotonCount, "denominator");
  return {
    observedRatio:
      (1 * input.independentlyCountedGeneratedExcitons) /
      input.actualAbsorbedPhotonCount,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyCountedGeneratedExcitons: 2,
    actualAbsorbedPhotonCount: 4,
  },
  output: { result: { observedRatio: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/multiple-exciton-generation-quantum-yield",
  title: "Semiconductor Multiple Exciton Generation Quantum Yield Calculator",
  description:
    "Actual multiple-exciton-generation exciton-per-absorbed-photon quantum yield; can exceed1. Actual independently matched quantities/units required; not infer causal effect, clinical guidance or safe design.",
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
