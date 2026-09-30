import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly indices: readonly number[];
  readonly sourceLength: number;
};
export type Output = {
  readonly duplicates: readonly number[];
  readonly valid: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    indices: { type: "array", maxItems: 256, items: { type: "integer" } },
    sourceLength: { type: "integer", minimum: 0 },
  },
  required: ["indices", "sourceLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    duplicates: { type: "array", maxItems: 256, items: { type: "integer" } },
    valid: { type: "boolean" },
  },
  required: ["duplicates", "valid"],
} as const;
/** Compute list gather duplicate index flag from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { indices, sourceLength } = input;
  const compute = (): Output => {
    integer(sourceLength);
    const seen = new Set<number>(),
      duplicates: number[] = [];
    for (const i of indices) {
      if (seen.has(i) && !duplicates.includes(i)) duplicates.push(i);
      seen.add(i);
    }
    return {
      duplicates,
      valid: indices.every((x) => x >= 0 && x < sourceLength),
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { indices: [1, 2, 1, 1], sourceLength: 3 },
  output: { duplicates: [1], valid: true },
} satisfies ToolExample<Input, Output>;
export const listGatherDuplicateIndexFlagTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "list/list-gather-duplicate-index-flag",
  title: "List Gather Duplicate Index Flag Tool",
  description:
    "Compute list gather duplicate index flag from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "indices",
        label: "Indices",
        required: true,
        valueType: { type: "list", items: { type: "integer" } },
      },
      {
        id: "sourceLength",
        label: "Source Length",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      {
        id: "duplicates",
        label: "Duplicates",
        valueType: { type: "list", items: { type: "integer" } },
      },
      { id: "valid", label: "Valid", valueType: { type: "boolean" } },
    ],
  },
});
export const run = listGatherDuplicateIndexFlagTool.execute;
export default listGatherDuplicateIndexFlagTool;
