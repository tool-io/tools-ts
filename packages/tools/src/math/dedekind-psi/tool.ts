import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { factorPositiveInteger } from "../practical-number-checker/tool.js";

export type DedekindPsiInput = {
  readonly n: number;
};
export type DedekindPsiOutput = {
  readonly value: string;
};

export const dedekindPsiInputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    n: {
      type: "integer",
      minimum: 1,
      maximum: 1000000000000,
      description: "Positive integer (trial-division resource limit 10^12)",
    },
  },
  required: ["n"],
} as const satisfies ToolJsonSchema;
export const dedekindPsiOutputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: {
      type: "string",
      pattern: "^-?(0|[1-9][0-9]*)$",
      description: "Dedekind psi value",
    },
  },
  required: ["value"],
} as const satisfies ToolJsonSchema;

const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Definition and independently known values: https://oeis.org/A001615
export const calculateDedekindPsi = (rawInput: unknown): ToolResult<DedekindPsiOutput> => {
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
  if (nValue < 1)
    return issue("n", "out_of_range", "Value must be at least 1.");
  if (nValue > 1000000000000)
    return issue("n", "resource_limit", "Value must be at most 1000000000000.");
  const input: DedekindPsiInput = { n: nValue };
  let value = 1n;
  for (const { prime, exponent } of factorPositiveInteger(input.n)) {
    const p = BigInt(prime);
    value *= p ** BigInt(exponent - 1) * (p + 1n);
  }
  return toolSuccess({ value: value.toString() });
};

export const example = {
  input: {
    n: 12,
  },
  output: {
    value: "24",
  },
} satisfies ToolExample<DedekindPsiInput, DedekindPsiOutput>;

export const dedekindPsiTool = defineTool<DedekindPsiInput, DedekindPsiOutput>({
  id: "math/dedekind-psi",
  title: "Dedekind Psi Function",
  description: "Return ψ(n)=n∏(p|n)(1+1/p) exactly using distinct prime factors, with ψ(1)=1 and trial division limited to n≤10¹².",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: dedekindPsiInputSchema,
  outputSchema: dedekindPsiOutputSchema,
  ports: {
    inputs: [
      {
        id: "n",
        label: "Positive integer (trial-division resource limit 10^12)",
        required: true,
        valueType: {
          type: "integer",
        },
      },
    ],
    outputs: [
      {
        id: "value",
        label: "Dedekind psi value",
        valueType: {
          type: "string",
          format: "integer/arbitrary",
        },
      },
    ],
  },
  execute: calculateDedekindPsi,
});
export const runDedekindPsi = dedekindPsiTool.execute;
export default dedekindPsiTool;
