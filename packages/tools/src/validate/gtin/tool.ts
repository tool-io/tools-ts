import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess } from "../../core/result.js";
import {
  stripIdentifierSeparators,
  validGs1,
} from "../../standard-identifiers/shared.js";

export type ValidateGtinInput = { readonly identifier: string };
export type ValidateGtinOutput = {
  readonly normalized: string;
  readonly type: "GTIN-8" | "GTIN-12" | "GTIN-13" | "GTIN-14" | "unknown";
  readonly valid: boolean;
};

export const calculateValidateGtin = (input: unknown) => {
  if (
    typeof input !== "object" ||
    input === null ||
    Array.isArray(input) ||
    typeof (input as Record<string, unknown>).identifier !== "string"
  )
    return invalidInput([
      {
        code: "identifier_required",
        field: "identifier",
        message: "GTIN text is required.",
      },
    ]);
  if (Object.keys(input).some((field) => field !== "identifier"))
    return invalidInput([
      {
        code: "unknown_field",
        field: "",
        message: "Only identifier is supported.",
      },
    ]);
  const normalized = stripIdentifierSeparators(
    (input as ValidateGtinInput).identifier,
  );
  const length = normalized.length;
  const typeByLength: Readonly<
    Partial<Record<number, Exclude<ValidateGtinOutput["type"], "unknown">>>
  > = {
    8: "GTIN-8",
    12: "GTIN-12",
    13: "GTIN-13",
    14: "GTIN-14",
  };
  const type: ValidateGtinOutput["type"] = typeByLength[length] ?? "unknown";
  return toolSuccess({
    normalized,
    type,
    valid: type !== "unknown" && validGs1(normalized, length),
  });
};

export const example = {
  input: { identifier: "4006381333931" },
  output: { normalized: "4006381333931", type: "GTIN-13", valid: true },
} satisfies ToolExample<ValidateGtinInput, ValidateGtinOutput>;

export const gtinValidatorTool = defineTool<
  ValidateGtinInput,
  ValidateGtinOutput
>({
  contractVersion: 1,
  description:
    "Identify and validate GTIN-8, GTIN-12, GTIN-13, and GTIN-14 values by length, decimal syntax, and the common GS1 modulus-10 check digit.",
  discovery: {
    aliases: ["ean validator", "gtin checker", "upc validator"],
    collections: ["identifiers", "validate"],
    keywords: ["ean", "gs1", "product code", "upc"],
  },
  execute: calculateValidateGtin,
  execution: { kind: "pure" },
  id: "validate/gtin",
  inputSchema: {
    additionalProperties: false,
    properties: { identifier: { maxLength: 64, type: "string" } },
    required: ["identifier"],
    type: "object",
  },
  outputSchema: {
    additionalProperties: false,
    properties: {
      normalized: { type: "string" },
      type: {
        enum: ["GTIN-8", "GTIN-12", "GTIN-13", "GTIN-14", "unknown"],
        type: "string",
      },
      valid: { type: "boolean" },
    },
    required: ["normalized", "type", "valid"],
    type: "object",
  },
  ports: {
    inputs: [
      {
        id: "identifier",
        label: "GTIN",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      { id: "valid", label: "Valid", valueType: { type: "boolean" } },
      { id: "type", label: "GTIN type", valueType: { type: "string" } },
      {
        id: "normalized",
        label: "Normalized GTIN",
        valueType: { type: "string" },
      },
    ],
  },
  title: "GTIN Validator",
});
export const runGtinValidator = gtinValidatorTool.execute;
export default gtinValidatorTool;
