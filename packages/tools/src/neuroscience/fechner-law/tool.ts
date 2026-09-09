import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch47-shared.js";
export type Input = Readonly<{
  readonly actualStimulusIntensity: number;
  readonly callerCalibratedThresholdIntensity: number;
  readonly callerCalibratedLogSlope: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualStimulusIntensity",
    label: "Actual stimulus intensity",
    kind: "number",
  },
  {
    id: "callerCalibratedThresholdIntensity",
    label: "Caller calibrated threshold intensity",
    kind: "number",
  },
  {
    id: "callerCalibratedLogSlope",
    label: "Caller calibrated log slope",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.actualStimulusIntensity, "intensity");
  positive(input.callerCalibratedThresholdIntensity, "threshold");
  positive(input.callerCalibratedLogSlope, "slope");
  return {
    conditionalFechnerSensation:
      input.callerCalibratedLogSlope *
      Math.log(
        input.actualStimulusIntensity /
          input.callerCalibratedThresholdIntensity,
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualStimulusIntensity: 4,
    callerCalibratedThresholdIntensity: 1,
    callerCalibratedLogSlope: 2,
  },
  output: { result: { conditionalFechnerSensation: 2.772588722239781 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/fechner-law",
  title: "Fechner Law Calculator",
  description:
    "Conditional Fechnerlaw S=k*ln(I/I0) with declared natural logarithm and independently calibrated same-unit positive stimulus/threshold. Negative below-threshold modeled values retained, not actual sensation or universality across modalities.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
