import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type EApproxSeriesInput = {
  readonly terms: number;
};
export type EApproxSeriesOutput = {
  readonly value: number;
};

export const eApproxSeriesInputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    terms: {
      type: "integer",
      minimum: 1,
      maximum: 10000,
      description: "Number of terms (resource limit 10000)",
    },
  },
  required: ["terms"],
} as const satisfies ToolJsonSchema;
export const eApproxSeriesOutputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: {
      type: "number",
      description: "Factorial series approximation",
    },
  },
  required: ["value"],
} as const satisfies ToolJsonSchema;

const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Definition and independently known values: https://dlmf.nist.gov/4.2
export const calculateEApproxSeries = (rawInput: unknown): ToolResult<EApproxSeriesOutput> => {
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
  if (termsValue < 1)
    return issue("terms", "out_of_range", "Value must be at least 1.");
  if (termsValue > 10000)
    return issue("terms", "resource_limit", "Value must be at most 10000.");
  const input: EApproxSeriesInput = { terms: termsValue };
  let sum = 1, correction = 0, term = 1;
  for (let k = 1; k < input.terms; k++) {
    term /= k;
    if (term === 0) break;
    const adjusted = term - correction;
    const next = sum + adjusted;
    correction = (next - sum) - adjusted;
    sum = next;
  }
  return toolSuccess({ value: sum });
};

export const example = {
  input: {
    terms: 4,
  },
  output: {
    value: 2.6666666666666665,
  },
} satisfies ToolExample<EApproxSeriesInput, EApproxSeriesOutput>;

export const eApproxSeriesTool = defineTool<EApproxSeriesInput, EApproxSeriesOutput>({
  id: "math/e-approx-series",
  title: "Euler’s Number from the Factorial Series",
  description: "Approximate e by summing the first requested terms of Σ1/k!, beginning with k=0, using compensated floating-point addition and a 10,000-term resource limit.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: eApproxSeriesInputSchema,
  outputSchema: eApproxSeriesOutputSchema,
  ports: {
    inputs: [
      {
        id: "terms",
        label: "Number of terms (resource limit 10000)",
        required: true,
        valueType: {
          type: "integer",
        },
      },
    ],
    outputs: [
      {
        id: "value",
        label: "Factorial series approximation",
        valueType: {
          type: "number",
        },
      },
    ],
  },
  execute: calculateEApproxSeries,
});
export const runEApproxSeries = eApproxSeriesTool.execute;
export default eApproxSeriesTool;
