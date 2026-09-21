import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstArea: number;
  readonly secondArea: number;
  readonly overlap: number;
  readonly groundArea: number;
};
export type Output = {
  readonly uniqueProjection: number;
  readonly layeredRatio: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstArea: { type: "number", minimum: 0 },
    secondArea: { type: "number", minimum: 0 },
    overlap: { type: "number", minimum: 0 },
    groundArea: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["firstArea", "secondArea", "overlap", "groundArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    uniqueProjection: { type: "number" },
    layeredRatio: { type: "number" },
  },
  required: ["uniqueProjection", "layeredRatio"],
} as const;
/** Calculate forest garden canopy layer overlap term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstArea, secondArea, overlap, groundArea } = request;
  const compute = (): Output => {
    H.positive(groundArea);
    H.domain(
      firstArea >= 0 &&
        secondArea >= 0 &&
        overlap >= 0 &&
        overlap <= Math.min(firstArea, secondArea),
    );
    return {
      uniqueProjection: firstArea + secondArea - overlap,
      layeredRatio: (firstArea + secondArea) / groundArea,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstArea: 60, secondArea: 70, overlap: 40, groundArea: 100 },
  output: { uniqueProjection: 90, layeredRatio: 1.3 },
} satisfies ToolExample<Input, Output>;
export const forestGardenCanopyLayerOverlapTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agroforestry/forest-garden-canopy-layer-overlap-term",
    title: "Forest Garden Canopy Layer Overlap Term Tool",
    description:
      "Calculate forest garden canopy layer overlap term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstArea: { type: "number", minimum: 0 },
        secondArea: { type: "number", minimum: 0 },
        overlap: { type: "number", minimum: 0 },
        groundArea: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["firstArea", "secondArea", "overlap", "groundArea"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        uniqueProjection: { type: "number" },
        layeredRatio: { type: "number" },
      },
      required: ["uniqueProjection", "layeredRatio"],
    },
    ports: {
      inputs: [
        {
          id: "firstArea",
          label: "First Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondArea",
          label: "Second Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "overlap",
          label: "Overlap",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "groundArea",
          label: "Ground Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "uniqueProjection",
          label: "Unique Projection",
          valueType: { type: "number" },
        },
        {
          id: "layeredRatio",
          label: "Layered Ratio",
          valueType: { type: "number", unit: "1" },
        },
      ],
    },
  },
  calculate,
});
export const run = forestGardenCanopyLayerOverlapTermTool.execute;
export default forestGardenCanopyLayerOverlapTermTool;
