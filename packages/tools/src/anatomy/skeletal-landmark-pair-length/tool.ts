import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstPoint: readonly number[];
  readonly secondPoint: readonly number[];
};
export type Output = { readonly distance: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstPoint: { type: "array", maxItems: 256, items: { type: "number" } },
    secondPoint: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["firstPoint", "secondPoint"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { distance: { type: "number" } },
  required: ["distance"],
} as const;
/** Measure Euclidean distance between two explicitly supplied compatible three-dimensional skeletal landmarks. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstPoint, secondPoint } = request;
  const compute = (): Output => {
    H.domain(firstPoint.length === 3, "firstPoint");
    H.domain(secondPoint.length === 3, "secondPoint");
    return {
      distance: Math.hypot(...firstPoint.map((x, i) => secondPoint[i] - x)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstPoint: [0, 0, 0], secondPoint: [3, 4, 0] },
  output: { distance: 5 },
} satisfies ToolExample<Input, Output>;
export const skeletalLandmarkPairLengthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["anatomy", "health and medicine"],
      keywords: ["anatomy", "health and medicine"],
    },
    id: "anatomy/skeletal-landmark-pair-length",
    title: "Skeletal Landmark Pair Length",
    description:
      "Measure Euclidean distance between two explicitly supplied compatible three-dimensional skeletal landmarks.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstPoint: { type: "array", maxItems: 256, items: { type: "number" } },
        secondPoint: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
      },
      required: ["firstPoint", "secondPoint"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { distance: { type: "number" } },
      required: ["distance"],
    },
    ports: {
      inputs: [
        {
          id: "firstPoint",
          label: "First Point",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "secondPoint",
          label: "Second Point",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        { id: "distance", label: "Distance", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = skeletalLandmarkPairLengthTool.execute;
export default skeletalLandmarkPairLengthTool;
