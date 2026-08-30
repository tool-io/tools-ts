import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import { toolResourceLimits } from "../../core/limits.js";
import { invalidInput, toolSuccess } from "../../core/result.js";

export type DigitCountInput = { readonly value: string | number };
export type DigitCountOutput = { readonly digits: number };

const decimalIntegerSchema = {
  type: "string",
  minLength: 1,
  maxLength: toolResourceLimits.textCharacters,
  pattern: "^[+-]?[0-9]+(?![\\s\\S])",
} as const satisfies ToolJsonSchema;
const valueSchema = {
  anyOf: [
    decimalIntegerSchema,
    {
      type: "integer",
      minimum: Number.MIN_SAFE_INTEGER,
      maximum: Number.MAX_SAFE_INTEGER,
    },
  ],
} as const satisfies ToolJsonSchema;

export const digitCountTool = defineTool<DigitCountInput, DigitCountOutput>({
  contractVersion: 1,
  id: "number/digit-count",
  title: "Digit Count Calculator",
  description:
    "Count the base-10 digits of an integer without counting its sign or leading zeros. Enter long integers as decimal text to preserve every digit; safe numeric inputs are also accepted. Zero has one digit.",
  execution: { kind: "pure" },
  inputSchema: {
    type: "object",
    additionalProperties: false,
    properties: { value: valueSchema },
    required: ["value"],
  },
  outputSchema: {
    type: "object",
    additionalProperties: false,
    properties: { digits: { type: "integer", minimum: 1 } },
    required: ["digits"],
  },
  ports: {
    inputs: [
      {
        id: "value",
        label: "Integer",
        description:
          "Decimal digits with an optional + or - sign; no separators or exponent notation.",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      { id: "digits", label: "Digit count", valueType: { type: "integer" } },
    ],
  },
  execute: (input) => {
    if (typeof input !== "object" || input === null || Array.isArray(input))
      return invalidInput([
        {
          code: "object_required",
          field: "",
          message: "Input must be an object.",
        },
      ]);
    const unknownFields = Object.keys(input).filter(
      (field) => field !== "value",
    );
    if (unknownFields.length)
      return invalidInput(
        unknownFields.map((field) => ({
          code: "unknown_field",
          field,
          message: `${field} is not a supported input field.`,
        })),
      );
    const value = (input as Record<string, unknown>).value;
    if (!matchesToolJsonSchema(value, valueSchema))
      return invalidInput([
        {
          code: "invalid_integer",
          field: "value",
          message:
            "Enter an integer as decimal text (optional sign, no separators). Numeric inputs must be safe integers; use text for longer values.",
        },
      ]);
    const decimal =
      typeof value === "number" ? String(value) : (value as string);
    const magnitude = decimal.replace(/^[+-]/u, "").replace(/^0+/u, "");
    return toolSuccess({ digits: Math.max(1, magnitude.length) });
  },
});
export const runDigitCount = digitCountTool.execute;
export default digitCountTool;
