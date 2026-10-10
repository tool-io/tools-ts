import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstIndex: number;
  readonly secondIndex: number;
  readonly listLength: number;
};
export type Output = { readonly adjacent: boolean; readonly order: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstIndex: { type: "integer", minimum: 0 },
    secondIndex: { type: "integer", minimum: 0 },
    listLength: { type: "integer", minimum: 1 },
  },
  required: ["firstIndex", "secondIndex", "listLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    adjacent: { type: "boolean" },
    order: { type: "string", maxLength: 8192 },
  },
  required: ["adjacent", "order"],
} as const;
/** Compare two explicit zero-based list indices for immediate adjacency and direction within supplied bounds. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstIndex, secondIndex, listLength } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(listLength) &&
        listLength >= 1 &&
        listLength <= Number.MAX_SAFE_INTEGER,
      "listLength",
    ),
      listLength);
    (H.domain(
      Number.isSafeInteger(firstIndex) &&
        firstIndex >= 0 &&
        firstIndex <= listLength - 1,
      "firstIndex",
    ),
      firstIndex);
    (H.domain(
      Number.isSafeInteger(secondIndex) &&
        secondIndex >= 0 &&
        secondIndex <= listLength - 1,
      "secondIndex",
    ),
      secondIndex);
    return {
      adjacent: Math.abs(secondIndex - firstIndex) === 1,
      order:
        secondIndex > firstIndex
          ? "forward"
          : secondIndex < firstIndex
            ? "backward"
            : "same",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstIndex: 2, secondIndex: 3, listLength: 8 },
  output: { adjacent: true, order: "forward" },
} satisfies ToolExample<Input, Output>;
export const listTwoIndexAdjacencyLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["list", "computer science"],
      keywords: ["list", "computer science"],
    },
    id: "list/list-two-index-adjacency-label",
    title: "List Two Index Adjacency Label",
    description:
      "Compare two explicit zero-based list indices for immediate adjacency and direction within supplied bounds.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstIndex: { type: "integer", minimum: 0 },
        secondIndex: { type: "integer", minimum: 0 },
        listLength: { type: "integer", minimum: 1 },
      },
      required: ["firstIndex", "secondIndex", "listLength"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        adjacent: { type: "boolean" },
        order: { type: "string", maxLength: 8192 },
      },
      required: ["adjacent", "order"],
    },
    ports: {
      inputs: [
        {
          id: "firstIndex",
          label: "First Index",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "secondIndex",
          label: "Second Index",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "listLength",
          label: "List Length",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "adjacent", label: "Adjacent", valueType: { type: "boolean" } },
        { id: "order", label: "Order", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = listTwoIndexAdjacencyLabelTool.execute;
export default listTwoIndexAdjacencyLabelTool;
