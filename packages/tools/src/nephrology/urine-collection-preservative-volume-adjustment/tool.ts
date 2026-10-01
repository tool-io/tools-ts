import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredConcentration: number;
  readonly finalVolume: number;
  readonly addedPreservative: number;
};
export type Output = {
  readonly originalSampleVolume: number;
  readonly dilutionFactor: number;
  readonly originalConcentration: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredConcentration: { type: "number" },
    finalVolume: { type: "number" },
    addedPreservative: { type: "number", minimum: 0 },
  },
  required: ["measuredConcentration", "finalVolume", "addedPreservative"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    originalSampleVolume: { type: "number" },
    dilutionFactor: { type: "number" },
    originalConcentration: { type: "number" },
  },
  required: ["originalSampleVolume", "dilutionFactor", "originalConcentration"],
} as const;
/** Volume-only correction assuming added preservative contributes no analyte and does not alter recovery, without selecting a preservative or collection procedure. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measuredConcentration, finalVolume, addedPreservative } = request;
  const compute = (): Output => {
    H.domain(addedPreservative >= 0 && finalVolume > addedPreservative);
    return {
      originalSampleVolume: finalVolume - addedPreservative,
      dilutionFactor: finalVolume / (finalVolume - addedPreservative),
      originalConcentration:
        (measuredConcentration * finalVolume) /
        (finalVolume - addedPreservative),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { measuredConcentration: 10, finalVolume: 110, addedPreservative: 10 },
  output: {
    originalSampleVolume: 100,
    dilutionFactor: 1.1,
    originalConcentration: 11,
  },
} satisfies ToolExample<Input, Output>;
export const urineCollectionPreservativeVolumeAdjustmentTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "nephrology/urine-collection-preservative-volume-adjustment",
      title: "Urine Collection Preservative Volume Adjustment Tool",
      description:
        "Volume-only correction assuming added preservative contributes no analyte and does not alter recovery, without selecting a preservative or collection procedure.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          measuredConcentration: { type: "number" },
          finalVolume: { type: "number" },
          addedPreservative: { type: "number", minimum: 0 },
        },
        required: ["measuredConcentration", "finalVolume", "addedPreservative"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          originalSampleVolume: { type: "number" },
          dilutionFactor: { type: "number" },
          originalConcentration: { type: "number" },
        },
        required: [
          "originalSampleVolume",
          "dilutionFactor",
          "originalConcentration",
        ],
      },
      ports: {
        inputs: [
          {
            id: "measuredConcentration",
            label: "Measured Concentration",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "finalVolume",
            label: "Final Volume",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "addedPreservative",
            label: "Added Preservative",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "originalSampleVolume",
            label: "Original Sample Volume",
            valueType: { type: "number" },
          },
          {
            id: "dilutionFactor",
            label: "Dilution Factor",
            valueType: { type: "number" },
          },
          {
            id: "originalConcentration",
            label: "Original Concentration",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = urineCollectionPreservativeVolumeAdjustmentTool.execute;
export default urineCollectionPreservativeVolumeAdjustmentTool;
