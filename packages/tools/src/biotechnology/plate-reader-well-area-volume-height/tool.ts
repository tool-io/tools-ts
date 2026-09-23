import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly volume: number; readonly wellArea: number };
export type Output = { readonly height: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    volume: { type: "number", minimum: 0 },
    wellArea: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["volume", "wellArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { height: { type: "number" } },
  required: ["height"],
} as const;
/** Use compatible volume and area units to infer liquid height in an ideal constant-cross-section well. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { volume, wellArea } = request;
  const compute = (): Output => {
    H.domain(volume >= 0);
    H.positive(wellArea);
    return { height: volume / wellArea };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { volume: 200, wellArea: 40 },
  output: { height: 5 },
} satisfies ToolExample<Input, Output>;
export const plateReaderWellAreaVolumeHeightTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biotechnology/plate-reader-well-area-volume-height",
    title: "Plate Reader Well Area Volume Height Tool",
    description:
      "Use compatible volume and area units to infer liquid height in an ideal constant-cross-section well.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        volume: { type: "number", minimum: 0 },
        wellArea: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["volume", "wellArea"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { height: { type: "number" } },
      required: ["height"],
    },
    ports: {
      inputs: [
        {
          id: "volume",
          label: "Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "wellArea",
          label: "Well Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "height", label: "Height", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = plateReaderWellAreaVolumeHeightTool.execute;
export default plateReaderWellAreaVolumeHeightTool;
