import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly originalHeight: number;
  readonly allDeepestLeavesRemoved: boolean;
};
export type Output = {
  readonly lowerBound: number;
  readonly upperBound: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    originalHeight: { type: "integer", minimum: 0 },
    allDeepestLeavesRemoved: { type: "boolean" },
  },
  required: ["originalHeight", "allDeepestLeavesRemoved"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lowerBound: { type: "integer" },
    upperBound: { type: "integer" },
  },
  required: ["lowerBound", "upperBound"],
} as const;
/** Height bounds after simultaneously removing a subset of original leaves, in edge-height units with empty/singleton height zero. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { originalHeight, allDeepestLeavesRemoved } = request;
  const compute = (): Output => {
    H.integer(originalHeight, 0);
    return {
      lowerBound: Math.max(0, originalHeight - 1),
      upperBound: allDeepestLeavesRemoved
        ? Math.max(0, originalHeight - 1)
        : originalHeight,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { originalHeight: 4, allDeepestLeavesRemoved: true },
  output: { lowerBound: 3, upperBound: 3 },
} satisfies ToolExample<Input, Output>;
export const treePrunedLeafHeightBoundTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "graph/tree-pruned-leaf-height-bound",
    title: "Tree Pruned Leaf Height Bound Tool",
    description:
      "Height bounds after simultaneously removing a subset of original leaves, in edge-height units with empty/singleton height zero.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        originalHeight: { type: "integer", minimum: 0 },
        allDeepestLeavesRemoved: { type: "boolean" },
      },
      required: ["originalHeight", "allDeepestLeavesRemoved"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lowerBound: { type: "integer" },
        upperBound: { type: "integer" },
      },
      required: ["lowerBound", "upperBound"],
    },
    ports: {
      inputs: [
        {
          id: "originalHeight",
          label: "Original Height",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "allDeepestLeavesRemoved",
          label: "All Deepest Leaves Removed",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "lowerBound",
          label: "Lower Bound",
          valueType: { type: "integer" },
        },
        {
          id: "upperBound",
          label: "Upper Bound",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = treePrunedLeafHeightBoundTool.execute;
export default treePrunedLeafHeightBoundTool;
