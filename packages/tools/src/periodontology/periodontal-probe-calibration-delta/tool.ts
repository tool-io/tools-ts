import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly indicatedLength: number;
  readonly referenceLength: number;
};
export type Output = {
  readonly indicationError: number;
  readonly additiveCorrection: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    indicatedLength: { type: "number", minimum: 0 },
    referenceLength: { type: "number", minimum: 0 },
  },
  required: ["indicatedLength", "referenceLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    indicationError: { type: "number" },
    additiveCorrection: { type: "number" },
  },
  required: ["indicationError", "additiveCorrection"],
} as const;
/** Compare explicit probe indication and reference lengths without certifying calibration or selecting a tolerance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { indicatedLength, referenceLength } = request;
  const compute = (): Output => {
    H.domain(indicatedLength >= 0 && referenceLength >= 0, "indicatedLength");
    return {
      indicationError: indicatedLength - referenceLength,
      additiveCorrection: referenceLength - indicatedLength,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { indicatedLength: 5.2, referenceLength: 5 },
  output: {
    indicationError: 0.20000000000000018,
    additiveCorrection: -0.20000000000000018,
  },
} satisfies ToolExample<Input, Output>;
export const periodontalProbeCalibrationDeltaTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["periodontology", "health and medicine"],
      keywords: ["periodontology", "health and medicine"],
    },
    id: "periodontology/periodontal-probe-calibration-delta",
    title: "Periodontal Probe Calibration Delta",
    description:
      "Compare explicit probe indication and reference lengths without certifying calibration or selecting a tolerance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        indicatedLength: { type: "number", minimum: 0 },
        referenceLength: { type: "number", minimum: 0 },
      },
      required: ["indicatedLength", "referenceLength"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        indicationError: { type: "number" },
        additiveCorrection: { type: "number" },
      },
      required: ["indicationError", "additiveCorrection"],
    },
    ports: {
      inputs: [
        {
          id: "indicatedLength",
          label: "Indicated Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceLength",
          label: "Reference Length",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "indicationError",
          label: "Indication Error",
          valueType: { type: "number" },
        },
        {
          id: "additiveCorrection",
          label: "Additive Correction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = periodontalProbeCalibrationDeltaTool.execute;
export default periodontalProbeCalibrationDeltaTool;
