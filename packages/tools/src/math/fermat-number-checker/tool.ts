import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type FermatNumberCheckerInput = {
  readonly n: string;
};
export type FermatNumberCheckerOutput = {
  readonly isFermat: boolean;
};

export const fermatNumberCheckerInputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    n: {
      type: "string",
      pattern: "^(0|[1-9][0-9]*)$",
      maxLength: 200,
      description: "Nonnegative decimal integer",
    },
  },
  required: ["n"],
} as const satisfies ToolJsonSchema;
export const fermatNumberCheckerOutputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    isFermat: {
      type: "boolean",
      description: "Whether n is a Fermat number",
    },
  },
  required: ["isFermat"],
} as const satisfies ToolJsonSchema;

const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Definition and independently known values: https://oeis.org/A000215
export const calculateFermatNumberChecker = (rawInput: unknown): ToolResult<FermatNumberCheckerOutput> => {
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
  if (!/^(0|[1-9][0-9]*)$/.test(nValue))
    return issue("n", "invalid_format", "Enter a canonical decimal integer with the required sign.");
  const input: FermatNumberCheckerInput = { n: nValue };
  const n = BigInt(input.n);
  if (n < 3n) return toolSuccess({ isFermat: false });
  const power = n - 1n;
  if ((power & (power - 1n)) !== 0n) return toolSuccess({ isFermat: false });
  const exponent = BigInt(power.toString(2).length - 1);
  return toolSuccess({ isFermat: exponent > 0n && (exponent & (exponent - 1n)) === 0n });
};

export const example = {
  input: {
    n: "4294967297",
  },
  output: {
    isFermat: true,
  },
} satisfies ToolExample<FermatNumberCheckerInput, FermatNumberCheckerOutput>;

export const fermatNumberCheckerTool = defineTool<FermatNumberCheckerInput, FermatNumberCheckerOutput>({
  id: "math/fermat-number-checker",
  title: "Fermat Number Checker",
  description: "Check whether a nonnegative decimal integer has the form 2^(2^k)+1 for k≥0, including composite Fermat numbers; input is capped at 200 characters.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: fermatNumberCheckerInputSchema,
  outputSchema: fermatNumberCheckerOutputSchema,
  ports: {
    inputs: [
      {
        id: "n",
        label: "Nonnegative decimal integer",
        required: true,
        valueType: {
          type: "string",
          format: "integer/arbitrary",
        },
      },
    ],
    outputs: [
      {
        id: "isFermat",
        label: "Whether n is a Fermat number",
        valueType: {
          type: "boolean",
        },
      },
    ],
  },
  execute: calculateFermatNumberChecker,
});
export const runFermatNumberChecker = fermatNumberCheckerTool.execute;
export default fermatNumberCheckerTool;
