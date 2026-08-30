import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess } from "../../core/result.js";
import { stripIdentifierSeparators } from "../../standard-identifiers/shared.js";
import { expandUpcE } from "../../standard-identifiers/upc-e.js";

export type ValidateUpcEInput = { readonly identifier: string };
export type ValidateUpcEOutput = {
  readonly normalized: string;
  readonly upcA: string;
  readonly valid: boolean;
};

export const calculateValidateUpcE = (input: unknown) => {
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
        message: "UPC-E text is required.",
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
    (input as ValidateUpcEInput).identifier,
  );
  const upcA = expandUpcE(normalized) ?? "";
  return toolSuccess({ normalized, upcA, valid: upcA !== "" });
};

export const example = {
  input: { identifier: "04252614" },
  output: { normalized: "04252614", upcA: "042100005264", valid: true },
} satisfies ToolExample<ValidateUpcEInput, ValidateUpcEOutput>;

export const upcEValidatorTool = defineTool<
  ValidateUpcEInput,
  ValidateUpcEOutput
>({
  contractVersion: 1,
  description:
    "Validate an eight-digit number-system 0 or 1 UPC-E by expanding its zero-suppressed fields and verifying the equivalent UPC-A check digit.",
  discovery: {
    aliases: ["check upce", "upc-e checker"],
    collections: ["identifiers", "validate"],
    keywords: ["barcode", "gtin-12", "upc"],
  },
  execute: calculateValidateUpcE,
  execution: { kind: "pure" },
  id: "validate/upc-e",
  inputSchema: {
    additionalProperties: false,
    properties: { identifier: { maxLength: 32, type: "string" } },
    required: ["identifier"],
    type: "object",
  },
  outputSchema: {
    additionalProperties: false,
    properties: {
      normalized: { type: "string" },
      upcA: { type: "string" },
      valid: { type: "boolean" },
    },
    required: ["normalized", "upcA", "valid"],
    type: "object",
  },
  ports: {
    inputs: [
      {
        id: "identifier",
        label: "UPC-E",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      { id: "valid", label: "Valid", valueType: { type: "boolean" } },
      { id: "upcA", label: "Expanded UPC-A", valueType: { type: "string" } },
      {
        id: "normalized",
        label: "Normalized UPC-E",
        valueType: { type: "string" },
      },
    ],
  },
  title: "UPC-E Validator",
});
export const runUpcEValidator = upcEValidatorTool.execute;
export default upcEValidatorTool;
