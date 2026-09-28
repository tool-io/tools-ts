import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly width: number;
  readonly height: number;
  readonly depth: number;
};
export type Output = {
  readonly cosines: readonly number[];
  readonly diagonal: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    width: { type: "number", minimum: 0 },
    height: { type: "number", minimum: 0 },
    depth: { type: "number", minimum: 0 },
  },
  required: ["width", "height", "depth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cosines: { type: "array", maxItems: 256, items: { type: "number" } },
    diagonal: { type: "number" },
  },
  required: ["cosines", "diagonal"],
} as const;
/** Calculate cuboid space diagonal direction cosine from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { width, height, depth } = input;
  const compute = (): Output => {
    H.domain(width >= 0 && height >= 0 && depth >= 0);
    const diagonal = Math.hypot(width, height, depth);
    H.positive(diagonal);
    return {
      cosines: [width / diagonal, height / diagonal, depth / diagonal],
      diagonal,
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { width: 3, height: 4, depth: 0 },
  output: { cosines: [0.6, 0.8, 0], diagonal: 5 },
} satisfies ToolExample<Input, Output>;
export const cuboidSpaceDiagonalDirectionCosineTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geometry/cuboid-space-diagonal-direction-cosine",
    title: "Cuboid Space Diagonal Direction Cosine Tool",
    description:
      "Calculate cuboid space diagonal direction cosine from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        width: { type: "number", minimum: 0 },
        height: { type: "number", minimum: 0 },
        depth: { type: "number", minimum: 0 },
      },
      required: ["width", "height", "depth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cosines: { type: "array", maxItems: 256, items: { type: "number" } },
        diagonal: { type: "number" },
      },
      required: ["cosines", "diagonal"],
    },
    ports: {
      inputs: [
        {
          id: "width",
          label: "Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "height",
          label: "Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "depth",
          label: "Depth",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "cosines",
          label: "Cosines",
          valueType: { type: "list", items: { type: "number" } },
        },
        { id: "diagonal", label: "Diagonal", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = cuboidSpaceDiagonalDirectionCosineTool.execute;
export default cuboidSpaceDiagonalDirectionCosineTool;
