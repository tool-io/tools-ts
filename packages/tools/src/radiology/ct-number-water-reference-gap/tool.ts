import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredHu: number;
  readonly observedWaterHu: number;
  readonly expectedWaterHu: number;
};
export type Output = {
  readonly waterOffset: number;
  readonly correctedHu: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredHu: { type: "number" },
    observedWaterHu: { type: "number" },
    expectedWaterHu: { type: "number" },
  },
  required: ["measuredHu", "observedWaterHu", "expectedWaterHu"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    waterOffset: { type: "number" },
    correctedHu: { type: "number" },
  },
  required: ["waterOffset", "correctedHu"],
} as const;
/** Subtract a supplied additive water-reference HU offset, without inferring tissue type or calibrating a full attenuation scale. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measuredHu, observedWaterHu, expectedWaterHu } = request;
  const compute = (): Output => {
    return {
      waterOffset: observedWaterHu - expectedWaterHu,
      correctedHu: measuredHu - observedWaterHu + expectedWaterHu,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { measuredHu: 40, observedWaterHu: 5, expectedWaterHu: 0 },
  output: { waterOffset: 5, correctedHu: 35 },
} satisfies ToolExample<Input, Output>;
export const ctNumberWaterReferenceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "radiology/ct-number-water-reference-gap",
    title: "Ct Number Water Reference Gap Tool",
    description:
      "Subtract a supplied additive water-reference HU offset, without inferring tissue type or calibrating a full attenuation scale.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredHu: { type: "number" },
        observedWaterHu: { type: "number" },
        expectedWaterHu: { type: "number" },
      },
      required: ["measuredHu", "observedWaterHu", "expectedWaterHu"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        waterOffset: { type: "number" },
        correctedHu: { type: "number" },
      },
      required: ["waterOffset", "correctedHu"],
    },
    ports: {
      inputs: [
        {
          id: "measuredHu",
          label: "Measured Hu",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "observedWaterHu",
          label: "Observed Water Hu",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "expectedWaterHu",
          label: "Expected Water Hu",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "waterOffset",
          label: "Water Offset",
          valueType: { type: "number" },
        },
        {
          id: "correctedHu",
          label: "Corrected Hu",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = ctNumberWaterReferenceGapTool.execute;
export default ctNumberWaterReferenceGapTool;
