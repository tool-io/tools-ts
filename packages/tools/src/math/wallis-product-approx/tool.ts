import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type WallisProductApproxInput = {
  readonly terms: number;
};
export type WallisProductApproxOutput = {
  readonly value: number;
};

export const wallisProductApproxInputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    terms: {
      type: "integer",
      minimum: 0,
      maximum: 1000000,
      description: "Product term count (resource limit 1000000)",
    },
  },
  required: ["terms"],
} as const satisfies ToolJsonSchema;
export const wallisProductApproxOutputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: {
      type: "number",
      description: "Wallis product approximation",
    },
  },
  required: ["value"],
} as const satisfies ToolJsonSchema;

const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Definition and independently known values: https://dlmf.nist.gov/4.22
export const calculateWallisProductApprox = (rawInput: unknown): ToolResult<WallisProductApproxOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as {
    readonly terms?: unknown;
  };
  for (const key of Object.keys(candidate)) {
    if (!["terms"].includes(key))
      return issue(key, "unknown_field", "Unsupported input field.");
  }
  const termsValue = candidate.terms;
  if (typeof termsValue !== "number" || !Number.isSafeInteger(termsValue))
    return issue("terms", "invalid_type", "Enter a finite safe integer.");
  if (termsValue < 0)
    return issue("terms", "out_of_range", "Value must be at least 0.");
  if (termsValue > 1000000)
    return issue("terms", "resource_limit", "Value must be at most 1000000.");
  const input: WallisProductApproxInput = { terms: termsValue };
  let value = 2;
  for (let k = 1; k <= input.terms; k++) value *= 1 + 1 / ((2 * k - 1) * (2 * k + 1));
  return toolSuccess({ value });
};

export const example = {
  input: {
    terms: 1,
  },
  output: {
    value: 2.6666666666666665,
  },
} satisfies ToolExample<WallisProductApproxInput, WallisProductApproxOutput>;

export const wallisProductApproxTool = defineTool<WallisProductApproxInput, WallisProductApproxOutput>({
  id: "math/wallis-product-approx",
  title: "Pi from the Wallis Product",
  description: "Approximate π by 2∏(k=1…m)4k²/(4k²−1), using the empty product value two when m=0 and a 1,000,000-term resource limit.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: wallisProductApproxInputSchema,
  outputSchema: wallisProductApproxOutputSchema,
  ports: {
    inputs: [
      {
        id: "terms",
        label: "Product term count (resource limit 1000000)",
        required: true,
        valueType: {
          type: "integer",
        },
      },
    ],
    outputs: [
      {
        id: "value",
        label: "Wallis product approximation",
        valueType: {
          type: "number",
        },
      },
    ],
  },
  execute: calculateWallisProductApprox,
});
export const runWallisProductApprox = wallisProductApproxTool.execute;
export default wallisProductApproxTool;
