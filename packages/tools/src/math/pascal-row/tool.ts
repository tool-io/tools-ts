import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type PascalRowInput = {
  readonly n: number;
};
export type PascalRowOutput = {
  readonly coefficients: ReadonlyArray<string>;
};

export const pascalRowInputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    n: {
      type: "integer",
      minimum: 0,
      maximum: 1000,
      description: "Zero-indexed row (resource limit 1000)",
    },
  },
  required: ["n"],
} as const satisfies ToolJsonSchema;
export const pascalRowOutputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coefficients: {
      type: "array",
      items: {
        type: "string",
        pattern: "^-?(0|[1-9][0-9]*)$",
      },
      description: "Exact row coefficients",
    },
  },
  required: ["coefficients"],
} as const satisfies ToolJsonSchema;

const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Callers bound indices before using this exact product formula.
export const binomial = (n: number, k: number): bigint => {
  if (k < 0 || k > n) return 0n;
  const width = Math.min(k, n - k);
  let result = 1n;
  for (let i = 1; i <= width; i++) result = result * BigInt(n - width + i) / BigInt(i);
  return result;
};

// Definition and independently known values: https://dlmf.nist.gov/26.3
export const calculatePascalRow = (rawInput: unknown): ToolResult<PascalRowOutput> => {
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
  const input: PascalRowInput = { n: nValue };
  const coefficients: string[] = [];
  let value = 1n;
  for (let k = 0; k <= input.n; k++) {
    coefficients.push(value.toString());
    if (k < input.n) value = value * BigInt(input.n - k) / BigInt(k + 1);
  }
  return toolSuccess({ coefficients });
};

export const example = {
  input: {
    n: 5,
  },
  output: {
    coefficients: ["1", "5", "10", "10", "5", "1"],
  },
} satisfies ToolExample<PascalRowInput, PascalRowOutput>;

export const pascalRowTool = defineTool<PascalRowInput, PascalRowOutput>({
  id: "math/pascal-row",
  title: "Pascal Triangle Row",
  description: "Return the zero-indexed nth row of Pascal’s triangle as exact decimal binomial coefficients; n is capped at 1,000 to bound the output.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: pascalRowInputSchema,
  outputSchema: pascalRowOutputSchema,
  ports: {
    inputs: [
      {
        id: "n",
        label: "Zero-indexed row (resource limit 1000)",
        required: true,
        valueType: {
          type: "integer",
        },
      },
    ],
    outputs: [
      {
        id: "coefficients",
        label: "Exact row coefficients",
        valueType: {
          type: "list",
          items: {
            type: "string",
            format: "integer/arbitrary",
          },
        },
      },
    ],
  },
  execute: calculatePascalRow,
});
export const runPascalRow = pascalRowTool.execute;
export default pascalRowTool;
