import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type PartitionCrankInput = {
  readonly parts: ReadonlyArray<number>;
};
export type PartitionCrankOutput = {
  readonly crank: number;
};

export const partitionCrankInputSchema = {
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
      description: "Partition parts in nonincreasing order (resource limit 1000)",
    },
  },
  required: ["parts"],
} as const satisfies ToolJsonSchema;
export const partitionCrankOutputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    crank: {
      type: "integer",
      minimum: -1000,
      maximum: 9007199254740991,
      description: "Partition crank",
    },
  },
  required: ["crank"],
} as const satisfies ToolJsonSchema;

const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Definition and independently known values: https://oeis.org/A064410; https://arxiv.org/abs/2009.10873
export const calculatePartitionCrank = (rawInput: unknown): ToolResult<PartitionCrankOutput> => {
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
  const input: PartitionCrankInput = { parts: validatedParts };
  for (let index = 1; index < input.parts.length; index++) {
    const previous = input.parts[index - 1], current = input.parts[index];
    if (previous === undefined || current === undefined) throw new Error("Missing partition part");
    if (current > previous) return issue(`parts.${index}`, "invalid_partition", "Parts must be in nonincreasing order.");
  }
  const ones = input.parts.filter((part) => part === 1).length;
  const crank = ones === 0 ? input.parts[0] ?? 0 : input.parts.filter((part) => part > ones).length - ones;
  return toolSuccess({ crank: crank === 0 ? 0 : crank });
};

export const example = {
  input: {
    parts: [3, 2, 1, 1],
  },
  output: {
    crank: -1,
  },
} satisfies ToolExample<PartitionCrankInput, PartitionCrankOutput>;

export const partitionCrankTool = defineTool<PartitionCrankInput, PartitionCrankOutput>({
  id: "math/partition-crank",
  title: "Partition Crank",
  description: "Return the partition crank: largest part if no ones occur, otherwise the number of parts greater than the number of ones minus that number; empty crank is zero.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: partitionCrankInputSchema,
  outputSchema: partitionCrankOutputSchema,
  ports: {
    inputs: [
      {
        id: "parts",
        label: "Partition parts in nonincreasing order (resource limit 1000)",
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
        id: "crank",
        label: "Partition crank",
        valueType: {
          type: "integer",
        },
      },
    ],
  },
  execute: calculatePartitionCrank,
});
export const runPartitionCrank = partitionCrankTool.execute;
export default partitionCrankTool;
