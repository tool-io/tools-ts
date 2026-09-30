import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly length: number;
  readonly deleted: readonly number[];
  readonly survivorRank: number;
};
export type Output = { readonly originalIndex: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    length: { type: "integer", minimum: 1, maximum: 1000000 },
    deleted: { type: "array", maxItems: 256, items: { type: "integer" } },
    survivorRank: { type: "integer", minimum: 0 },
  },
  required: ["length", "deleted", "survivorRank"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { originalIndex: { type: "integer" } },
  required: ["originalIndex"],
} as const;
/** Recover an original zero-based index from its stable rank after deletion of distinct original indices. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { length, deleted, survivorRank } = request;
  const compute = (): Output => {
    H.integer(length, 1, 1000000);
    H.domain(
      new Set(deleted).size === deleted.length &&
        deleted.every((x) => x >= 0 && x < length),
    );
    H.integer(survivorRank, 0, length - deleted.length - 1);
    const sorted = [...deleted].sort((a, b) => a - b);
    let originalIndex = survivorRank;
    for (const x of sorted) if (x <= originalIndex) originalIndex++;
    return { originalIndex };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { length: 8, deleted: [1, 3], survivorRank: 2 },
  output: { originalIndex: 4 },
} satisfies ToolExample<Input, Output>;
export const listStableDeleteInverseRankTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "list/list-stable-delete-inverse-rank",
    title: "List Stable Delete Inverse Rank Tool",
    description:
      "Recover an original zero-based index from its stable rank after deletion of distinct original indices.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        length: { type: "integer", minimum: 1, maximum: 1000000 },
        deleted: { type: "array", maxItems: 256, items: { type: "integer" } },
        survivorRank: { type: "integer", minimum: 0 },
      },
      required: ["length", "deleted", "survivorRank"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { originalIndex: { type: "integer" } },
      required: ["originalIndex"],
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
          id: "deleted",
          label: "Deleted",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "survivorRank",
          label: "Survivor Rank",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "originalIndex",
          label: "Original Index",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = listStableDeleteInverseRankTool.execute;
export default listStableDeleteInverseRankTool;
