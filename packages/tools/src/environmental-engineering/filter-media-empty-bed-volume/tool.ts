import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly bedArea: number; readonly mediaDepth: number };
export type Output = { readonly emptyBedVolume: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bedArea: { type: "number", minimum: 0 },
    mediaDepth: { type: "number", minimum: 0 },
  },
  required: ["bedArea", "mediaDepth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { emptyBedVolume: { type: "number" } },
  required: ["emptyBedVolume"],
} as const;
/** Calculate filter media gross empty-bed volume from explicit area and depth without estimating pore volume or treatment performance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { bedArea, mediaDepth } = request;
  const compute = (): Output => {
    H.domain(bedArea >= 0, "bedArea");
    H.domain(mediaDepth >= 0, "mediaDepth");
    return { emptyBedVolume: bedArea * mediaDepth };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { bedArea: 4, mediaDepth: 2 },
  output: { emptyBedVolume: 8 },
} satisfies ToolExample<Input, Output>;
export const filterMediaEmptyBedVolumeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-engineering/filter-media-empty-bed-volume",
    title: "Filter Media Empty BED Volume Tool",
    description:
      "Calculate filter media gross empty-bed volume from explicit area and depth without estimating pore volume or treatment performance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bedArea: { type: "number", minimum: 0 },
        mediaDepth: { type: "number", minimum: 0 },
      },
      required: ["bedArea", "mediaDepth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { emptyBedVolume: { type: "number" } },
      required: ["emptyBedVolume"],
    },
    ports: {
      inputs: [
        {
          id: "bedArea",
          label: "Bed Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "mediaDepth",
          label: "Media Depth",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "emptyBedVolume",
          label: "Empty Bed Volume",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = filterMediaEmptyBedVolumeTool.execute;
export default filterMediaEmptyBedVolumeTool;
