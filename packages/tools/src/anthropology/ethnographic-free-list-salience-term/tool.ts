import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly rank: number; readonly listLength: number };
export type Output = { readonly salience: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rank: { type: "integer", minimum: 1 },
    listLength: { type: "integer", minimum: 1 },
  },
  required: ["rank", "listLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { salience: { type: "number" } },
  required: ["salience"],
} as const;
/** Return the normalized reverse rank contribution (length-rank+1)/length for one explicitly ranked free list. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { rank, listLength } = request;
  const compute = (): Output => {
    H.integer(listLength, 1);
    H.integer(rank, 1, listLength);
    return { salience: (listLength - rank + 1) / listLength };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { rank: 2, listLength: 5 },
  output: { salience: 0.8 },
} satisfies ToolExample<Input, Output>;
export const ethnographicFreeListSalienceTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "anthropology/ethnographic-free-list-salience-term",
    title: "Ethnographic Free List Salience Term Tool",
    description:
      "Return the normalized reverse rank contribution (length-rank+1)/length for one explicitly ranked free list.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rank: { type: "integer", minimum: 1 },
        listLength: { type: "integer", minimum: 1 },
      },
      required: ["rank", "listLength"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { salience: { type: "number" } },
      required: ["salience"],
    },
    ports: {
      inputs: [
        {
          id: "rank",
          label: "Rank",
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
        { id: "salience", label: "Salience", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = ethnographicFreeListSalienceTermTool.execute;
export default ethnographicFreeListSalienceTermTool;
