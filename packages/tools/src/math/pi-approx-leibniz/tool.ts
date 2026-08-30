import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type PiApproxLeibnizInput = {
  readonly terms: number;
};
export type PiApproxLeibnizOutput = {
  readonly value: number;
  readonly truncationBound: number;
};

export const piApproxLeibnizInputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    terms: {
      type: "integer",
      minimum: 1,
      maximum: 100000,
      description: "Number of terms (resource limit 100000)",
    },
  },
  required: ["terms"],
} as const satisfies ToolJsonSchema;
export const piApproxLeibnizOutputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: {
      type: "number",
      description: "Leibniz series approximation",
    },
    truncationBound: {
      type: "number",
      description: "Alternating-series truncation bound (excludes floating-point rounding)",
    },
  },
  required: ["value", "truncationBound"],
} as const satisfies ToolJsonSchema;

const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Definition and independently known values: https://dlmf.nist.gov/4.24
export const calculatePiApproxLeibniz = (rawInput: unknown): ToolResult<PiApproxLeibnizOutput> => {
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
  if (termsValue > 100000)
    return issue("terms", "resource_limit", "Value must be at most 100000.");
  const input: PiApproxLeibnizInput = { terms: termsValue };
  let sum = 0, correction = 0;
  for (let pair = 0; pair < Math.floor(input.terms / 2); pair++) {
    const first = 4 * pair + 1;
    const term = 8 / (first * (first + 2));
    const adjusted = term - correction;
    const next = sum + adjusted;
    correction = (next - sum) - adjusted;
    sum = next;
  }
  if (input.terms % 2 === 1) sum += 4 / (2 * input.terms - 1);
  return toolSuccess({ value: sum, truncationBound: 4 / (2 * input.terms + 1) });
};

export const example = {
  input: {
    terms: 2,
  },
  output: {
    value: 2.6666666666666665,
    truncationBound: 0.8,
  },
} satisfies ToolExample<PiApproxLeibnizInput, PiApproxLeibnizOutput>;

export const piApproxLeibnizTool = defineTool<PiApproxLeibnizInput, PiApproxLeibnizOutput>({
  id: "math/pi-approx-leibniz",
  title: "Pi from the Leibniz Series",
  description: "Approximate π with the requested terms of 4Σ(−1)^k/(2k+1), grouping adjacent terms to reduce cancellation; computation is capped at 100,000 terms.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: piApproxLeibnizInputSchema,
  outputSchema: piApproxLeibnizOutputSchema,
  ports: {
    inputs: [
      {
        id: "terms",
        label: "Number of terms (resource limit 100000)",
        required: true,
        valueType: {
          type: "integer",
        },
      },
    ],
    outputs: [
      {
        id: "value",
        label: "Leibniz series approximation",
        valueType: {
          type: "number",
        },
      },
      {
        id: "truncationBound",
        label: "Alternating-series truncation bound (excludes floating-point rounding)",
        valueType: {
          type: "number",
        },
      },
    ],
  },
  execute: calculatePiApproxLeibniz,
});
export const runPiApproxLeibniz = piApproxLeibnizTool.execute;
export default piApproxLeibnizTool;
