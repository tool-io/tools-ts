import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredVolume: number;
  readonly voidFraction: number;
  readonly solidDensity: number;
};
export type Output = {
  readonly solidVolume: number;
  readonly estimatedMass: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredVolume: { type: "number", minimum: 0 },
    voidFraction: { type: "number", minimum: 0, maximum: 1 },
    solidDensity: { type: "number", minimum: 0 },
  },
  required: ["measuredVolume", "voidFraction", "solidDensity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    solidVolume: { type: "number" },
    estimatedMass: { type: "number" },
  },
  required: ["solidVolume", "estimatedMass"],
} as const;
/** Calculate waste bin void share correction from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measuredVolume, voidFraction, solidDensity } = request;
  const compute = (): Output => {
    H.domain(measuredVolume >= 0 && solidDensity >= 0);
    H.probability(voidFraction);
    return {
      solidVolume: measuredVolume * (1 - voidFraction),
      estimatedMass: measuredVolume * (1 - voidFraction) * solidDensity,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { measuredVolume: 10, voidFraction: 0.4, solidDensity: 200 },
  output: { solidVolume: 6, estimatedMass: 1200 },
} satisfies ToolExample<Input, Output>;
export const wasteBinVoidShareCorrectionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-science/waste-bin-void-share-correction",
    title: "Waste Bin Void Share Correction Tool",
    description:
      "Calculate waste bin void share correction from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredVolume: { type: "number", minimum: 0 },
        voidFraction: { type: "number", minimum: 0, maximum: 1 },
        solidDensity: { type: "number", minimum: 0 },
      },
      required: ["measuredVolume", "voidFraction", "solidDensity"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        solidVolume: { type: "number" },
        estimatedMass: { type: "number" },
      },
      required: ["solidVolume", "estimatedMass"],
    },
    ports: {
      inputs: [
        {
          id: "measuredVolume",
          label: "Measured Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "voidFraction",
          label: "Void Fraction",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
        {
          id: "solidDensity",
          label: "Solid Density",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "solidVolume",
          label: "Solid Volume",
          valueType: { type: "number" },
        },
        {
          id: "estimatedMass",
          label: "Estimated Mass",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = wasteBinVoidShareCorrectionTool.execute;
export default wasteBinVoidShareCorrectionTool;
