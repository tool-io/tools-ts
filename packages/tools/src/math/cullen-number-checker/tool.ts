import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type CullenNumberCheckerInput = {
  readonly n: string;
};
export type CullenNumberCheckerOutput = {
  readonly isCullen: boolean;
};

export const cullenNumberCheckerInputSchema = {
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
export const cullenNumberCheckerOutputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    isCullen: {
      type: "boolean",
      description: "Whether n is a Cullen number",
    },
  },
  required: ["isCullen"],
} as const satisfies ToolJsonSchema;

const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Definition and independently known values: https://oeis.org/A002064
export const calculateCullenNumberChecker = (rawInput: unknown): ToolResult<CullenNumberCheckerOutput> => {
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
  const input: CullenNumberCheckerInput = { n: nValue };
  const n = BigInt(input.n);
  for (let k = 0n; ; k++) {
    const candidate = (k << k) + 1n;
    if (candidate === n) return toolSuccess({ isCullen: true });
    if (candidate > n) return toolSuccess({ isCullen: false });
  }
};

export const example = {
  input: {
    n: "65",
  },
  output: {
    isCullen: true,
  },
} satisfies ToolExample<CullenNumberCheckerInput, CullenNumberCheckerOutput>;

export const cullenNumberCheckerTool = defineTool<CullenNumberCheckerInput, CullenNumberCheckerOutput>({
  id: "math/cullen-number-checker",
  title: "Cullen Number Checker",
  description: "Check whether a nonnegative decimal integer has the form k·2^k+1 for k≥0, including the initial Cullen number one; input is capped at 200 characters.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: cullenNumberCheckerInputSchema,
  outputSchema: cullenNumberCheckerOutputSchema,
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
        id: "isCullen",
        label: "Whether n is a Cullen number",
        valueType: {
          type: "boolean",
        },
      },
    ],
  },
  execute: calculateCullenNumberChecker,
});
export const runCullenNumberChecker = cullenNumberCheckerTool.execute;
export default cullenNumberCheckerTool;
