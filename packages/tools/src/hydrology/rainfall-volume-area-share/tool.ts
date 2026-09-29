import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly rainDepth: number;
  readonly subarea: number;
  readonly totalArea: number;
};
export type Output = { readonly subareaVolume: number; readonly share: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rainDepth: { type: "number", minimum: 0 },
    subarea: { type: "number", minimum: 0 },
    totalArea: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["rainDepth", "subarea", "totalArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { subareaVolume: { type: "number" }, share: { type: "number" } },
  required: ["subareaVolume", "share"],
} as const;
/** Calculate rainfall volume area share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { rainDepth, subarea, totalArea } = request;
  const compute = (): Output => {
    H.domain(rainDepth >= 0 && subarea >= 0 && subarea <= totalArea);
    H.positive(totalArea);
    return { subareaVolume: rainDepth * subarea, share: subarea / totalArea };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { rainDepth: 0.01, subarea: 100, totalArea: 500 },
  output: { subareaVolume: 1, share: 0.2 },
} satisfies ToolExample<Input, Output>;
export const rainfallVolumeAreaShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hydrology/rainfall-volume-area-share",
    title: "Rainfall Volume Area Share Tool",
    description:
      "Calculate rainfall volume area share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rainDepth: { type: "number", minimum: 0 },
        subarea: { type: "number", minimum: 0 },
        totalArea: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["rainDepth", "subarea", "totalArea"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        subareaVolume: { type: "number" },
        share: { type: "number" },
      },
      required: ["subareaVolume", "share"],
    },
    ports: {
      inputs: [
        {
          id: "rainDepth",
          label: "Rain Depth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "subarea",
          label: "Subarea",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalArea",
          label: "Total Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "subareaVolume",
          label: "Subarea Volume",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = rainfallVolumeAreaShareTool.execute;
export default rainfallVolumeAreaShareTool;
