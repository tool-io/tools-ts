import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly raw: number;
  readonly darkOffset: number;
  readonly gain: number;
  readonly offsetBeforeGain: boolean;
};
export type Output = { readonly calibrated: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    raw: { type: "number" },
    darkOffset: { type: "number" },
    gain: { type: "number", exclusiveMinimum: 0 },
    offsetBeforeGain: { type: "boolean" },
  },
  required: ["raw", "darkOffset", "gain", "offsetBeforeGain"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { calibrated: { type: "number" } },
  required: ["calibrated"],
} as const;
/** Compare two explicit radiometric offset/gain ordering conventions without estimating calibration coefficients. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { raw, darkOffset, gain, offsetBeforeGain } = request;
  const compute = (): Output => {
    H.positive(gain);
    return {
      calibrated: offsetBeforeGain
        ? (raw - darkOffset) * gain
        : raw * gain - darkOffset,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { raw: 100, darkOffset: 10, gain: 2, offsetBeforeGain: true },
  output: { calibrated: 180 },
} satisfies ToolExample<Input, Output>;
export const multispectralGainBaseFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "precision-agriculture/multispectral-gain-base-flag",
    title: "Multispectral Gain Base Flag Tool",
    description:
      "Compare two explicit radiometric offset/gain ordering conventions without estimating calibration coefficients.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        raw: { type: "number" },
        darkOffset: { type: "number" },
        gain: { type: "number", exclusiveMinimum: 0 },
        offsetBeforeGain: { type: "boolean" },
      },
      required: ["raw", "darkOffset", "gain", "offsetBeforeGain"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { calibrated: { type: "number" } },
      required: ["calibrated"],
    },
    ports: {
      inputs: [
        {
          id: "raw",
          label: "Raw",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "darkOffset",
          label: "Dark Offset",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "gain",
          label: "Gain",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "offsetBeforeGain",
          label: "Offset Before Gain",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "calibrated",
          label: "Calibrated",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = multispectralGainBaseFlagTool.execute;
export default multispectralGainBaseFlagTool;
