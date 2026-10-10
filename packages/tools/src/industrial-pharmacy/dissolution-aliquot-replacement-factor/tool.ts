import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly vesselVolume: number;
  readonly withdrawnAliquotVolume: number;
};
export type Output = {
  readonly remainingVolumeFraction: number;
  readonly replacementToRemainingRatio: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    vesselVolume: { type: "number", exclusiveMinimum: 0 },
    withdrawnAliquotVolume: { type: "number", minimum: 0 },
  },
  required: ["vesselVolume", "withdrawnAliquotVolume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    remainingVolumeFraction: { type: "number" },
    replacementToRemainingRatio: { type: "number" },
  },
  required: ["remainingVolumeFraction", "replacementToRemainingRatio"],
} as const;
/** Calculate explicit aliquot and remaining-volume ratios under equal-volume replacement without correcting a dissolution profile. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { vesselVolume, withdrawnAliquotVolume } = request;
  const compute = (): Output => {
    (H.domain(vesselVolume > 0, "vesselVolume"), vesselVolume);
    H.domain(
      withdrawnAliquotVolume >= 0 && withdrawnAliquotVolume < vesselVolume,
      "withdrawnAliquotVolume",
    );
    return {
      remainingVolumeFraction: 1 - withdrawnAliquotVolume / vesselVolume,
      replacementToRemainingRatio:
        withdrawnAliquotVolume / (vesselVolume - withdrawnAliquotVolume),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { vesselVolume: 100, withdrawnAliquotVolume: 20 },
  output: { remainingVolumeFraction: 0.8, replacementToRemainingRatio: 0.25 },
} satisfies ToolExample<Input, Output>;
export const dissolutionAliquotReplacementFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data"],
        fields: ["industrial-pharmacy", "industrial pharmacy", "pharmacy"],
        keywords: ["industrial pharmacy", "pharmacy"],
      },
      id: "industrial-pharmacy/dissolution-aliquot-replacement-factor",
      title: "Dissolution Aliquot Replacement Factor",
      description:
        "Calculate explicit aliquot and remaining-volume ratios under equal-volume replacement without correcting a dissolution profile.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          vesselVolume: { type: "number", exclusiveMinimum: 0 },
          withdrawnAliquotVolume: { type: "number", minimum: 0 },
        },
        required: ["vesselVolume", "withdrawnAliquotVolume"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          remainingVolumeFraction: { type: "number" },
          replacementToRemainingRatio: { type: "number" },
        },
        required: ["remainingVolumeFraction", "replacementToRemainingRatio"],
      },
      ports: {
        inputs: [
          {
            id: "vesselVolume",
            label: "Vessel Volume",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "withdrawnAliquotVolume",
            label: "Withdrawn Aliquot Volume",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "remainingVolumeFraction",
            label: "Remaining Volume Fraction",
            valueType: { type: "number" },
          },
          {
            id: "replacementToRemainingRatio",
            label: "Replacement To Remaining Ratio",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = dissolutionAliquotReplacementFactorTool.execute;
export default dissolutionAliquotReplacementFactorTool;
