import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish } from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualQualifiedLowThresholdSpikePeakMv: number;
  readonly actualQualifiedPrestimulusBaselineMv: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualQualifiedLowThresholdSpikePeakMv",
    label: "Actual qualified low threshold spike peak mv",
    kind: "number",
  },
  {
    id: "actualQualifiedPrestimulusBaselineMv",
    label: "Actual qualified prestimulus baseline mv",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    value:
      input.actualQualifiedLowThresholdSpikePeakMv -
      input.actualQualifiedPrestimulusBaselineMv,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualQualifiedLowThresholdSpikePeakMv: 5,
    actualQualifiedPrestimulusBaselineMv: 3,
  },
  output: { result: { value: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/low-threshold-spike-amplitude",
  title: "Low Threshold Spike Amplitude Calculator",
  description:
    "Actual independently identified low thresholds pike peak minus baseline; signed result retained, actual matching units and definitions independently established.",
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
