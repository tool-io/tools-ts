import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type SheetNameInvalidCharsValidatorInput = {
  readonly name: string;
};
export type SheetNameInvalidCharsValidatorOutput = {
  readonly valid: boolean;
  readonly reasons: ReadonlyArray<string>;
};
export const sheetNameInvalidCharsValidatorInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "name": {
      "type": "string",
      "maxLength": 100000,
      "description": "Name"
    }
  },
  "required": [
    "name"
  ]
} as const satisfies ToolJsonSchema;
export const sheetNameInvalidCharsValidatorOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "valid": {
      "type": "boolean",
      "description": "Valid"
    },
    "reasons": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Reasons"
    }
  },
  "required": [
    "valid",
    "reasons"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://support.microsoft.com/en-gb/excel/rename-a-worksheet
export const calculateSheetNameInvalidCharsValidator = (rawInput: unknown): ToolResult<SheetNameInvalidCharsValidatorOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly name?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "name"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const nameValue = candidate.name;
  if (typeof nameValue !== "string") return issue("name", "invalid_type", "Enter a string value.");
  if (nameValue.length > 100000) return issue("name", "resource_limit", "Text exceeds the 100000-character resource limit.");
  const input: SheetNameInvalidCharsValidatorInput = { name: nameValue };
  const reasons: string[] = [];
  if (input.name.length === 0) reasons.push("empty_name");
  if (input.name.length > 31) reasons.push("too_long");
  if (/[\\/?*:\[\]]/.test(input.name)) reasons.push("forbidden_character");
  if (input.name.startsWith("'") || input.name.endsWith("'")) reasons.push("boundary_apostrophe");
  if (input.name.toLowerCase() === "history") reasons.push("reserved_name");
  return toolSuccess({ valid: reasons.length === 0, reasons });
};
export const example = {
  input: {
    "name": "Sales/Q1"
  },
  output: {
    "valid": false,
    "reasons": [
      "forbidden_character"
    ]
  },
} satisfies ToolExample<SheetNameInvalidCharsValidatorInput, SheetNameInvalidCharsValidatorOutput>;
export const sheetNameInvalidCharsValidatorTool = defineTool<SheetNameInvalidCharsValidatorInput, SheetNameInvalidCharsValidatorOutput>({
  id: "csv/sheet-name-invalid-chars-validator",
  title: "Sheet Name Invalid Chars Validator",
  description: "Check Excel sheet-name spelling for empty text, more than 31 UTF-16 units, forbidden characters, boundary apostrophes, and reserved History; existing workbook name collisions are outside this check.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: sheetNameInvalidCharsValidatorInputSchema,
  outputSchema: sheetNameInvalidCharsValidatorOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "name",
        "label": "Name",
        "required": true,
        "valueType": {
          "type": "string"
        }
      }
    ],
    "outputs": [
      {
        "id": "valid",
        "label": "Valid",
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "reasons",
        "label": "Reasons",
        "valueType": {
          "type": "list",
          "items": {
            "type": "string"
          }
        }
      }
    ]
  },
  execute: calculateSheetNameInvalidCharsValidator,
});
export const runSheetNameInvalidCharsValidator = sheetNameInvalidCharsValidatorTool.execute;
export default sheetNameInvalidCharsValidatorTool;
