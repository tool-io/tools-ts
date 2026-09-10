import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly independentlyMeasuredGroupDelaySeconds: number;
  readonly matchedReferenceGroupDelaySeconds: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyMeasuredGroupDelaySeconds",
    label: "Independently measured group delay seconds",
    kind: "number",
  },
  {
    id: "matchedReferenceGroupDelaySeconds",
    label: "Matched reference group delay seconds",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.independentlyMeasuredGroupDelaySeconds, "numerator");
  positive(input.matchedReferenceGroupDelaySeconds, "denominator");
  return {
    observedRatio:
      (1 * input.independentlyMeasuredGroupDelaySeconds) /
      input.matchedReferenceGroupDelaySeconds,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyMeasuredGroupDelaySeconds: 2,
    matchedReferenceGroupDelaySeconds: 4,
  },
  output: { result: { observedRatio: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/photonic-crystal-slow-light-factor",
  title: "Semiconductor Photonic Crystal Slow Light Factor Calculator",
  description:
    "Actual photonic-crystal slow-light group-delay enhancement relative to same path/reference convention, not phase index or an inferred bandwidth gain. Actual independently matched quantities/units required; not infer causal effect, clinical guidance or safe design.",
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
