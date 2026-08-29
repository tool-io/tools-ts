import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult,
} from "../../core/result.js";

export type LuhnCheckInput = {
  /** Digits to validate; spaces and hyphens are ignored. */
  readonly value: string;
};

export type LuhnCheckOutput = {
  readonly digitCount: number;
  readonly valid: boolean;
};

export const luhnCheckInputSchema = {
  additionalProperties: false,
  properties: {
    value: {
      description: "Digits to validate; spaces and hyphens are ignored.",
      type: "string",
    },
  },
  required: ["value"],
  type: "object",
} as const;

export const luhnCheckOutputSchema = {
  additionalProperties: false,
  properties: {
    digitCount: {
      description: "Number of digits after normalization.",
      minimum: 0,
      type: "integer",
    },
    valid: {
      description: "Whether the digits satisfy the Luhn checksum.",
      type: "boolean",
    },
  },
  required: ["digitCount", "valid"],
  type: "object",
} as const;

export const luhnCheckExample = {
  input: { value: "4532 0151 1283 0366" },
  output: { digitCount: 16, valid: true },
} satisfies ToolExample<LuhnCheckInput, LuhnCheckOutput>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const MAX_LUHN_DIGITS = 40;

export const isLuhnCheckOutput = (value: unknown): value is LuhnCheckOutput =>
  isRecord(value) &&
  typeof value.valid === "boolean" &&
  Number.isSafeInteger(value.digitCount);

export const calculateLuhnCheck = (
  input: unknown,
): ToolResult<LuhnCheckOutput> => {
  if (!isRecord(input))
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ]);

  const issues: ToolIssue[] = [];
  for (const field of Object.keys(input))
    if (field !== "value")
      issues.push({
        code: "unknown_field",
        field,
        message: `${field} is not a supported input field.`,
      });
  if (issues.length > 0) return invalidInput(issues);

  const rawValue = input.value;
  if (rawValue === undefined) {
    issues.push({
      code: "value_required",
      field: "value",
      message: "value is required.",
    });
    return invalidInput(issues);
  }
  if (typeof rawValue !== "string") {
    issues.push({
      code: "value_invalid",
      field: "value",
      message: "value must be a string.",
    });
    return invalidInput(issues);
  }
  if (rawValue.length > 256) {
    issues.push({
      code: "resource_limit_exceeded",
      field: "value",
      message: "value must not exceed 256 characters.",
    });
    return invalidInput(issues);
  }

  const normalized = rawValue.replaceAll(/[ -]/g, "");
  if (!/^\d+$/.test(normalized)) {
    issues.push({
      code: "digits_required",
      field: "value",
      message:
        "value must contain only digits after removing spaces and hyphens.",
    });
    return invalidInput(issues);
  }
  if (normalized.length < 2 || normalized.length > MAX_LUHN_DIGITS) {
    issues.push({
      code: "length_invalid",
      field: "value",
      message: `value must contain between 2 and ${MAX_LUHN_DIGITS} digits.`,
    });
    return invalidInput(issues);
  }

  let sum = 0;
  for (let index = 0; index < normalized.length; index += 1) {
    let digit = Number(normalized[normalized.length - 1 - index]);
    if (index % 2 === 1) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }

  return toolSuccess({
    digitCount: normalized.length,
    valid: sum % 10 === 0,
  });
};

export const luhnCheckTool = defineTool<LuhnCheckInput, LuhnCheckOutput>({
  contractVersion: 1,
  description:
    "Validate a sequence of digits against the Luhn checksum used by cards and account numbers.",
  discovery: {
    aliases: ["card-number-check", "luhn-validator", "mod-10-check"],
    keywords: ["card", "checksum", "luhn", "validation"],
  },
  execute: calculateLuhnCheck,
  execution: { kind: "pure" },
  id: "validate/luhn",
  inputSchema: luhnCheckInputSchema,
  outputSchema: luhnCheckOutputSchema,
  ports: {
    inputs: [
      {
        description: "Digits to validate.",
        id: "value",
        label: "Digits",
        required: true,
        valueType: { format: "digit-string", type: "string" },
      },
    ],
    outputs: [
      {
        description: "Whether the checksum passes.",
        id: "valid",
        label: "Valid",
        valueType: { type: "boolean" },
      },
      {
        description: "Number of digits after normalization.",
        id: "digitCount",
        label: "Digit count",
        valueType: { format: "count", type: "integer" },
      },
    ],
  },
  title: "Luhn Checksum Validator",
});

export const runLuhnCheck = luhnCheckTool.execute;
export default luhnCheckTool;
