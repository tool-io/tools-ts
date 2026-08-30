import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type CurrencySymbolStripToNumberInput = {
  readonly text: string;
  readonly decimalSeparator: "." | ",";
  readonly groupingSeparator: "" | "," | "." | " ";
};
export type CurrencySymbolStripToNumberOutput = {
  readonly value: string;
};
export const currencySymbolStripToNumberInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "text": {
      "type": "string",
      "maxLength": 200,
      "description": "Currency cell"
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
export const currencySymbolStripToNumberOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "value": {
      "type": "string",
      "pattern": "^-?(0|[1-9][0-9]*)(\\.[0-9]+)?$",
      "description": "Exact decimal"
    }
  },
  "required": [
    "value"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

export type ExactDecimal = { readonly coefficient: bigint; readonly scale: number };
export const parseDecimal = (text: string, decimalSeparator = ".", groupingSeparator = ""): ExactDecimal | undefined => {
  const token = text.trim();
  if (token.length > 200 || (decimalSeparator !== "." && decimalSeparator !== ",") || !["", ",", ".", " "].includes(groupingSeparator) || decimalSeparator === groupingSeparator) return undefined;
  const negative = token.startsWith("-");
  const unsigned = /^[+-]/.test(token) ? token.slice(1) : token;
  const parts = unsigned.split(decimalSeparator);
  if (parts.length > 2) return undefined;
  const whole = parts[0];
  const fraction = parts[1] ?? "";
  if (whole === undefined || (parts.length === 2 && !/^[0-9]+$/.test(fraction))) return undefined;
  let digits = whole;
  if (groupingSeparator !== "" && whole.includes(groupingSeparator)) {
    const groups = whole.split(groupingSeparator);
    if (!/^[0-9]{1,3}$/.test(groups[0] ?? "") || !groups.slice(1).every((group) => /^[0-9]{3}$/.test(group))) return undefined;
    digits = groups.join("");
  }
  if (!/^[0-9]+$/.test(digits)) return undefined;
  const coefficient = BigInt(digits + fraction) * (negative ? -1n : 1n);
  return { coefficient, scale: fraction.length };
};
export const decimalText = (value: ExactDecimal): string => {
  if (value.coefficient === 0n) return "0";
  const sign = value.coefficient < 0n ? "-" : "";
  const digits = (value.coefficient < 0n ? -value.coefficient : value.coefficient).toString().padStart(value.scale + 1, "0");
  if (value.scale === 0) return sign + digits;
  return (sign + digits.slice(0, -value.scale) + "." + digits.slice(-value.scale)).replace(/0+$/, "").replace(/\.$/, "");
};
export const compareDecimal = (left: ExactDecimal, right: ExactDecimal): number => {
  const scale = Math.max(left.scale, right.scale);
  const a = left.coefficient * 10n ** BigInt(scale - left.scale);
  const b = right.coefficient * 10n ** BigInt(scale - right.scale);
  return a < b ? -1 : a > b ? 1 : 0;
};
export const addDecimal = (left: ExactDecimal, right: ExactDecimal): ExactDecimal => {
  const scale = Math.max(left.scale, right.scale);
  return { coefficient: left.coefficient * 10n ** BigInt(scale - left.scale) + right.coefficient * 10n ** BigInt(scale - right.scale), scale };
};
export const stripCurrencySymbol = (text: string): string | undefined => {
  const token = text.trim();
  const symbols = [...token.matchAll(/\p{Sc}/gu)];
  if (symbols.length === 0) return token;
  if (symbols.length !== 1) return undefined;
  const symbol = symbols[0];
  if (symbol === undefined) return undefined;
  if (symbol.index === 0) return token.slice(symbol[0].length).trim();
  const prefix = token.slice(0, symbol.index);
  if (/^[+-]\s*$/.test(prefix)) return prefix.trim() + token.slice(symbol.index + symbol[0].length).trim();
  if (symbol.index + symbol[0].length === token.length) return token.slice(0, symbol.index).trim();
  return undefined;
};

// Reference: https://www.unicode.org/reports/tr44/#General_Category_Values
export const calculateCurrencySymbolStripToNumber = (rawInput: unknown): ToolResult<CurrencySymbolStripToNumberOutput> => {
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
  const input: CurrencySymbolStripToNumberInput = { text: textValue, decimalSeparator: decimalSeparatorValue, groupingSeparator: groupingSeparatorValue };
  if (input.decimalSeparator === input.groupingSeparator) return issue("groupingSeparator", "separator_conflict", "Decimal and grouping separators must differ.");
  const stripped = stripCurrencySymbol(input.text);
  const value = stripped === undefined ? undefined : parseDecimal(stripped, input.decimalSeparator, input.groupingSeparator);
  if (value === undefined) return issue("text", "invalid_decimal", "Enter a decimal with one optional boundary currency symbol and valid grouping.");
  return toolSuccess({ value: decimalText(value) });
};
export const example = {
  input: {
    "text": "€1.234,50",
    "decimalSeparator": ",",
    "groupingSeparator": "."
  },
  output: {
    "value": "1234.5"
  },
} satisfies ToolExample<CurrencySymbolStripToNumberInput, CurrencySymbolStripToNumberOutput>;
export const currencySymbolStripToNumberTool = defineTool<CurrencySymbolStripToNumberInput, CurrencySymbolStripToNumberOutput>({
  id: "csv/currency-symbol-strip-to-number",
  title: "Currency Symbol Strip to Number",
  description: "Remove at most one leading or trailing Unicode currency symbol and parse an exact decimal using explicit decimal and grouping separators; embedded symbols are rejected.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: currencySymbolStripToNumberInputSchema,
  outputSchema: currencySymbolStripToNumberOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "text",
        "label": "Currency cell",
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
        "label": "Exact decimal",
        "valueType": {
          "type": "string",
          "format": "decimal/arbitrary"
        }
      }
    ]
  },
  execute: calculateCurrencySymbolStripToNumber,
});
export const runCurrencySymbolStripToNumber = currencySymbolStripToNumberTool.execute;
export default currencySymbolStripToNumberTool;
