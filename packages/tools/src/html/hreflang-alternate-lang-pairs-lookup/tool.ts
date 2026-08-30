import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { asciiLower, htmlTokens } from "../void-elements-list-checker/tool.js";
export type HreflangAlternateLangPairsLookupInput = {
  readonly languages: ReadonlyArray<string>;
  readonly hrefs: ReadonlyArray<string>;
};
export type HreflangAlternateLangPairsLookupOutput = {
  readonly emptyAt: ReadonlyArray<number>;
  readonly duplicateLanguageAt: ReadonlyArray<number>;
  readonly locallyComplete: boolean;
};
export const hreflangAlternateLangPairsLookupInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "languages": {
      "type": "array",
      "items": {
        "type": "string",
        "maxLength": 10000
      },
      "minItems": 0,
      "maxItems": 10000,
      "description": "Languages"
    },
    "hrefs": {
      "type": "array",
      "items": {
        "type": "string",
        "maxLength": 10000
      },
      "minItems": 0,
      "maxItems": 10000,
      "description": "Hrefs"
    }
  },
  "required": [
    "languages",
    "hrefs"
  ]
} as const satisfies ToolJsonSchema;
export const hreflangAlternateLangPairsLookupOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "emptyAt": {
      "type": "array",
      "items": {
        "type": "integer",
        "minimum": 0,
        "maximum": 9007199254740991
      },
      "description": "Empty At"
    },
    "duplicateLanguageAt": {
      "type": "array",
      "items": {
        "type": "integer",
        "minimum": 0,
        "maximum": 9007199254740991
      },
      "description": "Duplicate Language At"
    },
    "locallyComplete": {
      "type": "boolean",
      "description": "Locally Complete"
    }
  },
  "required": [
    "emptyAt",
    "duplicateLanguageAt",
    "locallyComplete"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://html.spec.whatwg.org/multipage/links.html#link-type-alternate
export const calculateHreflangAlternateLangPairsLookup = (rawInput: unknown): ToolResult<HreflangAlternateLangPairsLookupOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly languages?: unknown; readonly hrefs?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "languages",
  "hrefs"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const languagesValue = candidate.languages;
if (!Array.isArray(languagesValue)) return issue("languages", "invalid_type", "Enter a dense array.");
if (languagesValue.length < 0) return issue("languages", "out_of_range", "Too few entries.");
if (languagesValue.length > 10000) return issue("languages", "resource_limit", "Array exceeds the 10000-entry resource limit.");
const validatedLanguages: string[] = [];
for (let index = 0; index < languagesValue.length; index++) {
if (!Object.prototype.hasOwnProperty.call(languagesValue, index)) return issue(`languages.${index}`, "invalid_type", "Sparse arrays are not supported.");
const item: unknown = languagesValue[index];
if (typeof item !== "string") return issue(`languages.${index}`, "invalid_type", "Enter a string value.");
if (item.length > 10000) return issue(`languages.${index}`, "resource_limit", "Text exceeds the 10000-character resource limit.");
validatedLanguages.push(item);
}
if (validatedLanguages.reduce((total, cell) => total + cell.length, 0) > 100000) return issue("languages", "resource_limit", "Combined cell text exceeds 100,000 UTF-16 code units.");
const hrefsValue = candidate.hrefs;
if (!Array.isArray(hrefsValue)) return issue("hrefs", "invalid_type", "Enter a dense array.");
if (hrefsValue.length < 0) return issue("hrefs", "out_of_range", "Too few entries.");
if (hrefsValue.length > 10000) return issue("hrefs", "resource_limit", "Array exceeds the 10000-entry resource limit.");
const validatedHrefs: string[] = [];
for (let index = 0; index < hrefsValue.length; index++) {
if (!Object.prototype.hasOwnProperty.call(hrefsValue, index)) return issue(`hrefs.${index}`, "invalid_type", "Sparse arrays are not supported.");
const item: unknown = hrefsValue[index];
if (typeof item !== "string") return issue(`hrefs.${index}`, "invalid_type", "Enter a string value.");
if (item.length > 10000) return issue(`hrefs.${index}`, "resource_limit", "Text exceeds the 10000-character resource limit.");
validatedHrefs.push(item);
}
if (validatedHrefs.reduce((total, cell) => total + cell.length, 0) > 100000) return issue("hrefs", "resource_limit", "Combined cell text exceeds 100,000 UTF-16 code units.");
  const input: HreflangAlternateLangPairsLookupInput = { languages: validatedLanguages, hrefs: validatedHrefs };
 if (input.languages.length !== input.hrefs.length) return issue("hrefs", "length_mismatch", "Language labels and hrefs must have equal lengths.");
 const emptyAt: number[] = [], duplicateLanguageAt: number[] = [];
 const seen = new Set<string>();
 input.languages.forEach((language, index) => {
   if (htmlTokens(language).length === 0 || htmlTokens(input.hrefs[index] ?? "").length === 0) emptyAt.push(index);
   const key = asciiLower(language);
   if (seen.has(key)) duplicateLanguageAt.push(index); else seen.add(key);
 });
 return toolSuccess({ emptyAt, duplicateLanguageAt, locallyComplete: emptyAt.length === 0 && duplicateLanguageAt.length === 0 });
};
export const example = {
  "input": {
    "languages": [
      "en",
      "fr",
      "EN"
    ],
    "hrefs": [
      "/en",
      "/fr",
      "/en-us"
    ]
  },
  "output": {
    "emptyAt": [],
    "duplicateLanguageAt": [
      2
    ],
    "locallyComplete": false
  }
} satisfies ToolExample<HreflangAlternateLangPairsLookupInput, HreflangAlternateLangPairsLookupOutput>;
export const hreflangAlternateLangPairsLookupTool = defineTool<HreflangAlternateLangPairsLookupInput, HreflangAlternateLangPairsLookupOutput>({
  id: "html/hreflang-alternate-lang-pairs-lookup",
  title: "hreflang Alternate Language Pairs",
  description: "Checks supplied hreflang/href pairs for nonempty values and repeated language labels ignoring ASCII case. It does not validate BCP 47 registry membership, URL syntax, reciprocal links or search-engine selection.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: hreflangAlternateLangPairsLookupInputSchema,
  outputSchema: hreflangAlternateLangPairsLookupOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "languages",
        "label": "Languages",
        "required": true,
        "valueType": {
          "type": "list",
          "items": {
            "type": "string"
          }
        }
      },
      {
        "id": "hrefs",
        "label": "Hrefs",
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
        "id": "emptyAt",
        "label": "Empty At",
        "valueType": {
          "type": "list",
          "items": {
            "type": "integer"
          }
        }
      },
      {
        "id": "duplicateLanguageAt",
        "label": "Duplicate Language At",
        "valueType": {
          "type": "list",
          "items": {
            "type": "integer"
          }
        }
      },
      {
        "id": "locallyComplete",
        "label": "Locally Complete",
        "valueType": {
          "type": "boolean"
        }
      }
    ]
  },
  execute: calculateHreflangAlternateLangPairsLookup,
});
export const runHreflangAlternateLangPairsLookup = hreflangAlternateLangPairsLookupTool.execute;
export default hreflangAlternateLangPairsLookupTool;
