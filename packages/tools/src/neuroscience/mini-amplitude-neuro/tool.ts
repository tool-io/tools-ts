import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError, mean } from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualSignedQualifiedMiniPeakMinusBaselineAmplitudesPa: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualSignedQualifiedMiniPeakMinusBaselineAmplitudesPa",
    label: "Actual signed qualified mini peak minus baseline amplitudes pa",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (!input.actualSignedQualifiedMiniPeakMinusBaselineAmplitudesPa.length)
    simpleError(
      "actualSignedQualifiedMiniPeakMinusBaselineAmplitudesPa",
      "Actual nonempty observations.",
    );
  return {
    value: mean(input.actualSignedQualifiedMiniPeakMinusBaselineAmplitudesPa),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualSignedQualifiedMiniPeakMinusBaselineAmplitudesPa: [-1, -3] },
  output: { result: { value: -2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/mini-amplitude-neuro",
  title: "Mini Amplitude Calculator",
  description:
    "Mean actual independently identified miniature event signed peak baseline amplitudepA, not automatic detection or absolute polarity. Actual independently matched observations/units and protocol, not diagnosis, causal mechanism, clinical decision or validated individual prediction.",
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
