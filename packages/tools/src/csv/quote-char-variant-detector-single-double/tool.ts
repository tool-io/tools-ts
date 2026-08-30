import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type QuoteCharVariantDetectorSingleDoubleInput = {
  readonly tokens: ReadonlyArray<string>;
};
export type QuoteCharVariantDetectorSingleDoubleOutput = {
  readonly quoteCharacters: ReadonlyArray<string>;
  readonly ambiguous: boolean;
  readonly unrecognizedCount: number;
};
export const quoteCharVariantDetectorSingleDoubleInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "tokens": {
      "type": "array",
      "items": {
        "type": "string",
        "maxLength": 10000
      },
      "minItems": 0,
      "maxItems": 10000,
      "description": "Tokens"
    }
  },
  "required": [
    "tokens"
  ]
} as const satisfies ToolJsonSchema;
export const quoteCharVariantDetectorSingleDoubleOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "quoteCharacters": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Quote characters"
    },
    "ambiguous": {
      "type": "boolean",
      "description": "Ambiguous"
    },
    "unrecognizedCount": {
      "type": "integer",
      "minimum": 0,
      "maximum": 9007199254740991,
      "description": "Unrecognized count"
    }
  },
  "required": [
    "quoteCharacters",
    "ambiguous",
    "unrecognizedCount"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.rfc-editor.org/rfc/rfc4180
export const calculateQuoteCharVariantDetectorSingleDouble = (rawInput: unknown): ToolResult<QuoteCharVariantDetectorSingleDoubleOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly tokens?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "tokens"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const tokensValue = candidate.tokens;
  if (!Array.isArray(tokensValue)) return issue("tokens", "invalid_type", "Enter a dense array.");
  if (tokensValue.length < 0) return issue("tokens", "out_of_range", "Too few entries.");
  if (tokensValue.length > 10000) return issue("tokens", "resource_limit", "Array exceeds the 10000-entry resource limit.");
  const validatedTokens: string[] = [];
  for (let index = 0; index < tokensValue.length; index++) {
    if (!Object.prototype.hasOwnProperty.call(tokensValue, index)) return issue(`tokens.${index}`, "invalid_type", "Sparse arrays are not supported.");
    const item: unknown = tokensValue[index];
    if (typeof item !== "string") return issue(`tokens.${index}`, "invalid_type", "Enter a string value.");
    if (item.length > 10000) return issue(`tokens.${index}`, "resource_limit", "Text exceeds the 10000-character resource limit.");
    validatedTokens.push(item);
  }
  if (validatedTokens.reduce((total, cell) => total + cell.length, 0) > 100000) return issue("tokens", "resource_limit", "Combined cell text exceeds 100,000 UTF-16 code units.");
  const input: QuoteCharVariantDetectorSingleDoubleInput = { tokens: validatedTokens };
  const seen = new Set<string>();
  let unrecognizedCount = 0;
  for (const token of input.tokens) {
    if (/^"(?:[^"]|"")*"$/.test(token)) seen.add('"');
    else if (/^'(?:[^']|'')*'$/.test(token)) seen.add("'");
    else unrecognizedCount++;
  }
  const quoteCharacters = ['"', "'"].filter((quote) => seen.has(quote));
  return toolSuccess({ quoteCharacters, ambiguous: quoteCharacters.length !== 1, unrecognizedCount });
};
export const example = {
  input: {
    "tokens": [
      "'Ada'",
      "'O''Brien'",
      "plain"
    ]
  },
  output: {
    "quoteCharacters": [
      "'"
    ],
    "ambiguous": false,
    "unrecognizedCount": 1
  },
} satisfies ToolExample<QuoteCharVariantDetectorSingleDoubleInput, QuoteCharVariantDetectorSingleDoubleOutput>;
export const quoteCharVariantDetectorSingleDoubleTool = defineTool<QuoteCharVariantDetectorSingleDoubleInput, QuoteCharVariantDetectorSingleDoubleOutput>({
  id: "csv/quote-char-variant-detector-single-double",
  title: "Quote Char Variant Detector",
  description: "Detect single- or double-quote conventions in isolated field-token samples, requiring complete paired delimiters and doubled interior quotes; single quotes are a dialect hint rather than RFC CSV.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: quoteCharVariantDetectorSingleDoubleInputSchema,
  outputSchema: quoteCharVariantDetectorSingleDoubleOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "tokens",
        "label": "Tokens",
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
        "id": "quoteCharacters",
        "label": "Quote characters",
        "valueType": {
          "type": "list",
          "items": {
            "type": "string"
          }
        }
      },
      {
        "id": "ambiguous",
        "label": "Ambiguous",
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "unrecognizedCount",
        "label": "Unrecognized count",
        "valueType": {
          "type": "integer"
        }
      }
    ]
  },
  execute: calculateQuoteCharVariantDetectorSingleDouble,
});
export const runQuoteCharVariantDetectorSingleDouble = quoteCharVariantDetectorSingleDoubleTool.execute;
export default quoteCharVariantDetectorSingleDoubleTool;
