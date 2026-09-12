import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError, mean } from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualEmgSamplesVolts: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualEmgSamplesVolts",
    label: "Actual emg samples volts",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (!input.actualEmgSamplesVolts.length)
    simpleError("actualEmgSamplesVolts", "Actual nonempty observations.");
  return {
    value: Math.sqrt(mean(input.actualEmgSamplesVolts.map((v) => v * v))),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualEmgSamplesVolts: [1, -2] },
  output: { result: { value: 1.5811388300841898 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/electromyography-rms",
  title: "EMG RMS Calculator",
  description:
    "Actual EMG waveforms ample RMS\u221amean(v\u00b2), includes DC without implicit filtering; not square pulse energy or fit muscle force. Actual independently matched observations/units and protocol, not diagnosis, causal mechanism, clinical decision or validated individual prediction.",
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
