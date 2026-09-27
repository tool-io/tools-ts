import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedBuffer: number;
  readonly suppliedBuffer: number;
  readonly observedSample: number;
};
export type Output = {
  readonly referenceGap: number;
  readonly additiveCorrectedSample: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedBuffer: { type: "number" },
    suppliedBuffer: { type: "number" },
    observedSample: { type: "number" },
  },
  required: ["observedBuffer", "suppliedBuffer", "observedSample"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceGap: { type: "number" },
    additiveCorrectedSample: { type: "number" },
  },
  required: ["referenceGap", "additiveCorrectedSample"],
} as const;
/** One-point additive reference-gap arithmetic; no electrode-slope or suitability inference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedBuffer, suppliedBuffer, observedSample } = request;
  const compute = (): Output => {
    return {
      referenceGap: observedBuffer - suppliedBuffer,
      additiveCorrectedSample: observedSample - observedBuffer + suppliedBuffer,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observedBuffer: 7.1, suppliedBuffer: 7, observedSample: 4.2 },
  output: {
    referenceGap: 0.09999999999999964,
    additiveCorrectedSample: 4.1000000000000005,
  },
} satisfies ToolExample<Input, Output>;
export const foodPhMeterCalibrationReferenceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "food-safety/food-ph-meter-calibration-reference-gap",
    title: "Food pH Meter Calibration Reference Gap Tool",
    description:
      "One-point additive reference-gap arithmetic; no electrode-slope or suitability inference.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedBuffer: { type: "number" },
        suppliedBuffer: { type: "number" },
        observedSample: { type: "number" },
      },
      required: ["observedBuffer", "suppliedBuffer", "observedSample"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        referenceGap: { type: "number" },
        additiveCorrectedSample: { type: "number" },
      },
      required: ["referenceGap", "additiveCorrectedSample"],
    },
    ports: {
      inputs: [
        {
          id: "observedBuffer",
          label: "Observed Buffer",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedBuffer",
          label: "Supplied Buffer",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "observedSample",
          label: "Observed Sample",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "referenceGap",
          label: "Reference Gap",
          valueType: { type: "number" },
        },
        {
          id: "additiveCorrectedSample",
          label: "Additive Corrected Sample",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = foodPhMeterCalibrationReferenceGapTool.execute;
export default foodPhMeterCalibrationReferenceGapTool;
