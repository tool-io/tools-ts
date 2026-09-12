import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, bounded } from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualObservedSpikeCount: number;
  readonly actualObservedExposureSeconds: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualObservedSpikeCount",
    label: "Actual observed spike count",
    kind: "number",
  },
  {
    id: "actualObservedExposureSeconds",
    label: "Actual observed exposure seconds",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(
    input.actualObservedSpikeCount,
    "actualObservedSpikeCount",
    0,
    1000000,
  );
  positive(
    input.actualObservedExposureSeconds,
    "actualObservedExposureSeconds",
  );
  return {
    value: input.actualObservedSpikeCount / input.actualObservedExposureSeconds,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualObservedSpikeCount: 4, actualObservedExposureSeconds: 2 },
  output: { result: { value: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/mean-firing-rate",
  title: "Mean Firing Rate Calculator",
  description:
    "Mean fir ingrate ALL actual observed spikes/complete observation seconds. Actual independently matched observations/units and protocol, not diagnosis, causal mechanism, clinical decision or validated individual prediction.",
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
