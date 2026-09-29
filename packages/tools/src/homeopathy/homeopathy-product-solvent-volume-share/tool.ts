import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly solventVolume: number;
  readonly otherVolume: number;
  readonly evaporation: number;
};
export type Output = {
  readonly initialFraction: number;
  readonly remainingVolume: number;
  readonly finalFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    solventVolume: { type: "number", minimum: 0 },
    otherVolume: { type: "number", minimum: 0 },
    evaporation: { type: "number", minimum: 0 },
  },
  required: ["solventVolume", "otherVolume", "evaporation"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initialFraction: { type: "number" },
    remainingVolume: { type: "number" },
    finalFraction: { type: "number" },
  },
  required: ["initialFraction", "remainingVolume", "finalFraction"],
} as const;
/** Explicit formal solvent-volume inventory assuming evaporation affects only the supplied solvent. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { solventVolume, otherVolume, evaporation } = request;
  const compute = (): Output => {
    H.domain(
      solventVolume >= 0 &&
        otherVolume >= 0 &&
        solventVolume + otherVolume > evaporation &&
        evaporation >= 0 &&
        evaporation <= solventVolume,
    );
    return {
      initialFraction: solventVolume / (solventVolume + otherVolume),
      remainingVolume: solventVolume + otherVolume - evaporation,
      finalFraction:
        (solventVolume - evaporation) /
        (solventVolume + otherVolume - evaporation),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { solventVolume: 80, otherVolume: 20, evaporation: 10 },
  output: {
    initialFraction: 0.8,
    remainingVolume: 90,
    finalFraction: 0.7777777777777778,
  },
} satisfies ToolExample<Input, Output>;
export const homeopathyProductSolventVolumeShareTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "homeopathy/homeopathy-product-solvent-volume-share",
      title: "Homeopathy Product Solvent Volume Share Tool",
      description:
        "Explicit formal solvent-volume inventory assuming evaporation affects only the supplied solvent.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          solventVolume: { type: "number", minimum: 0 },
          otherVolume: { type: "number", minimum: 0 },
          evaporation: { type: "number", minimum: 0 },
        },
        required: ["solventVolume", "otherVolume", "evaporation"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          initialFraction: { type: "number" },
          remainingVolume: { type: "number" },
          finalFraction: { type: "number" },
        },
        required: ["initialFraction", "remainingVolume", "finalFraction"],
      },
      ports: {
        inputs: [
          {
            id: "solventVolume",
            label: "Solvent Volume",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "otherVolume",
            label: "Other Volume",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "evaporation",
            label: "Evaporation",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "initialFraction",
            label: "Initial Fraction",
            valueType: { type: "number" },
          },
          {
            id: "remainingVolume",
            label: "Remaining Volume",
            valueType: { type: "number" },
          },
          {
            id: "finalFraction",
            label: "Final Fraction",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = homeopathyProductSolventVolumeShareTool.execute;
export default homeopathyProductSolventVolumeShareTool;
