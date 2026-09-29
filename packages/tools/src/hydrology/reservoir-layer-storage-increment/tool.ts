import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lowerArea: number;
  readonly upperArea: number;
  readonly heightDifference: number;
};
export type Output = {
  readonly meanArea: number;
  readonly storageIncrement: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lowerArea: { type: "number", minimum: 0 },
    upperArea: { type: "number", minimum: 0 },
    heightDifference: { type: "number", minimum: 0 },
  },
  required: ["lowerArea", "upperArea", "heightDifference"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    meanArea: { type: "number" },
    storageIncrement: { type: "number" },
  },
  required: ["meanArea", "storageIncrement"],
} as const;
/** Trapezoidal area-elevation integration assuming area varies linearly across one layer. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lowerArea, upperArea, heightDifference } = request;
  const compute = (): Output => {
    H.domain(lowerArea >= 0 && upperArea >= 0 && heightDifference >= 0);
    return {
      meanArea: (lowerArea + upperArea) / 2,
      storageIncrement: ((lowerArea + upperArea) * heightDifference) / 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { lowerArea: 100, upperArea: 140, heightDifference: 2 },
  output: { meanArea: 120, storageIncrement: 240 },
} satisfies ToolExample<Input, Output>;
export const reservoirLayerStorageIncrementTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hydrology/reservoir-layer-storage-increment",
    title: "Reservoir Layer Storage Increment Tool",
    description:
      "Trapezoidal area-elevation integration assuming area varies linearly across one layer.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lowerArea: { type: "number", minimum: 0 },
        upperArea: { type: "number", minimum: 0 },
        heightDifference: { type: "number", minimum: 0 },
      },
      required: ["lowerArea", "upperArea", "heightDifference"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        meanArea: { type: "number" },
        storageIncrement: { type: "number" },
      },
      required: ["meanArea", "storageIncrement"],
    },
    ports: {
      inputs: [
        {
          id: "lowerArea",
          label: "Lower Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "upperArea",
          label: "Upper Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "heightDifference",
          label: "Height Difference",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "meanArea", label: "Mean Area", valueType: { type: "number" } },
        {
          id: "storageIncrement",
          label: "Storage Increment",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = reservoirLayerStorageIncrementTool.execute;
export default reservoirLayerStorageIncrementTool;
