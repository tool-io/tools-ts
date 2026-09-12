import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualIndependentlyMeasuredNeurotransmitterMoles: number;
  readonly actualMatchedSampleVolumeLiters: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualIndependentlyMeasuredNeurotransmitterMoles",
    label: "Actual independently measured neurotransmitter moles",
    kind: "number",
  },
  {
    id: "actualMatchedSampleVolumeLiters",
    label: "Actual matched sample volume liters",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.actualIndependentlyMeasuredNeurotransmitterMoles,
    "actualIndependentlyMeasuredNeurotransmitterMoles",
  );
  positive(
    input.actualMatchedSampleVolumeLiters,
    "actualMatchedSampleVolumeLiters",
  );
  return {
    value:
      (1 * input.actualIndependentlyMeasuredNeurotransmitterMoles) /
      input.actualMatchedSampleVolumeLiters,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualIndependentlyMeasuredNeurotransmitterMoles: 2,
    actualMatchedSampleVolumeLiters: 4,
  },
  output: { result: { value: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/neurotransmitter-concentration",
  title: "Neurotransmitter Concentration Calculator",
  description:
    "Actual neurotransmitter molar concentration, assay identification/calibration external; actual compatible definitions and matching units required, no causal efficacy/diagnosis or safety claim.",
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
