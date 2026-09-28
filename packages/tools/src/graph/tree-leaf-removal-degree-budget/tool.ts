import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly parentDegree: number;
  readonly vertices: number;
};
export type Output = {
  readonly parentDegree: number;
  readonly vertices: number;
  readonly parentBecomesLeaf: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    parentDegree: { type: "integer", minimum: 1 },
    vertices: { type: "integer", minimum: 2 },
  },
  required: ["parentDegree", "vertices"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    parentDegree: { type: "integer" },
    vertices: { type: "integer" },
    parentBecomesLeaf: { type: "boolean" },
  },
  required: ["parentDegree", "vertices", "parentBecomesLeaf"],
} as const;
/** Calculate tree leaf removal degree budget from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { parentDegree, vertices } = request;
  const compute = (): Output => {
    H.integer(vertices, 2);
    H.integer(parentDegree, 1, vertices - 1);
    const degree = parentDegree - 1;
    return {
      parentDegree: degree,
      vertices: vertices - 1,
      parentBecomesLeaf: degree === 1,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { parentDegree: 2, vertices: 5 },
  output: { parentDegree: 1, vertices: 4, parentBecomesLeaf: true },
} satisfies ToolExample<Input, Output>;
export const treeLeafRemovalDegreeBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "graph/tree-leaf-removal-degree-budget",
    title: "Tree Leaf Removal Degree Budget Tool",
    description:
      "Calculate tree leaf removal degree budget from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        parentDegree: { type: "integer", minimum: 1 },
        vertices: { type: "integer", minimum: 2 },
      },
      required: ["parentDegree", "vertices"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        parentDegree: { type: "integer" },
        vertices: { type: "integer" },
        parentBecomesLeaf: { type: "boolean" },
      },
      required: ["parentDegree", "vertices", "parentBecomesLeaf"],
    },
    ports: {
      inputs: [
        {
          id: "parentDegree",
          label: "Parent Degree",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "vertices",
          label: "Vertices",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "parentDegree",
          label: "Parent Degree",
          valueType: { type: "integer" },
        },
        { id: "vertices", label: "Vertices", valueType: { type: "integer" } },
        {
          id: "parentBecomesLeaf",
          label: "Parent Becomes Leaf",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = treeLeafRemovalDegreeBudgetTool.execute;
export default treeLeafRemovalDegreeBudgetTool;
