import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly parentDepth: number; readonly root: boolean };
export type Output = { readonly depth: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    parentDepth: { type: "integer", minimum: 0 },
    root: { type: "boolean" },
  },
  required: ["parentDepth", "root"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { depth: { type: "integer" } },
  required: ["depth"],
} as const;
/** Calculate tree root depth parent step from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { parentDepth, root } = request;
  const compute = (): Output => {
    H.integer(parentDepth, 0);
    return { depth: root ? 0 : parentDepth + 1 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { parentDepth: 3, root: false },
  output: { depth: 4 },
} satisfies ToolExample<Input, Output>;
export const treeRootDepthParentStepTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "graph/tree-root-depth-parent-step",
    title: "Tree Root Depth Parent Step Tool",
    description:
      "Calculate tree root depth parent step from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        parentDepth: { type: "integer", minimum: 0 },
        root: { type: "boolean" },
      },
      required: ["parentDepth", "root"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { depth: { type: "integer" } },
      required: ["depth"],
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
          id: "root",
          label: "Root",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "depth", label: "Depth", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = treeRootDepthParentStepTool.execute;
export default treeRootDepthParentStepTool;
