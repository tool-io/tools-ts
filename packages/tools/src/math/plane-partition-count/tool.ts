import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type PlanePartitionCountInput = {
  readonly n: number;
};
export type PlanePartitionCountOutput = {
  readonly value: string;
};

export const planePartitionCountInputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    n: {
      type: "integer",
      minimum: 0,
      maximum: 200,
      description: "Nonnegative total (resource limit 200)",
    },
  },
  required: ["n"],
} as const satisfies ToolJsonSchema;
export const planePartitionCountOutputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: {
      type: "string",
      pattern: "^-?(0|[1-9][0-9]*)$",
      description: "Plane partition count",
    },
  },
  required: ["value"],
} as const satisfies ToolJsonSchema;

const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Definition and independently known values: https://dlmf.nist.gov/26.12; https://oeis.org/A000219
export const calculatePlanePartitionCount = (rawInput: unknown): ToolResult<PlanePartitionCountOutput> => {
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
  if (nValue > 200)
    return issue("n", "resource_limit", "Value must be at most 200.");
  const input: PlanePartitionCountInput = { n: nValue };
  const counts = Array<bigint>(input.n + 1).fill(0n);
  counts[0] = 1n;
  for (let part = 1; part <= input.n; part++) {
    for (let color = 0; color < part; color++) {
      for (let total = part; total <= input.n; total++) counts[total] = (counts[total] ?? 0n) + (counts[total - part] ?? 0n);
    }
  }
  return toolSuccess({ value: (counts[input.n] ?? 0n).toString() });
};

export const example = {
  input: {
    n: 4,
  },
  output: {
    value: "13",
  },
} satisfies ToolExample<PlanePartitionCountInput, PlanePartitionCountOutput>;

export const planePartitionCountTool = defineTool<PlanePartitionCountInput, PlanePartitionCountOutput>({
  id: "math/plane-partition-count",
  title: "Plane Partition Count",
  description: "Count plane partitions of n exactly from MacMahon’s generating product ∏(1−q^k)^(−k), including the empty partition; n is capped at 200.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: planePartitionCountInputSchema,
  outputSchema: planePartitionCountOutputSchema,
  ports: {
    inputs: [
      {
        id: "n",
        label: "Nonnegative total (resource limit 200)",
        required: true,
        valueType: {
          type: "integer",
        },
      },
    ],
    outputs: [
      {
        id: "value",
        label: "Plane partition count",
        valueType: {
          type: "string",
          format: "integer/arbitrary",
        },
      },
    ],
  },
  execute: calculatePlanePartitionCount,
});
export const runPlanePartitionCount = planePartitionCountTool.execute;
export default planePartitionCountTool;
