import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type Math3nPlus1StepInput = {
  readonly n: string;
};
export type Math3nPlus1StepOutput = {
  readonly value: string;
};

export const math3nPlus1StepInputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    n: {
      type: "string",
      pattern: "^[1-9][0-9]*$",
      maxLength: 200,
      description: "Positive starting decimal integer",
    },
  },
  required: ["n"],
} as const satisfies ToolJsonSchema;
export const math3nPlus1StepOutputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: {
      type: "string",
      pattern: "^-?(0|[1-9][0-9]*)$",
      description: "Next Collatz term",
    },
  },
  required: ["value"],
} as const satisfies ToolJsonSchema;

const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Definition and independently known values: https://oeis.org/A006370
export const calculateMath3nPlus1Step = (rawInput: unknown): ToolResult<Math3nPlus1StepOutput> => {
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
  if (typeof nValue !== "string")
    return issue("n", "invalid_type", "Enter an integer as a decimal string.");
  if (nValue.length > 200)
    return issue("n", "resource_limit", "Decimal input exceeds the 200-character resource limit.");
  if (!/^[1-9][0-9]*$/.test(nValue))
    return issue("n", "invalid_format", "Enter a canonical decimal integer with the required sign.");
  const input: Math3nPlus1StepInput = { n: nValue };
  const n = BigInt(input.n);
  return toolSuccess({ value: (n % 2n === 0n ? n / 2n : 3n * n + 1n).toString() });
};

export const example = {
  input: {
    n: "27",
  },
  output: {
    value: "82",
  },
} satisfies ToolExample<Math3nPlus1StepInput, Math3nPlus1StepOutput>;

export const math3nPlus1StepTool = defineTool<Math3nPlus1StepInput, Math3nPlus1StepOutput>({
  id: "math/3n-plus-1-step",
  title: "One Collatz 3n+1 Step",
  description: "Return one full Collatz step for a positive decimal integer: n/2 when even and 3n+1 when odd, including 1→4 and an input limit of 200 characters.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: math3nPlus1StepInputSchema,
  outputSchema: math3nPlus1StepOutputSchema,
  ports: {
    inputs: [
      {
        id: "n",
        label: "Positive starting decimal integer",
        required: true,
        valueType: {
          type: "string",
          format: "integer/arbitrary",
        },
      },
    ],
    outputs: [
      {
        id: "value",
        label: "Next Collatz term",
        valueType: {
          type: "string",
          format: "integer/arbitrary",
        },
      },
    ],
  },
  execute: calculateMath3nPlus1Step,
});
export const runMath3nPlus1Step = math3nPlus1StepTool.execute;
export default math3nPlus1StepTool;
