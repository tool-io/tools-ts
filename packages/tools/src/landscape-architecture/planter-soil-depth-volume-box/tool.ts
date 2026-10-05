import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly internalLength: number;
  readonly internalWidth: number;
  readonly soilDepth: number;
};
export type Output = { readonly soilVolume: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    internalLength: { type: "number", minimum: 0 },
    internalWidth: { type: "number", minimum: 0 },
    soilDepth: { type: "number", minimum: 0 },
  },
  required: ["internalLength", "internalWidth", "soilDepth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { soilVolume: { type: "number" } },
  required: ["soilVolume"],
} as const;
/** Compute a rectangular planter's net soil volume from internal dimensions without bulk-density or settlement assumptions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { internalLength, internalWidth, soilDepth } = request;
  const compute = (): Output => {
    H.domain(
      internalLength >= 0 && internalWidth >= 0 && soilDepth >= 0,
      "internalLength",
    );
    return { soilVolume: internalLength * internalWidth * soilDepth };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { internalLength: 2, internalWidth: 0.5, soilDepth: 0.4 },
  output: { soilVolume: 0.4 },
} satisfies ToolExample<Input, Output>;
export const planterSoilDepthVolumeBoxTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "landscape-architecture/planter-soil-depth-volume-box",
    title: "Planter Soil Depth Volume Box Tool",
    description:
      "Compute a rectangular planter's net soil volume from internal dimensions without bulk-density or settlement assumptions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        internalLength: { type: "number", minimum: 0 },
        internalWidth: { type: "number", minimum: 0 },
        soilDepth: { type: "number", minimum: 0 },
      },
      required: ["internalLength", "internalWidth", "soilDepth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { soilVolume: { type: "number" } },
      required: ["soilVolume"],
    },
    ports: {
      inputs: [
        {
          id: "internalLength",
          label: "Internal Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "internalWidth",
          label: "Internal Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "soilDepth",
          label: "Soil Depth",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "soilVolume",
          label: "Soil Volume",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = planterSoilDepthVolumeBoxTool.execute;
export default planterSoilDepthVolumeBoxTool;
