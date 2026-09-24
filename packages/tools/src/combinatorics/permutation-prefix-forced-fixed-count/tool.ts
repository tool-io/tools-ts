import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly prefixValues: readonly number[];
  readonly totalSize: number;
  readonly origin: number;
};
export type Output = {
  readonly fixedInPrefix: number;
  readonly remainingPositions: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    prefixValues: { type: "array", maxItems: 256, items: { type: "integer" } },
    totalSize: { type: "integer", minimum: 0 },
    origin: { type: "integer" },
  },
  required: ["prefixValues", "totalSize", "origin"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fixedInPrefix: { type: "integer" },
    remainingPositions: { type: "integer" },
  },
  required: ["fixedInPrefix", "remainingPositions"],
} as const;
/** Count already forced fixed positions in a supplied permutation prefix, without counting its possible completions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { prefixValues, totalSize, origin } = request;
  const compute = (): Output => {
    H.domain(origin === 0 || origin === 1);
    H.integer(totalSize, 0);
    H.domain(
      prefixValues.length <= totalSize &&
        new Set(prefixValues).size === prefixValues.length &&
        prefixValues.every((x) => x >= origin && x < origin + totalSize),
    );
    return {
      fixedInPrefix: prefixValues.filter((x, i) => x === i + origin).length,
      remainingPositions: totalSize - prefixValues.length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { prefixValues: [1, 3, 2], totalSize: 5, origin: 1 },
  output: { fixedInPrefix: 1, remainingPositions: 2 },
} satisfies ToolExample<Input, Output>;
export const permutationPrefixForcedFixedCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "combinatorics/permutation-prefix-forced-fixed-count",
    title: "Permutation Prefix Forced Fixed Count Tool",
    description:
      "Count already forced fixed positions in a supplied permutation prefix, without counting its possible completions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        prefixValues: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        totalSize: { type: "integer", minimum: 0 },
        origin: { type: "integer" },
      },
      required: ["prefixValues", "totalSize", "origin"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fixedInPrefix: { type: "integer" },
        remainingPositions: { type: "integer" },
      },
      required: ["fixedInPrefix", "remainingPositions"],
    },
    ports: {
      inputs: [
        {
          id: "prefixValues",
          label: "Prefix Values",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "totalSize",
          label: "Total Size",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "origin",
          label: "Origin",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "fixedInPrefix",
          label: "Fixed In Prefix",
          valueType: { type: "integer" },
        },
        {
          id: "remainingPositions",
          label: "Remaining Positions",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = permutationPrefixForcedFixedCountTool.execute;
export default permutationPrefixForcedFixedCountTool;
