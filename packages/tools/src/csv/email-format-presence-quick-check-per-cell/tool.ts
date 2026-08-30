import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type EmailFormatPresenceQuickCheckPerCellInput = {
  readonly values: ReadonlyArray<string>;
};
export type EmailFormatPresenceQuickCheckPerCellOutput = {
  readonly valid: ReadonlyArray<boolean>;
};
export const emailFormatPresenceQuickCheckPerCellInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "values": {
      "type": "array",
      "items": {
        "type": "string",
        "maxLength": 10000
      },
      "minItems": 0,
      "maxItems": 10000,
      "description": "Values"
    }
  },
  "required": [
    "values"
  ]
} as const satisfies ToolJsonSchema;
export const emailFormatPresenceQuickCheckPerCellOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "valid": {
      "type": "array",
      "items": {
        "type": "boolean"
      },
      "description": "Valid"
    }
  },
  "required": [
    "valid"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://html.spec.whatwg.org/multipage/input.html#email-state-(type=email)
export const calculateEmailFormatPresenceQuickCheckPerCell = (rawInput: unknown): ToolResult<EmailFormatPresenceQuickCheckPerCellOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly values?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "values"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const valuesValue = candidate.values;
  if (!Array.isArray(valuesValue)) return issue("values", "invalid_type", "Enter a dense array.");
  if (valuesValue.length < 0) return issue("values", "out_of_range", "Too few entries.");
  if (valuesValue.length > 10000) return issue("values", "resource_limit", "Array exceeds the 10000-entry resource limit.");
  const validatedValues: string[] = [];
  for (let index = 0; index < valuesValue.length; index++) {
    if (!Object.prototype.hasOwnProperty.call(valuesValue, index)) return issue(`values.${index}`, "invalid_type", "Sparse arrays are not supported.");
    const item: unknown = valuesValue[index];
    if (typeof item !== "string") return issue(`values.${index}`, "invalid_type", "Enter a string value.");
    if (item.length > 10000) return issue(`values.${index}`, "resource_limit", "Text exceeds the 10000-character resource limit.");
    validatedValues.push(item);
  }
  if (validatedValues.reduce((total, cell) => total + cell.length, 0) > 100000) return issue("values", "resource_limit", "Combined cell text exceeds 100,000 UTF-16 code units.");
  const input: EmailFormatPresenceQuickCheckPerCellInput = { values: validatedValues };
  const pattern = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return toolSuccess({ valid: input.values.map((value) => pattern.test(value.trim())) });
};
export const example = {
  input: {
    "values": [
      "ada@example.org",
      "not-an-email",
      "a@localhost"
    ]
  },
  output: {
    "valid": [
      true,
      false,
      true
    ]
  },
} satisfies ToolExample<EmailFormatPresenceQuickCheckPerCellInput, EmailFormatPresenceQuickCheckPerCellOutput>;
export const emailFormatPresenceQuickCheckPerCellTool = defineTool<EmailFormatPresenceQuickCheckPerCellInput, EmailFormatPresenceQuickCheckPerCellOutput>({
  id: "csv/email-format-presence-quick-check-per-cell",
  title: "Email Format Quick Check Per Cell",
  description: "Check each cell against the WHATWG HTML single-email ASCII syntax after trimming boundaries; this checks format rather than mailbox existence or all RFC email forms.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: emailFormatPresenceQuickCheckPerCellInputSchema,
  outputSchema: emailFormatPresenceQuickCheckPerCellOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "values",
        "label": "Values",
        "required": true,
        "valueType": {
          "type": "list",
          "items": {
            "type": "string"
          }
        }
      }
    ],
    "outputs": [
      {
        "id": "valid",
        "label": "Valid",
        "valueType": {
          "type": "list",
          "items": {
            "type": "boolean"
          }
        }
      }
    ]
  },
  execute: calculateEmailFormatPresenceQuickCheckPerCell,
});
export const runEmailFormatPresenceQuickCheckPerCell = emailFormatPresenceQuickCheckPerCellTool.execute;
export default emailFormatPresenceQuickCheckPerCellTool;
