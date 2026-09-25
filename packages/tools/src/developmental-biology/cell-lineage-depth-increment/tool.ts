import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly parentDepth: number;
  readonly childDepth: number;
  readonly suppliedExpectedIncrement: number;
};
export type Output = { readonly increment: number; readonly residual: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    parentDepth: { type: "integer", minimum: 0 },
    childDepth: { type: "integer", minimum: 0 },
    suppliedExpectedIncrement: { type: "integer", minimum: 0 },
  },
  required: ["parentDepth", "childDepth", "suppliedExpectedIncrement"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { increment: { type: "integer" }, residual: { type: "integer" } },
  required: ["increment", "residual"],
} as const;
/** Compare supplied lineage-tree depth metadata without reconstructing a lineage or predicting development. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { parentDepth, childDepth, suppliedExpectedIncrement } = request;
  const compute = (): Output => {
    H.integer(parentDepth, 0);
    H.integer(childDepth, 0);
    H.integer(suppliedExpectedIncrement, 0);
    return {
      increment: childDepth - parentDepth,
      residual: childDepth - parentDepth - suppliedExpectedIncrement,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { parentDepth: 3, childDepth: 5, suppliedExpectedIncrement: 1 },
  output: { increment: 2, residual: 1 },
} satisfies ToolExample<Input, Output>;
export const cellLineageDepthIncrementTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "developmental-biology/cell-lineage-depth-increment",
    title: "Cell Lineage Depth Increment Tool",
    description:
      "Compare supplied lineage-tree depth metadata without reconstructing a lineage or predicting development.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        parentDepth: { type: "integer", minimum: 0 },
        childDepth: { type: "integer", minimum: 0 },
        suppliedExpectedIncrement: { type: "integer", minimum: 0 },
      },
      required: ["parentDepth", "childDepth", "suppliedExpectedIncrement"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        increment: { type: "integer" },
        residual: { type: "integer" },
      },
      required: ["increment", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "parentDepth",
          label: "Parent Depth",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "childDepth",
          label: "Child Depth",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "suppliedExpectedIncrement",
          label: "Supplied Expected Increment",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "increment", label: "Increment", valueType: { type: "integer" } },
        { id: "residual", label: "Residual", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = cellLineageDepthIncrementTool.execute;
export default cellLineageDepthIncrementTool;
