import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly universe: readonly string[];
  readonly block: readonly string[];
};
export type Output = {
  readonly covered: number;
  readonly outside: readonly string[];
  readonly duplicates: number;
  readonly remaining: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    universe: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    block: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["universe", "block"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    covered: { type: "integer" },
    outside: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    duplicates: { type: "integer" },
    remaining: { type: "integer" },
  },
  required: ["covered", "outside", "duplicates", "remaining"],
} as const;
/** Audit one proposed partition block for unique coverage, outside elements and repeated entries. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { universe, block } = request;
  const compute = (): Output => {
    H.domain(new Set(universe).size === universe.length);
    const unique = [...new Set(block)],
      inside = unique.filter((x) => universe.includes(x)),
      outside = unique.filter((x) => !universe.includes(x));
    return {
      covered: inside.length,
      outside,
      duplicates: block.length - unique.length,
      remaining: universe.length - inside.length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { universe: ["a", "b", "c"], block: ["a", "a", "x"] },
  output: { covered: 1, outside: ["x"], duplicates: 1, remaining: 2 },
} satisfies ToolExample<Input, Output>;
export const setPartitionOneBlockCoverageBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "set/set-partition-one-block-coverage-budget",
    title: "Set Partition One Block Coverage Budget Tool",
    description:
      "Audit one proposed partition block for unique coverage, outside elements and repeated entries.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        universe: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        block: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["universe", "block"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        covered: { type: "integer" },
        outside: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        duplicates: { type: "integer" },
        remaining: { type: "integer" },
      },
      required: ["covered", "outside", "duplicates", "remaining"],
    },
    ports: {
      inputs: [
        {
          id: "universe",
          label: "Universe",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "block",
          label: "Block",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        { id: "covered", label: "Covered", valueType: { type: "integer" } },
        {
          id: "outside",
          label: "Outside",
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "duplicates",
          label: "Duplicates",
          valueType: { type: "integer" },
        },
        { id: "remaining", label: "Remaining", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = setPartitionOneBlockCoverageBudgetTool.execute;
export default setPartitionOneBlockCoverageBudgetTool;
