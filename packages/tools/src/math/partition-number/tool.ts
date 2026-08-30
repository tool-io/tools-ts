import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type PartitionNumberInput = {
  readonly n: number;
};
export type PartitionNumberOutput = {
  readonly value: string;
};

export const partitionNumberInputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    n: {
      type: "integer",
      minimum: 0,
      maximum: 1000,
      description: "Nonnegative total (resource limit 1000)",
    },
  },
  required: ["n"],
} as const satisfies ToolJsonSchema;
export const partitionNumberOutputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: {
      type: "string",
      pattern: "^-?(0|[1-9][0-9]*)$",
      description: "Integer partition count",
    },
  },
  required: ["value"],
} as const satisfies ToolJsonSchema;

const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Definition and independently known values: https://dlmf.nist.gov/26.9; https://oeis.org/A000041
export const calculatePartitionNumber = (rawInput: unknown): ToolResult<PartitionNumberOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as {
    readonly n?: unknown;
  };
  for (const key of Object.keys(candidate)) {
    if (!["n"].includes(key))
      return issue(key, "unknown_field", "Unsupported input field.");
  }
  const nValue = candidate.n;
  if (typeof nValue !== "number" || !Number.isSafeInteger(nValue))
    return issue("n", "invalid_type", "Enter a finite safe integer.");
  if (nValue < 0)
    return issue("n", "out_of_range", "Value must be at least 0.");
  if (nValue > 1000)
    return issue("n", "resource_limit", "Value must be at most 1000.");
  const input: PartitionNumberInput = { n: nValue };
  const counts = Array<bigint>(input.n + 1).fill(0n);
  counts[0] = 1n;
  for (let part = 1; part <= input.n; part++) {
    for (let total = part; total <= input.n; total++) counts[total] = (counts[total] ?? 0n) + (counts[total - part] ?? 0n);
  }
  return toolSuccess({ value: (counts[input.n] ?? 0n).toString() });
};

export const example = {
  input: {
    n: 20,
  },
  output: {
    value: "627",
  },
} satisfies ToolExample<PartitionNumberInput, PartitionNumberOutput>;

export const partitionNumberTool = defineTool<PartitionNumberInput, PartitionNumberOutput>({
  id: "math/partition-number",
  title: "Integer Partition Number",
  description: "Count unordered partitions of n into positive integer parts exactly, including the empty partition of zero; n is capped at 1,000 for bounded computation.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: partitionNumberInputSchema,
  outputSchema: partitionNumberOutputSchema,
  ports: {
    inputs: [
      {
        id: "n",
        label: "Nonnegative total (resource limit 1000)",
        required: true,
        valueType: {
          type: "integer",
        },
      },
    ],
    outputs: [
      {
        id: "value",
        label: "Integer partition count",
        valueType: {
          type: "string",
          format: "integer/arbitrary",
        },
      },
    ],
  },
  execute: calculatePartitionNumber,
});
export const runPartitionNumber = partitionNumberTool.execute;
export default partitionNumberTool;
