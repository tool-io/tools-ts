import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type SchroederNumberInput = {
  readonly n: number;
};
export type SchroederNumberOutput = {
  readonly value: string;
};

export const schroederNumberInputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    n: {
      type: "integer",
      minimum: 0,
      maximum: 1000,
      description: "Path semilength (resource limit 1000)",
    },
  },
  required: ["n"],
} as const satisfies ToolJsonSchema;
export const schroederNumberOutputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: {
      type: "string",
      pattern: "^-?(0|[1-9][0-9]*)$",
      description: "Large Schröder number",
    },
  },
  required: ["value"],
} as const satisfies ToolJsonSchema;

const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Definition and independently known values: https://oeis.org/A006318
export const calculateSchroederNumber = (rawInput: unknown): ToolResult<SchroederNumberOutput> => {
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
  const input: SchroederNumberInput = { n: nValue };
  if (input.n === 0) return toolSuccess({ value: "1" });
  let previous = 1n, current = 2n;
  for (let n = 2; n <= input.n; n++) {
    const next = (3n * BigInt(2 * n - 1) * current - BigInt(n - 2) * previous) / BigInt(n + 1);
    [previous, current] = [current, next];
  }
  return toolSuccess({ value: current.toString() });
};

export const example = {
  input: {
    n: 5,
  },
  output: {
    value: "394",
  },
} satisfies ToolExample<SchroederNumberInput, SchroederNumberOutput>;

export const schroederNumberTool = defineTool<SchroederNumberInput, SchroederNumberOutput>({
  id: "math/schroeder-number",
  title: "Large Schröder Number",
  description: "Return the large Schröder number S(n) for paths of semilength n, with S(0)=1 and S(1)=2; n is capped at 1,000.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: schroederNumberInputSchema,
  outputSchema: schroederNumberOutputSchema,
  ports: {
    inputs: [
      {
        id: "n",
        label: "Path semilength (resource limit 1000)",
        required: true,
        valueType: {
          type: "integer",
        },
      },
    ],
    outputs: [
      {
        id: "value",
        label: "Large Schröder number",
        valueType: {
          type: "string",
          format: "integer/arbitrary",
        },
      },
    ],
  },
  execute: calculateSchroederNumber,
});
export const runSchroederNumber = schroederNumberTool.execute;
export default schroederNumberTool;
