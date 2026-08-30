import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type QFactorialInput = {
  readonly n: number;
};
export type QFactorialOutput = {
  readonly coefficients: ReadonlyArray<string>;
};

export const qFactorialInputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    n: {
      type: "integer",
      minimum: 0,
      maximum: 64,
      description: "q-factorial index (resource limit 64)",
    },
  },
  required: ["n"],
} as const satisfies ToolJsonSchema;
export const qFactorialOutputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coefficients: {
      type: "array",
      items: {
        type: "string",
        pattern: "^-?(0|[1-9][0-9]*)$",
      },
      description: "q-factorial coefficients from degree zero upward",
    },
  },
  required: ["coefficients"],
} as const satisfies ToolJsonSchema;

const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Definition and independently known values: https://dlmf.nist.gov/17.2
export const calculateQFactorial = (rawInput: unknown): ToolResult<QFactorialOutput> => {
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
  if (nValue > 64)
    return issue("n", "resource_limit", "Value must be at most 64.");
  const input: QFactorialInput = { n: nValue };
  let coefficients = [1n];
  for (let width = 1; width <= input.n; width++) {
    const next = Array<bigint>(coefficients.length + width - 1).fill(0n);
    let window = 0n;
    for (let degree = 0; degree < next.length; degree++) {
      window += coefficients[degree] ?? 0n;
      if (degree >= width) window -= coefficients[degree - width] ?? 0n;
      next[degree] = window;
    }
    coefficients = next;
  }
  return toolSuccess({ coefficients: coefficients.map((value) => value.toString()) });
};

export const example = {
  input: {
    n: 3,
  },
  output: {
    coefficients: ["1", "2", "2", "1"],
  },
} satisfies ToolExample<QFactorialInput, QFactorialOutput>;

export const qFactorialTool = defineTool<QFactorialInput, QFactorialOutput>({
  id: "math/q-factorial",
  title: "q-Factorial Polynomial",
  description: "Return exact coefficients of [n]_q!=∏(j=1…n)(1+q+…+q^(j−1)) in ascending degree order, including the empty product one and a 64-index resource limit.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: qFactorialInputSchema,
  outputSchema: qFactorialOutputSchema,
  ports: {
    inputs: [
      {
        id: "n",
        label: "q-factorial index (resource limit 64)",
        required: true,
        valueType: {
          type: "integer",
        },
      },
    ],
    outputs: [
      {
        id: "coefficients",
        label: "q-factorial coefficients from degree zero upward",
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
  execute: calculateQFactorial,
});
export const runQFactorial = qFactorialTool.execute;
export default qFactorialTool;
