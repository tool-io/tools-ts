import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type PartitionRankInput = {
  readonly parts: ReadonlyArray<number>;
};
export type PartitionRankOutput = {
  readonly rank: number;
};

export const partitionRankInputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    parts: {
      type: "array",
      items: {
        type: "integer",
        minimum: 1,
        maximum: 9007199254740991,
      },
      minItems: 0,
      maxItems: 1000,
      description: "Partition parts in nonincreasing order",
    },
  },
  required: ["parts"],
} as const satisfies ToolJsonSchema;
export const partitionRankOutputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rank: {
      type: "integer",
      minimum: -1000,
      maximum: 9007199254740991,
      description: "Dyson partition rank",
    },
  },
  required: ["rank"],
} as const satisfies ToolJsonSchema;

const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Definition and independently known values: https://oeis.org/A340601
export const calculatePartitionRank = (rawInput: unknown): ToolResult<PartitionRankOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as {
    readonly parts?: unknown;
  };
  for (const key of Object.keys(candidate)) {
    if (!["parts"].includes(key))
      return issue(key, "unknown_field", "Unsupported input field.");
  }
  const partsValue = candidate.parts;
  if (!Array.isArray(partsValue))
    return issue("parts", "invalid_type", "Enter a dense array.");
  if (partsValue.length < 0)
    return issue("parts", "out_of_range", "Array needs at least 0 entries.");
  if (partsValue.length > 1000)
    return issue("parts", "resource_limit", "Array exceeds the 1000-entry resource limit.");
  const validatedParts: number[] = [];
  for (let index = 0; index < partsValue.length; index++) {
    if (!Object.prototype.hasOwnProperty.call(partsValue, index))
      return issue(`parts.${index}`, "invalid_type", "Sparse arrays are not supported.");
    const item: unknown = partsValue[index];
    if (typeof item !== "number" || !Number.isSafeInteger(item))
      return issue(`parts.${index}`, "invalid_type", "Enter a finite safe integer.");
    if (item < 1)
      return issue(`parts.${index}`, "out_of_range", "Value must be at least 1.");
    if (item > 9007199254740991)
      return issue(`parts.${index}`, "out_of_range", "Value must be at most 9007199254740991.");
    validatedParts.push(item);
  }
  const input: PartitionRankInput = { parts: validatedParts };
  for (let index = 1; index < input.parts.length; index++) {
    const previous = input.parts[index - 1], current = input.parts[index];
    if (previous === undefined || current === undefined) throw new Error("Missing partition part");
    if (current > previous) return issue(`parts.${index}`, "invalid_partition", "Parts must be in nonincreasing order.");
  }
  const rank = input.parts.length === 0 ? 0 : (input.parts[0] ?? 0) - input.parts.length;
  return toolSuccess({ rank: rank === 0 ? 0 : rank });
};

export const example = {
  input: {
    parts: [4, 2, 1],
  },
  output: {
    rank: 1,
  },
} satisfies ToolExample<PartitionRankInput, PartitionRankOutput>;

export const partitionRankTool = defineTool<PartitionRankInput, PartitionRankOutput>({
  id: "math/partition-rank",
  title: "Partition Rank",
  description: "Return Dyson’s rank, largest part minus number of parts, for a nonincreasing positive-integer partition; the empty partition has rank zero and input is capped at 1,000 parts.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: partitionRankInputSchema,
  outputSchema: partitionRankOutputSchema,
  ports: {
    inputs: [
      {
        id: "parts",
        label: "Partition parts in nonincreasing order",
        required: true,
        valueType: {
          type: "list",
          items: {
            type: "integer",
          },
        },
      },
    ],
    outputs: [
      {
        id: "rank",
        label: "Dyson partition rank",
        valueType: {
          type: "integer",
        },
      },
    ],
  },
  execute: calculatePartitionRank,
});
export const runPartitionRank = partitionRankTool.execute;
export default partitionRankTool;
