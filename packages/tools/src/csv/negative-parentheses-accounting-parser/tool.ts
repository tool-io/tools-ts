import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { stripCurrencySymbol, parseDecimal, decimalText } from "../currency-symbol-strip-to-number/tool.js";
export type NegativeParenthesesAccountingParserInput = {
  readonly text: string;
  readonly decimalSeparator: "." | ",";
  readonly groupingSeparator: "" | "," | "." | " ";
};
export type NegativeParenthesesAccountingParserOutput = {
  readonly value: string;
};
export const negativeParenthesesAccountingParserInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "text": {
      "type": "string",
      "maxLength": 200,
      "description": "Text"
    },
    "decimalSeparator": {
      "type": "string",
      "enum": [
        ".",
        ","
      ],
      "description": "Decimal separator"
    },
    "groupingSeparator": {
      "type": "string",
      "enum": [
        "",
        ",",
        ".",
        " "
      ],
      "description": "Grouping separator"
    }
  },
  "required": [
    "text",
    "decimalSeparator",
    "groupingSeparator"
  ]
} as const satisfies ToolJsonSchema;
export const negativeParenthesesAccountingParserOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "value": {
      "type": "string",
      "description": "Value"
    }
  },
  "required": [
    "value"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://support.microsoft.com/en-us/excel/change-the-way-negative-numbers-are-displayed
export const calculateNegativeParenthesesAccountingParser = (rawInput: unknown): ToolResult<NegativeParenthesesAccountingParserOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly text?: unknown; readonly decimalSeparator?: unknown; readonly groupingSeparator?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "text",
  "decimalSeparator",
  "groupingSeparator"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const textValue = candidate.text;
  if (typeof textValue !== "string") return issue("text", "invalid_type", "Enter a string value.");
  if (textValue.length > 200) return issue("text", "resource_limit", "Text exceeds the 200-character resource limit.");
  const decimalSeparatorValue = candidate.decimalSeparator;
  if (typeof decimalSeparatorValue !== "string") return issue("decimalSeparator", "invalid_type", "Enter a string value.");
  if (decimalSeparatorValue !== "." && decimalSeparatorValue !== ",") return issue("decimalSeparator", "invalid_value", "Choose a supported value.");
  const groupingSeparatorValue = candidate.groupingSeparator;
  if (typeof groupingSeparatorValue !== "string") return issue("groupingSeparator", "invalid_type", "Enter a string value.");
  if (groupingSeparatorValue !== "" && groupingSeparatorValue !== "," && groupingSeparatorValue !== "." && groupingSeparatorValue !== " ") return issue("groupingSeparator", "invalid_value", "Choose a supported value.");
  const input: NegativeParenthesesAccountingParserInput = { text: textValue, decimalSeparator: decimalSeparatorValue, groupingSeparator: groupingSeparatorValue };
  if (input.decimalSeparator === input.groupingSeparator) return issue("groupingSeparator", "separator_conflict", "Decimal and grouping separators must differ.");
  const token = input.text.trim();
  const inner = token.startsWith("(") && token.endsWith(")") ? stripCurrencySymbol(token.slice(1, -1)) : undefined;
  const value = inner === undefined || /^[+-]/.test(inner) ? undefined : parseDecimal(inner, input.decimalSeparator, input.groupingSeparator);
  if (value === undefined) return issue("text", "invalid_accounting", "Enter an unsigned accounting decimal enclosed in parentheses.");
  return toolSuccess({ value: decimalText({ coefficient: -value.coefficient, scale: value.scale }) });
};
export const example = {
  input: {
    "text": "($1,234.50)",
    "decimalSeparator": ".",
    "groupingSeparator": ","
  },
  output: {
    "value": "-1234.5"
  },
} satisfies ToolExample<NegativeParenthesesAccountingParserInput, NegativeParenthesesAccountingParserOutput>;
export const negativeParenthesesAccountingParserTool = defineTool<NegativeParenthesesAccountingParserInput, NegativeParenthesesAccountingParserOutput>({
  id: "csv/negative-parentheses-accounting-parser",
  title: "Negative Parentheses Accounting Parser",
  description: "Convert one parenthesized unsigned accounting decimal with optional boundary currency symbol into an exact negative decimal, using explicit decimal and grouping separators.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: negativeParenthesesAccountingParserInputSchema,
  outputSchema: negativeParenthesesAccountingParserOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "text",
        "label": "Text",
        "required": true,
        "valueType": {
          "type": "string"
        }
      },
      {
        "id": "decimalSeparator",
        "label": "Decimal separator",
        "required": true,
        "valueType": {
          "type": "string"
        }
      },
      {
        "id": "groupingSeparator",
        "label": "Grouping separator",
        "required": true,
        "valueType": {
          "type": "string"
        }
      }
    ],
    "outputs": [
      {
        "id": "value",
        "label": "Value",
        "valueType": {
          "type": "string",
          "format": "decimal/arbitrary"
        }
      }
    ]
  },
  execute: calculateNegativeParenthesesAccountingParser,
});
export const runNegativeParenthesesAccountingParser = negativeParenthesesAccountingParserTool.execute;
export default negativeParenthesesAccountingParserTool;
