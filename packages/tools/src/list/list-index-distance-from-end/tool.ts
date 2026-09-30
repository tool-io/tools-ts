import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly length: number;
  readonly index: number;
  readonly oneBased: boolean;
};
export type Output = { readonly distance: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    length: { type: "integer", minimum: 1 },
    index: { type: "integer" },
    oneBased: { type: "boolean" },
  },
  required: ["length", "index", "oneBased"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { distance: { type: "integer" } },
  required: ["distance"],
} as const;
/** Calculate list index distance from end from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { length, index, oneBased } = request;
  const compute = (): Output => {
    H.integer(length, 1);
    H.integer(index, oneBased ? 1 : 0, oneBased ? length : length - 1);
    return { distance: oneBased ? length - index : length - 1 - index };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { length: 8, index: 3, oneBased: false },
  output: { distance: 4 },
} satisfies ToolExample<Input, Output>;
export const listIndexDistanceFromEndTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "list/list-index-distance-from-end",
    title: "List Index Distance From End Tool",
    description:
      "Calculate list index distance from end from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        length: { type: "integer", minimum: 1 },
        index: { type: "integer" },
        oneBased: { type: "boolean" },
      },
      required: ["length", "index", "oneBased"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { distance: { type: "integer" } },
      required: ["distance"],
    },
    ports: {
      inputs: [
        {
          id: "length",
          label: "Length",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "index",
          label: "Index",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "oneBased",
          label: "One Based",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "distance", label: "Distance", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = listIndexDistanceFromEndTool.execute;
export default listIndexDistanceFromEndTool;
