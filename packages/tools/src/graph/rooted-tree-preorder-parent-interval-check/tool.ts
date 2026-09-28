import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly parentStart: number;
  readonly parentEnd: number;
  readonly childStart: number;
  readonly childEnd: number;
};
export type Output = { readonly nested: boolean; readonly proper: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    parentStart: { type: "integer", minimum: 0 },
    parentEnd: { type: "integer" },
    childStart: { type: "integer", minimum: 0 },
    childEnd: { type: "integer" },
  },
  required: ["parentStart", "parentEnd", "childStart", "childEnd"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { nested: { type: "boolean" }, proper: { type: "boolean" } },
  required: ["nested", "proper"],
} as const;
/** Calculate rooted tree preorder parent interval check from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { parentStart, parentEnd, childStart, childEnd } = request;
  const compute = (): Output => {
    H.integer(parentStart, 0);
    H.integer(parentEnd, parentStart + 1);
    H.integer(childStart, 0);
    H.integer(childEnd, childStart + 1);
    const nested = parentStart <= childStart && childEnd <= parentEnd;
    return { nested, proper: nested && parentStart < childStart };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { parentStart: 0, parentEnd: 10, childStart: 2, childEnd: 5 },
  output: { nested: true, proper: true },
} satisfies ToolExample<Input, Output>;
export const rootedTreePreorderParentIntervalCheckTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "graph/rooted-tree-preorder-parent-interval-check",
      title: "Rooted Tree Preorder Parent Interval Check Tool",
      description:
        "Calculate rooted tree preorder parent interval check from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          parentStart: { type: "integer", minimum: 0 },
          parentEnd: { type: "integer" },
          childStart: { type: "integer", minimum: 0 },
          childEnd: { type: "integer" },
        },
        required: ["parentStart", "parentEnd", "childStart", "childEnd"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          nested: { type: "boolean" },
          proper: { type: "boolean" },
        },
        required: ["nested", "proper"],
      },
      ports: {
        inputs: [
          {
            id: "parentStart",
            label: "Parent Start",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "parentEnd",
            label: "Parent End",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "childStart",
            label: "Child Start",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "childEnd",
            label: "Child End",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          { id: "nested", label: "Nested", valueType: { type: "boolean" } },
          { id: "proper", label: "Proper", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = rootedTreePreorderParentIntervalCheckTool.execute;
export default rootedTreePreorderParentIntervalCheckTool;
