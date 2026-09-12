import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, bounded } from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualIndependentlyQualifiedMiniEventCount: number;
  readonly actualMatchedMiniObservationSeconds: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualIndependentlyQualifiedMiniEventCount",
    label: "Actual independently qualified mini event count",
    kind: "number",
  },
  {
    id: "actualMatchedMiniObservationSeconds",
    label: "Actual matched mini observation seconds",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(
    input.actualIndependentlyQualifiedMiniEventCount,
    "actualIndependentlyQualifiedMiniEventCount",
    0,
    1000000,
  );
  positive(
    input.actualMatchedMiniObservationSeconds,
    "actualMatchedMiniObservationSeconds",
  );
  return {
    value:
      (1 * input.actualIndependentlyQualifiedMiniEventCount) /
      input.actualMatchedMiniObservationSeconds,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualIndependentlyQualifiedMiniEventCount: 2,
    actualMatchedMiniObservationSeconds: 4,
  },
  output: { result: { value: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/mini-frequency-neuro",
  title: "Mini Frequency Calculator",
  description:
    "Miniature post synaptic event frequency actual qualified events/exposure; actual compatible definitions and matching units required, no causal efficacy/diagnosis or safety claim.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
