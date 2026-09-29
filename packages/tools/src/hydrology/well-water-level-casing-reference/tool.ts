import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly casingElevation: number;
  readonly depthBelowCasing: number;
  readonly casingAboveGround: number;
};
export type Output = {
  readonly waterElevation: number;
  readonly depthBelowGround: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    casingElevation: { type: "number" },
    depthBelowCasing: { type: "number" },
    casingAboveGround: { type: "number" },
  },
  required: ["casingElevation", "depthBelowCasing", "casingAboveGround"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    waterElevation: { type: "number" },
    depthBelowGround: { type: "number" },
  },
  required: ["waterElevation", "depthBelowGround"],
} as const;
/** Signed depth below the measuring point; negative ground depth denotes water above ground rather than being clipped. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { casingElevation, depthBelowCasing, casingAboveGround } = request;
  const compute = (): Output => {
    return {
      waterElevation: casingElevation - depthBelowCasing,
      depthBelowGround: depthBelowCasing - casingAboveGround,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { casingElevation: 100, depthBelowCasing: 5, casingAboveGround: 1 },
  output: { waterElevation: 95, depthBelowGround: 4 },
} satisfies ToolExample<Input, Output>;
export const wellWaterLevelCasingReferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hydrology/well-water-level-casing-reference",
    title: "Well Water Level Casing Reference Tool",
    description:
      "Signed depth below the measuring point; negative ground depth denotes water above ground rather than being clipped.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        casingElevation: { type: "number" },
        depthBelowCasing: { type: "number" },
        casingAboveGround: { type: "number" },
      },
      required: ["casingElevation", "depthBelowCasing", "casingAboveGround"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        waterElevation: { type: "number" },
        depthBelowGround: { type: "number" },
      },
      required: ["waterElevation", "depthBelowGround"],
    },
    ports: {
      inputs: [
        {
          id: "casingElevation",
          label: "Casing Elevation",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "depthBelowCasing",
          label: "Depth Below Casing",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "casingAboveGround",
          label: "Casing Above Ground",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "waterElevation",
          label: "Water Elevation",
          valueType: { type: "number" },
        },
        {
          id: "depthBelowGround",
          label: "Depth Below Ground",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = wellWaterLevelCasingReferenceTool.execute;
export default wellWaterLevelCasingReferenceTool;
