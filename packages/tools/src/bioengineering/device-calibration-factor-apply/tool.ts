import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly rawReading: number;
  readonly gain: number;
  readonly offset: number;
};
export type Output = { readonly calibratedReading: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rawReading: { type: "number" },
    gain: { type: "number" },
    offset: { type: "number" },
  },
  required: ["rawReading", "gain", "offset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { calibratedReading: { type: "number" } },
  required: ["calibratedReading"],
} as const;
/** Apply an explicit affine bench-device calibration gain and offset without fitting or validating the calibration. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { rawReading, gain, offset } = request;
  const compute = (): Output => {
    H.domain(gain !== 0, "gain");
    return { calibratedReading: rawReading * gain + offset };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { rawReading: 12, gain: 2, offset: -1 },
  output: { calibratedReading: 23 },
} satisfies ToolExample<Input, Output>;
export const deviceCalibrationFactorApplyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["bioengineering", "engineering"],
      keywords: ["bioengineering", "engineering"],
    },
    id: "bioengineering/device-calibration-factor-apply",
    title: "Device Calibration Factor Apply",
    description:
      "Apply an explicit affine bench-device calibration gain and offset without fitting or validating the calibration.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rawReading: { type: "number" },
        gain: { type: "number" },
        offset: { type: "number" },
      },
      required: ["rawReading", "gain", "offset"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { calibratedReading: { type: "number" } },
      required: ["calibratedReading"],
    },
    ports: {
      inputs: [
        {
          id: "rawReading",
          label: "Raw Reading",
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
          id: "offset",
          label: "Offset",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "calibratedReading",
          label: "Calibrated Reading",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = deviceCalibrationFactorApplyTool.execute;
export default deviceCalibrationFactorApplyTool;
