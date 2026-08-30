import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type SternBrocotMediantInput = {
  readonly leftNumerator: string;
  readonly leftDenominator: string;
  readonly rightNumerator: string;
  readonly rightDenominator: string;
};
export type SternBrocotMediantOutput = {
  readonly numerator: string;
  readonly denominator: string;
};

export const sternBrocotMediantInputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leftNumerator: {
      type: "string",
      pattern: "^(0|[1-9][0-9]*)$",
      maxLength: 200,
      description: "Left numerator",
    },
    leftDenominator: {
      type: "string",
      pattern: "^(0|[1-9][0-9]*)$",
      maxLength: 200,
      description: "Left denominator",
    },
    rightNumerator: {
      type: "string",
      pattern: "^(0|[1-9][0-9]*)$",
      maxLength: 200,
      description: "Right numerator",
    },
    rightDenominator: {
      type: "string",
      pattern: "^(0|[1-9][0-9]*)$",
      maxLength: 200,
      description: "Right denominator",
    },
  },
  required: ["leftNumerator", "leftDenominator", "rightNumerator", "rightDenominator"],
} as const satisfies ToolJsonSchema;
export const sternBrocotMediantOutputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    numerator: {
      type: "string",
      pattern: "^-?(0|[1-9][0-9]*)$",
      description: "Mediant numerator",
    },
    denominator: {
      type: "string",
      pattern: "^-?(0|[1-9][0-9]*)$",
      description: "Mediant denominator",
    },
  },
  required: ["numerator", "denominator"],
} as const satisfies ToolJsonSchema;

const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Definition and independently known values: https://oeis.org/A002487
export const calculateSternBrocotMediant = (rawInput: unknown): ToolResult<SternBrocotMediantOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as {
    readonly leftNumerator?: unknown;
    readonly leftDenominator?: unknown;
    readonly rightNumerator?: unknown;
    readonly rightDenominator?: unknown;
  };
  for (const key of Object.keys(candidate)) {
    if (!["leftNumerator", "leftDenominator", "rightNumerator", "rightDenominator"].includes(key))
      return issue(key, "unknown_field", "Unsupported input field.");
  }
  const leftNumeratorValue = candidate.leftNumerator;
  if (typeof leftNumeratorValue !== "string")
    return issue("leftNumerator", "invalid_type", "Enter an integer as a decimal string.");
  if (leftNumeratorValue.length > 200)
    return issue("leftNumerator", "resource_limit", "Decimal input exceeds the 200-character resource limit.");
  if (!/^(0|[1-9][0-9]*)$/.test(leftNumeratorValue))
    return issue("leftNumerator", "invalid_format", "Enter a canonical decimal integer with the required sign.");
  const leftDenominatorValue = candidate.leftDenominator;
  if (typeof leftDenominatorValue !== "string")
    return issue("leftDenominator", "invalid_type", "Enter an integer as a decimal string.");
  if (leftDenominatorValue.length > 200)
    return issue("leftDenominator", "resource_limit", "Decimal input exceeds the 200-character resource limit.");
  if (!/^(0|[1-9][0-9]*)$/.test(leftDenominatorValue))
    return issue("leftDenominator", "invalid_format", "Enter a canonical decimal integer with the required sign.");
  const rightNumeratorValue = candidate.rightNumerator;
  if (typeof rightNumeratorValue !== "string")
    return issue("rightNumerator", "invalid_type", "Enter an integer as a decimal string.");
  if (rightNumeratorValue.length > 200)
    return issue("rightNumerator", "resource_limit", "Decimal input exceeds the 200-character resource limit.");
  if (!/^(0|[1-9][0-9]*)$/.test(rightNumeratorValue))
    return issue("rightNumerator", "invalid_format", "Enter a canonical decimal integer with the required sign.");
  const rightDenominatorValue = candidate.rightDenominator;
  if (typeof rightDenominatorValue !== "string")
    return issue("rightDenominator", "invalid_type", "Enter an integer as a decimal string.");
  if (rightDenominatorValue.length > 200)
    return issue("rightDenominator", "resource_limit", "Decimal input exceeds the 200-character resource limit.");
  if (!/^(0|[1-9][0-9]*)$/.test(rightDenominatorValue))
    return issue("rightDenominator", "invalid_format", "Enter a canonical decimal integer with the required sign.");
  const input: SternBrocotMediantInput = { leftNumerator: leftNumeratorValue, leftDenominator: leftDenominatorValue, rightNumerator: rightNumeratorValue, rightDenominator: rightDenominatorValue };
  const a = BigInt(input.leftNumerator), b = BigInt(input.leftDenominator);
  const c = BigInt(input.rightNumerator), d = BigInt(input.rightDenominator);
  if (b * c - a * d !== 1n) return issue("rightNumerator", "invalid_neighbors", "Ordered neighbors must satisfy b*c-a*d=1.");
  return toolSuccess({ numerator: (a + c).toString(), denominator: (b + d).toString() });
};

export const example = {
  input: {
    leftNumerator: "1",
    leftDenominator: "3",
    rightNumerator: "1",
    rightDenominator: "2",
  },
  output: {
    numerator: "2",
    denominator: "5",
  },
} satisfies ToolExample<SternBrocotMediantInput, SternBrocotMediantOutput>;

export const sternBrocotMediantTool = defineTool<SternBrocotMediantInput, SternBrocotMediantOutput>({
  id: "math/stern-brocot-mediant",
  title: "Stern–Brocot Neighbor Mediant",
  description: "Insert the reduced mediant between ordered nonnegative Stern–Brocot neighbors satisfying b·c−a·d=1, including the boundary pair 0/1 and 1/0.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: sternBrocotMediantInputSchema,
  outputSchema: sternBrocotMediantOutputSchema,
  ports: {
    inputs: [
      {
        id: "leftNumerator",
        label: "Left numerator",
        required: true,
        valueType: {
          type: "string",
          format: "integer/arbitrary",
        },
      },
      {
        id: "leftDenominator",
        label: "Left denominator",
        required: true,
        valueType: {
          type: "string",
          format: "integer/arbitrary",
        },
      },
      {
        id: "rightNumerator",
        label: "Right numerator",
        required: true,
        valueType: {
          type: "string",
          format: "integer/arbitrary",
        },
      },
      {
        id: "rightDenominator",
        label: "Right denominator",
        required: true,
        valueType: {
          type: "string",
          format: "integer/arbitrary",
        },
      },
    ],
    outputs: [
      {
        id: "numerator",
        label: "Mediant numerator",
        valueType: {
          type: "string",
          format: "integer/arbitrary",
        },
      },
      {
        id: "denominator",
        label: "Mediant denominator",
        valueType: {
          type: "string",
          format: "integer/arbitrary",
        },
      },
    ],
  },
  execute: calculateSternBrocotMediant,
});
export const runSternBrocotMediant = sternBrocotMediantTool.execute;
export default sternBrocotMediantTool;
