import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError, sum } from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualSpikePhasesRadians: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualSpikePhasesRadians",
    label: "Actual spike phases radians",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (!input.actualSpikePhasesRadians.length)
    simpleError("actualSpikePhasesRadians", "Actual nonempty observations.");
  return {
    value:
      Math.hypot(
        sum(input.actualSpikePhasesRadians.map(Math.cos)),
        sum(input.actualSpikePhasesRadians.map(Math.sin)),
      ) / input.actualSpikePhasesRadians.length,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualSpikePhasesRadians: [0, 0] },
  output: { result: { value: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/synchrony-index",
  title: "Synchrony Index Calculator",
  description:
    "Explicit circular phase synchrony/vector strength from independently phase assigned spikes, not cross correlation or infer phase from time without reference. Actual independently matched observations/units and protocol, not diagnosis, causal mechanism, clinical decision or validated individual prediction.",
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
