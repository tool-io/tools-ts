import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type KeywordAlphabetBuilderInput = {
  readonly keyword: string;
};
export type KeywordAlphabetBuilderOutput = {
  readonly alphabet: string;
};
export const keywordAlphabetBuilderInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "keyword": {
      "type": "string",
      "maxLength": 10000,
      "pattern": "^[A-Za-z]*$(?![\\s\\S])",
      "description": "ASCII letter keyword"
    }
  },
  "required": [
    "keyword"
  ]
} as const satisfies ToolJsonSchema;
export const keywordAlphabetBuilderOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "alphabet": {
      "type": "string",
      "description": "Keyword substitution alphabet"
    }
  },
  "required": [
    "alphabet"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.nsa.gov/portals/75/documents/news-features/declassified-documents/friedman-documents/publications/folder_233/41761039080018.pdf
export const calculateKeywordAlphabetBuilder = (rawInput: unknown): ToolResult<KeywordAlphabetBuilderOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly keyword?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "keyword"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const keywordValue = candidate.keyword;
if (typeof keywordValue !== "string") return issue("keyword", "invalid_type", "Enter a string value.");
if (keywordValue.length > 10000) return issue("keyword", "resource_limit", "Text exceeds the 10000-character resource limit.");
if (!(new RegExp("^[A-Za-z]*$(?![\\s\\S])")).test(keywordValue)) return issue("keyword", "invalid_format", "Text does not match the accepted syntax.");
  const input: KeywordAlphabetBuilderInput = { keyword: keywordValue };
  const alphabet = [...new Set((input.keyword.toUpperCase() + "ABCDEFGHIJKLMNOPQRSTUVWXYZ").split(""))].join("");
  return toolSuccess({ alphabet });
};
export const example = {
  "input": {
    "keyword": "BANANA"
  },
  "output": {
    "alphabet": "BANCDEFGHIJKLMOPQRSTUVWXYZ"
  }
} satisfies ToolExample<KeywordAlphabetBuilderInput, KeywordAlphabetBuilderOutput>;
export const keywordAlphabetBuilderTool = defineTool<KeywordAlphabetBuilderInput, KeywordAlphabetBuilderOutput>({
  id: "cryptography/keyword-alphabet-builder",
  title: "Keyword Alphabet Builder",
  description: "Build an A\u2013Z keyword substitution alphabet by taking distinct keyword letters first and appending unused letters.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: keywordAlphabetBuilderInputSchema,
  outputSchema: keywordAlphabetBuilderOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "keyword",
        "label": "ASCII letter keyword",
        "required": true,
        "valueType": {
          "type": "string"
        }
      }
    ],
    "outputs": [
      {
        "id": "alphabet",
        "label": "Keyword substitution alphabet",
        "valueType": {
          "type": "string",
          "format": "ascii-alphabet"
        }
      }
    ]
  },
  execute: calculateKeywordAlphabetBuilder,
});
export const runKeywordAlphabetBuilder = keywordAlphabetBuilderTool.execute;
export default keywordAlphabetBuilderTool;
