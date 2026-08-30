import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { asciiLower, htmlTokens } from "../void-elements-list-checker/tool.js";
export type AutocompleteStandardTokensLookupInput = {
  readonly tokens: ReadonlyArray<string>;
};
export type AutocompleteStandardTokensLookupOutput = {
  readonly categories: ReadonlyArray<string>;
  readonly recognized: ReadonlyArray<boolean>;
};
export const autocompleteStandardTokensLookupInputSchema = {
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
export const autocompleteStandardTokensLookupOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "categories": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Categories"
    },
    "recognized": {
      "type": "array",
      "items": {
        "type": "boolean"
      },
      "description": "Recognized"
    }
  },
  "required": [
    "categories",
    "recognized"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#autofill
export const calculateAutocompleteStandardTokensLookup = (rawInput: unknown): ToolResult<AutocompleteStandardTokensLookupOutput> => {
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
  const input: AutocompleteStandardTokensLookupInput = { tokens: validatedTokens };
 const fields = new Set([
  "name",
  "honorific-prefix",
  "given-name",
  "additional-name",
  "family-name",
  "honorific-suffix",
  "nickname",
  "organization-title",
  "username",
  "new-password",
  "current-password",
  "one-time-code",
  "organization",
  "street-address",
  "address-line1",
  "address-line2",
  "address-line3",
  "address-level4",
  "address-level3",
  "address-level2",
  "address-level1",
  "country",
  "country-name",
  "postal-code",
  "cc-name",
  "cc-given-name",
  "cc-additional-name",
  "cc-family-name",
  "cc-number",
  "cc-exp",
  "cc-exp-month",
  "cc-exp-year",
  "cc-csc",
  "cc-type",
  "transaction-currency",
  "transaction-amount",
  "language",
  "bday",
  "bday-day",
  "bday-month",
  "bday-year",
  "sex",
  "url",
  "photo",
  "tel",
  "tel-country-code",
  "tel-national",
  "tel-area-code",
  "tel-local",
  "tel-local-prefix",
  "tel-local-suffix",
  "tel-extension",
  "email",
  "impp"
]);
 const categories = input.tokens.map(raw => {
   const token = asciiLower(raw);
   if (fields.has(token)) return "field";
   if (["home", "work", "mobile", "fax", "pager"].includes(token)) return "contact";
   if (token === "shipping" || token === "billing") return "address";
   if (token.startsWith("section-") && htmlTokens(token).length === 1 && htmlTokens(token)[0] === token) return "section";
   if (token === "on" || token === "off") return "mode";
   if (token === "webauthn") return "credential";
   return "unknown";
 });
 return toolSuccess({ categories, recognized: categories.map(category => category !== "unknown") });
};
export const example = {
  "input": {
    "tokens": [
      "section-order",
      "shipping",
      "street-address",
      "WEBAUTHN",
      "email-address"
    ]
  },
  "output": {
    "categories": [
      "section",
      "address",
      "field",
      "credential",
      "unknown"
    ],
    "recognized": [
      true,
      true,
      true,
      true,
      false
    ]
  }
} satisfies ToolExample<AutocompleteStandardTokensLookupInput, AutocompleteStandardTokensLookupOutput>;
export const autocompleteStandardTokensLookupTool = defineTool<AutocompleteStandardTokensLookupInput, AutocompleteStandardTokensLookupOutput>({
  id: "html/autocomplete-standard-tokens-lookup",
  title: "autocomplete Standard Tokens Lookup",
  description: "Classifies individual standard autocomplete tokens as field, contact qualifier, address qualifier, section, mode, credential or unknown. Whole-attribute order and control applicability need a separate check.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: autocompleteStandardTokensLookupInputSchema,
  outputSchema: autocompleteStandardTokensLookupOutputSchema,
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
        "id": "categories",
        "label": "Categories",
        "valueType": {
          "type": "list",
          "items": {
            "type": "string"
          }
        }
      },
      {
        "id": "recognized",
        "label": "Recognized",
        "valueType": {
          "type": "list",
          "items": {
            "type": "boolean"
          }
        }
      }
    ]
  },
  execute: calculateAutocompleteStandardTokensLookup,
});
export const runAutocompleteStandardTokensLookup = autocompleteStandardTokensLookupTool.execute;
export default autocompleteStandardTokensLookupTool;
