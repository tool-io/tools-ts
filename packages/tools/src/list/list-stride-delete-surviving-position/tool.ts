import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly index: number;
  readonly start: number;
  readonly stride: number;
};
export type Output = { readonly removed: boolean; readonly newIndex: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    index: { type: "integer", minimum: 0 },
    start: { type: "integer", minimum: 0 },
    stride: { type: "integer", minimum: 1 },
  },
  required: ["index", "start", "stride"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { removed: { type: "boolean" }, newIndex: { type: "integer" } },
  required: ["removed", "newIndex"],
} as const;
/** Calculate list stride delete surviving position from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { index, start, stride } = input;
  const compute = (): Output => {
    H.integer(index, 0);
    H.integer(start, 0);
    H.integer(stride, 1);
    const removed = index >= start && (index - start) % stride === 0,
      count = index <= start ? 0 : Math.floor((index - 1 - start) / stride) + 1;
    return { removed, newIndex: removed ? -1 : index - count };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { index: 8, start: 1, stride: 3 },
  output: { removed: false, newIndex: 5 },
} satisfies ToolExample<Input, Output>;
export const listStrideDeleteSurvivingPositionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "list/list-stride-delete-surviving-position",
    title: "List Stride Delete Surviving Position Tool",
    description:
      "Calculate list stride delete surviving position from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        index: { type: "integer", minimum: 0 },
        start: { type: "integer", minimum: 0 },
        stride: { type: "integer", minimum: 1 },
      },
      required: ["index", "start", "stride"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        removed: { type: "boolean" },
        newIndex: { type: "integer" },
      },
      required: ["removed", "newIndex"],
    },
    ports: {
      inputs: [
        {
          id: "index",
          label: "Index",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "start",
          label: "Start",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "stride",
          label: "Stride",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "removed", label: "Removed", valueType: { type: "boolean" } },
        { id: "newIndex", label: "New Index", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = listStrideDeleteSurvivingPositionTool.execute;
export default listStrideDeleteSurvivingPositionTool;
