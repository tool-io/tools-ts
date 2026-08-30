import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type SmartQuotesTypographicReplacerInput = {
  readonly values: ReadonlyArray<string>;
};
export type SmartQuotesTypographicReplacerOutput = {
  readonly values: ReadonlyArray<string>;
};
export const smartQuotesTypographicReplacerInputSchema = {
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
export const smartQuotesTypographicReplacerOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "values": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Values"
    }
  },
  "required": [
    "values"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.unicode.org/charts/PDF/U2000.pdf
export const calculateSmartQuotesTypographicReplacer = (rawInput: unknown): ToolResult<SmartQuotesTypographicReplacerOutput> => {
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
  const input: SmartQuotesTypographicReplacerInput = { values: validatedValues };
  return toolSuccess({ values: input.values.map((value) => value.replace(/[\u2018\u2019]/g, "'").replace(/[\u201c\u201d]/g, '"')) });
};
export const example = {
  input: {
    "values": [
      "“Ada”",
      "O’Brien"
    ]
  },
  output: {
    "values": [
      "\"Ada\"",
      "O'Brien"
    ]
  },
} satisfies ToolExample<SmartQuotesTypographicReplacerInput, SmartQuotesTypographicReplacerOutput>;
export const smartQuotesTypographicReplacerTool = defineTool<SmartQuotesTypographicReplacerInput, SmartQuotesTypographicReplacerOutput>({
  id: "csv/smart-quotes-typographic-replacer",
  title: "Smart Quotes Typographic Replacer",
  description: "Replace U+2018/U+2019 with ASCII apostrophes and U+201C/U+201D with ASCII double quotes inside cell strings; CSV escaping belongs to the subsequent writer.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: smartQuotesTypographicReplacerInputSchema,
  outputSchema: smartQuotesTypographicReplacerOutputSchema,
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
        "id": "values",
        "label": "Values",
        "valueType": {
          "type": "list",
          "items": {
            "type": "string"
          }
        }
      }
    ]
  },
  execute: calculateSmartQuotesTypographicReplacer,
});
export const runSmartQuotesTypographicReplacer = smartQuotesTypographicReplacerTool.execute;
export default smartQuotesTypographicReplacerTool;
