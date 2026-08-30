import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess } from "../../core/result.js";

export type ValidateIsbnInput = { readonly isbn: string };
export type ValidateIsbnOutput = {
  readonly isbn10: string;
  readonly isbn13: string;
  readonly normalized: string;
  readonly type: "ISBN-10" | "ISBN-13" | "unknown";
  readonly valid: boolean;
};

const isbn10CheckDigit = (firstNine: string): string => {
  const remainder =
    firstNine
      .split("")
      .reduce((sum, digit, index) => sum + Number(digit) * (10 - index), 0) %
    11;
  const value = (11 - remainder) % 11;
  return value === 10 ? "X" : String(value);
};

const isbn13CheckDigit = (firstTwelve: string): string => {
  const sum = firstTwelve
    .split("")
    .reduce(
      (total, digit, index) =>
        total + Number(digit) * (index % 2 === 0 ? 1 : 3),
      0,
    );
  return String((10 - (sum % 10)) % 10);
};

export const calculateValidateIsbn = (input: unknown) => {
  if (
    typeof input !== "object" ||
    input === null ||
    Array.isArray(input) ||
    typeof (input as Record<string, unknown>).isbn !== "string"
  )
    return invalidInput([
      {
        code: "isbn_required",
        field: "isbn",
        message: "ISBN text is required.",
      },
    ]);
  if (Object.keys(input).some((field) => field !== "isbn"))
    return invalidInput([
      { code: "unknown_field", field: "", message: "Only isbn is supported." },
    ]);
  if ((input as ValidateIsbnInput).isbn.length > 64)
    return invalidInput([
      {
        code: "isbn_too_long",
        field: "isbn",
        message: "ISBN text must contain at most 64 characters.",
      },
    ]);
  const normalized = (input as ValidateIsbnInput).isbn
    .replace(/[\s-]+/gu, "")
    .toUpperCase();
  if (/^\d{9}[\dX]$/u.test(normalized)) {
    const valid = isbn10CheckDigit(normalized.slice(0, 9)) === normalized[9];
    const isbn13Base = `978${normalized.slice(0, 9)}`;
    return toolSuccess({
      isbn10: valid ? normalized : "",
      isbn13: valid ? `${isbn13Base}${isbn13CheckDigit(isbn13Base)}` : "",
      normalized,
      type: "ISBN-10" as const,
      valid,
    });
  }
  if (/^\d{13}$/u.test(normalized)) {
    const booklandPrefix =
      normalized.startsWith("978") ||
      (normalized.startsWith("979") && !normalized.startsWith("9790"));
    const valid =
      booklandPrefix &&
      isbn13CheckDigit(normalized.slice(0, 12)) === normalized[12];
    const canConvertToIsbn10 = valid && normalized.startsWith("978");
    const isbn10Base = normalized.slice(3, 12);
    return toolSuccess({
      isbn10: canConvertToIsbn10
        ? `${isbn10Base}${isbn10CheckDigit(isbn10Base)}`
        : "",
      isbn13: valid ? normalized : "",
      normalized,
      type: "ISBN-13" as const,
      valid,
    });
  }
  return toolSuccess({
    isbn10: "",
    isbn13: "",
    normalized,
    type: "unknown" as const,
    valid: false,
  });
};

export const example = {
  input: { isbn: "978-0-306-40615-7" },
  output: {
    isbn10: "0306406152",
    isbn13: "9780306406157",
    normalized: "9780306406157",
    type: "ISBN-13",
    valid: true,
  },
} satisfies ToolExample<ValidateIsbnInput, ValidateIsbnOutput>;

export const isbnValidatorTool = defineTool<
  ValidateIsbnInput,
  ValidateIsbnOutput
>({
  contractVersion: 1,
  description:
    "Validate ISBN-10 and Bookland-prefixed ISBN-13 identifiers after removing spaces and hyphens, reject the 979-0 ISMN range, and convert valid 978-prefixed identifiers between formats.",
  discovery: {
    aliases: [
      "isbn checker",
      "isbn validator",
      "validate isbn-10",
      "validate isbn-13",
    ],
    collections: ["books", "validate"],
    keywords: ["book", "check digit", "isbn", "publishing"],
  },
  execute: calculateValidateIsbn,
  execution: { kind: "pure" },
  id: "validate/isbn",
  inputSchema: {
    additionalProperties: false,
    properties: { isbn: { maxLength: 64, type: "string" } },
    required: ["isbn"],
    type: "object",
  },
  outputSchema: {
    additionalProperties: false,
    properties: {
      isbn10: { type: "string" },
      isbn13: { type: "string" },
      normalized: { type: "string" },
      type: { enum: ["ISBN-10", "ISBN-13", "unknown"], type: "string" },
      valid: { type: "boolean" },
    },
    required: ["isbn10", "isbn13", "normalized", "type", "valid"],
    type: "object",
  },
  ports: {
    inputs: [
      {
        id: "isbn",
        label: "ISBN",
        required: true,
        valueType: { format: "isbn", type: "string" },
      },
    ],
    outputs: [
      { id: "valid", label: "Valid", valueType: { type: "boolean" } },
      { id: "type", label: "Type", valueType: { type: "string" } },
      {
        id: "normalized",
        label: "Normalized",
        valueType: { format: "isbn", type: "string" },
      },
      {
        id: "isbn10",
        label: "ISBN-10",
        valueType: { format: "isbn-10", type: "string" },
      },
      {
        id: "isbn13",
        label: "ISBN-13",
        valueType: { format: "isbn-13", type: "string" },
      },
    ],
  },
  title: "ISBN Validator",
});
export const runIsbnValidator = isbnValidatorTool.execute;
export default isbnValidatorTool;
