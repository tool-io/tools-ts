import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type PartitionIntoKthPowersInput = {
  readonly total: number;
  readonly power: number;
};
export type PartitionIntoKthPowersOutput = {
  readonly value: string;
};

export const partitionIntoKthPowersInputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    total: {
      type: "integer",
      minimum: 0,
      maximum: 2000,
      description: "Nonnegative total (resource limit 2000)",
    },
    power: {
      type: "integer",
      minimum: 1,
      maximum: 9007199254740991,
      description: "Positive integer power",
    },
  },
  required: ["total", "power"],
} as const satisfies ToolJsonSchema;
export const partitionIntoKthPowersOutputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: {
      type: "string",
      pattern: "^-?(0|[1-9][0-9]*)$",
      description: "Partition count using positive kth-power parts",
    },
  },
  required: ["value"],
} as const satisfies ToolJsonSchema;

const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

const boundedPower = (base: number, exponent: number, limit: number): number | undefined => {
  if (base === 1) return 1;
  let value = 1;
  for (let power = 0; power < exponent; power++) {
    if (value > limit / base) return undefined;
    value *= base;
  }
  return value;
};

// Definition and independently known values: https://dlmf.nist.gov/26.9; https://oeis.org/A001156
export const calculatePartitionIntoKthPowers = (rawInput: unknown): ToolResult<PartitionIntoKthPowersOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as {
    readonly total?: unknown;
    readonly power?: unknown;
  };
  for (const key of Object.keys(candidate)) {
    if (!["total", "power"].includes(key))
      return issue(key, "unknown_field", "Unsupported input field.");
  }
  const totalValue = candidate.total;
  if (typeof totalValue !== "number" || !Number.isSafeInteger(totalValue))
    return issue("total", "invalid_type", "Enter a finite safe integer.");
  if (totalValue < 0)
    return issue("total", "out_of_range", "Value must be at least 0.");
  if (totalValue > 2000)
    return issue("total", "resource_limit", "Value must be at most 2000.");
  const powerValue = candidate.power;
  if (typeof powerValue !== "number" || !Number.isSafeInteger(powerValue))
    return issue("power", "invalid_type", "Enter a finite safe integer.");
  if (powerValue < 1)
    return issue("power", "out_of_range", "Value must be at least 1.");
  if (powerValue > 9007199254740991)
    return issue("power", "out_of_range", "Value must be at most 9007199254740991.");
  const input: PartitionIntoKthPowersInput = { total: totalValue, power: powerValue };
  const counts = Array<bigint>(input.total + 1).fill(0n);
  counts[0] = 1n;
  for (let base = 1; ; base++) {
    const part = boundedPower(base, input.power, input.total);
    if (part === undefined || part > input.total) break;
    for (let total = part; total <= input.total; total++) counts[total] = (counts[total] ?? 0n) + (counts[total - part] ?? 0n);
  }
  return toolSuccess({ value: (counts[input.total] ?? 0n).toString() });
};

export const example = {
  input: {
    total: 10,
    power: 2,
  },
  output: {
    value: "4",
  },
} satisfies ToolExample<PartitionIntoKthPowersInput, PartitionIntoKthPowersOutput>;

export const partitionIntoKthPowersTool = defineTool<PartitionIntoKthPowersInput, PartitionIntoKthPowersOutput>({
  id: "math/partition-into-kth-powers",
  title: "Partitions into kth Powers",
  description: "Count unordered partitions of a nonnegative total into positive kth powers with repetition, using exact counts, any positive safe-integer exponent, and a total limit of 2,000.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: partitionIntoKthPowersInputSchema,
  outputSchema: partitionIntoKthPowersOutputSchema,
  ports: {
    inputs: [
      {
        id: "total",
        label: "Nonnegative total (resource limit 2000)",
        required: true,
        valueType: {
          type: "integer",
        },
      },
      {
        id: "power",
        label: "Positive integer power",
        required: true,
        valueType: {
          type: "integer",
        },
      },
    ],
    outputs: [
      {
        id: "value",
        label: "Partition count using positive kth-power parts",
        valueType: {
          type: "string",
          format: "integer/arbitrary",
        },
      },
    ],
  },
  execute: calculatePartitionIntoKthPowers,
});
export const runPartitionIntoKthPowers = partitionIntoKthPowersTool.execute;
export default partitionIntoKthPowersTool;
