import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type PhoneDigitsNormalizeBasicE164LiteInput = {
  readonly values: ReadonlyArray<string>;
  readonly countryCode: string;
};
export type PhoneDigitsNormalizeBasicE164LiteOutput = {
  readonly values: ReadonlyArray<string>;
};
export const phoneDigitsNormalizeBasicE164LiteInputSchema = {
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
    },
    "countryCode": {
      "type": "string",
      "maxLength": 3,
      "pattern": "^[1-9][0-9]{0,2}$",
      "description": "Country code"
    }
  },
  "required": [
    "values",
    "countryCode"
  ]
} as const satisfies ToolJsonSchema;
export const phoneDigitsNormalizeBasicE164LiteOutputSchema = {
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

// Reference: https://www.itu.int/rec/T-REC-E.164-202602-I/en
export const calculatePhoneDigitsNormalizeBasicE164Lite = (rawInput: unknown): ToolResult<PhoneDigitsNormalizeBasicE164LiteOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly values?: unknown; readonly countryCode?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "values",
  "countryCode"
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
  const countryCodeValue = candidate.countryCode;
  if (typeof countryCodeValue !== "string") return issue("countryCode", "invalid_type", "Enter a string value.");
  if (countryCodeValue.length > 3) return issue("countryCode", "resource_limit", "Text exceeds the 3-character resource limit.");
  if (!(new RegExp("^[1-9][0-9]{0,2}$")).test(countryCodeValue)) return issue("countryCode", "invalid_format", "Text does not match the accepted syntax.");
  const input: PhoneDigitsNormalizeBasicE164LiteInput = { values: validatedValues, countryCode: countryCodeValue };
  const values: string[] = [];
  for (const [index, cell] of input.values.entries()) {
    const token = cell.trim();
    if (!/^[+0-9(). \t-]+$/.test(token)) return issue(`values.${index}`, "invalid_phone", "Only digits, an initial plus, and ASCII phone punctuation are supported.");
    const compact = token.replace(/[(). \t-]/g, "");
    const digits = compact.startsWith("+") ? compact.slice(1) : input.countryCode + compact;
    if (!/^[1-9][0-9]{0,14}$/.test(digits) || compact === "") return issue(`values.${index}`, "invalid_phone", "Require one initial plus at most and 1 to 15 international digits.");
    values.push("+" + digits);
  }
  return toolSuccess({ values });
};
export const example = {
  input: {
    "values": [
      "(202) 555-0123",
      "+44 20 7946 0123"
    ],
    "countryCode": "1"
  },
  output: {
    "values": [
      "+12025550123",
      "+442079460123"
    ]
  },
} satisfies ToolExample<PhoneDigitsNormalizeBasicE164LiteInput, PhoneDigitsNormalizeBasicE164LiteOutput>;
export const phoneDigitsNormalizeBasicE164LiteTool = defineTool<PhoneDigitsNormalizeBasicE164LiteInput, PhoneDigitsNormalizeBasicE164LiteOutput>({
  id: "csv/phone-digits-normalize-basic-e164-lite",
  title: "Phone Digits Normalizer E.164-Lite",
  description: "Strip ASCII phone punctuation and prepend an explicit country code when + is absent, requiring a nonzero-leading maximum of 15 digits; no allocation or national trunk-prefix validation is performed.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: phoneDigitsNormalizeBasicE164LiteInputSchema,
  outputSchema: phoneDigitsNormalizeBasicE164LiteOutputSchema,
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
      },
      {
        "id": "countryCode",
        "label": "Country code",
        "required": true,
        "valueType": {
          "type": "string"
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
  execute: calculatePhoneDigitsNormalizeBasicE164Lite,
});
export const runPhoneDigitsNormalizeBasicE164Lite = phoneDigitsNormalizeBasicE164LiteTool.execute;
export default phoneDigitsNormalizeBasicE164LiteTool;
