import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyMeasuredUnshieldedDose: number;
  readonly independentlyMatchedShieldedDose: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "independentlyMeasuredUnshieldedDose",
    label: "Independently measured unshielded dose",
    kind: "number",
  },
  {
    id: "independentlyMatchedShieldedDose",
    label: "Independently matched shielded dose",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  positive(input.independentlyMeasuredUnshieldedDose, "unshielded");
  nonnegative(input.independentlyMatchedShieldedDose, "shielded");
  const r =
    input.independentlyMatchedShieldedDose /
    input.independentlyMeasuredUnshieldedDose;
  return {
    observedTransmissionFraction: r,
    observedAttenuationPercent: 100 * (1 - r),
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyMeasuredUnshieldedDose: 10,
    independentlyMatchedShieldedDose: 2,
  },
  output: {
    result: {
      observedTransmissionFraction: 0.2,
      observedAttenuationPercent: 80,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dentistry/lead-apron-attenuation",
  title: "Lead Apron Attenuation Calculator",
  description:
    "Actual matched lead-apron dose transmission/attenuation, not predict from nominal thickness or guarantee patient protection. Beam geometry, energy, dose location and current imaging guidance external; transmission>1retains signed negative attenuation.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          observedTransmissionFraction: { type: "number" },
          observedAttenuationPercent: { type: "number" },
        },
        required: [
          "observedTransmissionFraction",
          "observedAttenuationPercent",
        ],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
