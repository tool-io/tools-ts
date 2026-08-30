import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type VieteProductApproxInput = {
  readonly terms: number;
};
export type VieteProductApproxOutput = {
  readonly value: number;
};

export const vieteProductApproxInputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    terms: {
      type: "integer",
      minimum: 0,
      maximum: 10000,
      description: "Nested radical term count (resource limit 10000)",
    },
  },
  required: ["terms"],
} as const satisfies ToolJsonSchema;
export const vieteProductApproxOutputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: {
      type: "number",
      description: "Viète product approximation",
    },
  },
  required: ["value"],
} as const satisfies ToolJsonSchema;

const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Definition and independently known values: https://arxiv.org/abs/1702.00901
export const calculateVieteProductApprox = (rawInput: unknown): ToolResult<VieteProductApproxOutput> => {
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
  if (termsValue > 10000)
    return issue("terms", "resource_limit", "Value must be at most 10000.");
  const input: VieteProductApproxInput = { terms: termsValue };
  let radical = 0, value = 2;
  for (let term = 0; term < input.terms; term++) {
    radical = Math.sqrt(2 + radical);
    value *= 2 / radical;
    if (radical === 2) break;
  }
  return toolSuccess({ value });
};

export const example = {
  input: {
    terms: 1,
  },
  output: {
    value: 2.82842712474619,
  },
} satisfies ToolExample<VieteProductApproxInput, VieteProductApproxOutput>;

export const vieteProductApproxTool = defineTool<VieteProductApproxInput, VieteProductApproxOutput>({
  id: "math/viete-product-approx",
  title: "Pi from Viète’s Product",
  description: "Approximate π by 2∏(j=1…m)2/a_j with a₁=√2 and a_(j+1)=√(2+a_j), including the empty product two and a 10,000-term resource limit.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: vieteProductApproxInputSchema,
  outputSchema: vieteProductApproxOutputSchema,
  ports: {
    inputs: [
      {
        id: "terms",
        label: "Nested radical term count (resource limit 10000)",
        required: true,
        valueType: {
          type: "integer",
        },
      },
    ],
    outputs: [
      {
        id: "value",
        label: "Viète product approximation",
        valueType: {
          type: "number",
        },
      },
    ],
  },
  execute: calculateVieteProductApprox,
});
export const runVieteProductApprox = vieteProductApproxTool.execute;
export default vieteProductApproxTool;
