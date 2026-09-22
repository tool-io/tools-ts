import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly queryHeads: number;
  readonly keyValueHeads: number;
};
export type Output = {
  readonly queriesPerKv: number;
  readonly mapping: readonly number[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    queryHeads: { type: "integer", minimum: 1, maximum: 256 },
    keyValueHeads: { type: "integer", minimum: 1 },
  },
  required: ["queryHeads", "keyValueHeads"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    queriesPerKv: { type: "integer" },
    mapping: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["queriesPerKv", "mapping"],
} as const;
/** Contiguous grouped-query head assignment with equal-sized groups. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { queryHeads, keyValueHeads } = request;
  const compute = (): Output => {
    H.integer(queryHeads, 1, 256);
    H.integer(keyValueHeads, 1, queryHeads);
    H.domain(queryHeads % keyValueHeads === 0);
    return {
      queriesPerKv: queryHeads / keyValueHeads,
      mapping: Array.from({ length: queryHeads }, (_, i) =>
        Math.floor(i / (queryHeads / keyValueHeads)),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { queryHeads: 8, keyValueHeads: 2 },
  output: { queriesPerKv: 4, mapping: [0, 0, 0, 0, 1, 1, 1, 1] },
} satisfies ToolExample<Input, Output>;
export const groupedQueryHeadReplicationFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "artificial-intelligence/grouped-query-head-replication-factor",
    title: "Grouped Query Head Replication Factor Tool",
    description:
      "Contiguous grouped-query head assignment with equal-sized groups.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        queryHeads: { type: "integer", minimum: 1, maximum: 256 },
        keyValueHeads: { type: "integer", minimum: 1 },
      },
      required: ["queryHeads", "keyValueHeads"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        queriesPerKv: { type: "integer" },
        mapping: { type: "array", maxItems: 256, items: { type: "integer" } },
      },
      required: ["queriesPerKv", "mapping"],
    },
    ports: {
      inputs: [
        {
          id: "queryHeads",
          label: "Query Heads",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "keyValueHeads",
          label: "Key Value Heads",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "queriesPerKv",
          label: "Queries Per Kv",
          valueType: { type: "integer" },
        },
        {
          id: "mapping",
          label: "Mapping",
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
    },
  },
  calculate,
});
export const run = groupedQueryHeadReplicationFactorTool.execute;
export default groupedQueryHeadReplicationFactorTool;
