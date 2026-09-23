import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly initialVolume: number;
  readonly removedVolume: number;
  readonly measuredConcentration: number;
};
export type Output = {
  readonly remainingVolume: number;
  readonly retainedAmount: number;
  readonly initialVolumeEquivalent: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initialVolume: { type: "number", exclusiveMinimum: 0 },
    removedVolume: { type: "number", minimum: 0 },
    measuredConcentration: { type: "number" },
  },
  required: ["initialVolume", "removedVolume", "measuredConcentration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    remainingVolume: { type: "number" },
    retainedAmount: { type: "number" },
    initialVolumeEquivalent: { type: "number" },
  },
  required: ["remainingVolume", "retainedAmount", "initialVolumeEquivalent"],
} as const;
/** Calculate nonclinical fermentation volume loss correction from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { initialVolume, removedVolume, measuredConcentration } = request;
  const compute = (): Output => {
    H.positive(initialVolume);
    H.domain(removedVolume >= 0 && removedVolume <= initialVolume);
    return {
      remainingVolume: initialVolume - removedVolume,
      retainedAmount: (initialVolume - removedVolume) * measuredConcentration,
      initialVolumeEquivalent:
        ((initialVolume - removedVolume) * measuredConcentration) /
        initialVolume,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { initialVolume: 10, removedVolume: 2, measuredConcentration: 5 },
  output: {
    remainingVolume: 8,
    retainedAmount: 40,
    initialVolumeEquivalent: 4,
  },
} satisfies ToolExample<Input, Output>;
export const nonclinicalFermentationVolumeLossCorrectionTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "biotechnology/nonclinical-fermentation-volume-loss-correction",
      title: "Nonclinical Fermentation Volume Loss Correction Tool",
      description:
        "Calculate nonclinical fermentation volume loss correction from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          initialVolume: { type: "number", exclusiveMinimum: 0 },
          removedVolume: { type: "number", minimum: 0 },
          measuredConcentration: { type: "number" },
        },
        required: ["initialVolume", "removedVolume", "measuredConcentration"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          remainingVolume: { type: "number" },
          retainedAmount: { type: "number" },
          initialVolumeEquivalent: { type: "number" },
        },
        required: [
          "remainingVolume",
          "retainedAmount",
          "initialVolumeEquivalent",
        ],
      },
      ports: {
        inputs: [
          {
            id: "initialVolume",
            label: "Initial Volume",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "removedVolume",
            label: "Removed Volume",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "measuredConcentration",
            label: "Measured Concentration",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "remainingVolume",
            label: "Remaining Volume",
            valueType: { type: "number" },
          },
          {
            id: "retainedAmount",
            label: "Retained Amount",
            valueType: { type: "number" },
          },
          {
            id: "initialVolumeEquivalent",
            label: "Initial Volume Equivalent",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = nonclinicalFermentationVolumeLossCorrectionTool.execute;
export default nonclinicalFermentationVolumeLossCorrectionTool;
