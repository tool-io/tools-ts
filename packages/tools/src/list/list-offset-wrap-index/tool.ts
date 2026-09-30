import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly index: number;
  readonly offset: number;
  readonly length: number;
};
export type Output = { readonly wrappedIndex: number; readonly turns: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    index: { type: "integer" },
    offset: { type: "integer" },
    length: { type: "integer", minimum: 1 },
  },
  required: ["index", "offset", "length"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { wrappedIndex: { type: "integer" }, turns: { type: "integer" } },
  required: ["wrappedIndex", "turns"],
} as const;
/** Calculate list offset wrap index from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { index, offset, length } = request;
  const compute = (): Output => {
    H.integer(length, 1);
    const a = BigInt(index) + BigInt(offset),
      n = BigInt(length);
    let q = a / n,
      r = a % n;
    if (r < 0n) {
      q--;
      r += n;
    }
    return { wrappedIndex: Number(r), turns: Number(q) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { index: 8, offset: 5, length: 10 },
  output: { wrappedIndex: 3, turns: 1 },
} satisfies ToolExample<Input, Output>;
export const listOffsetWrapIndexTool = H.defineSchemaCalculation<Input, Output>(
  {
    ...{
      id: "list/list-offset-wrap-index",
      title: "List Offset Wrap Index Tool",
      description:
        "Calculate list offset wrap index from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          index: { type: "integer" },
          offset: { type: "integer" },
          length: { type: "integer", minimum: 1 },
        },
        required: ["index", "offset", "length"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          wrappedIndex: { type: "integer" },
          turns: { type: "integer" },
        },
        required: ["wrappedIndex", "turns"],
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
            id: "offset",
            label: "Offset",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "length",
            label: "Length",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "wrappedIndex",
            label: "Wrapped Index",
            valueType: { type: "integer" },
          },
          { id: "turns", label: "Turns", valueType: { type: "integer" } },
        ],
      },
    },
    calculate,
  },
);
export const run = listOffsetWrapIndexTool.execute;
export default listOffsetWrapIndexTool;
