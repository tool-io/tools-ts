import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { categoricalValidity, figureTerms, termDistributed } from "../syllogism-mood-figure-parser/tool.js";
export type BramantipAai4ValidLookupInput = {
  readonly nonemptyTerms: ReadonlyArray<"S" | "M" | "P">;
};
export type BramantipAai4ValidLookupOutput = {
  readonly syllogism: string;
  readonly valid: boolean;
  readonly requiredNonemptyTerm: "none" | "S" | "M" | "P";
};
export const bramantipAai4ValidLookupInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "nonemptyTerms": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "S",
          "M",
          "P"
        ]
      },
      "minItems": 0,
      "maxItems": 3,
      "description": "Terms assumed nonempty"
    }
  },
  "required": [
    "nonemptyTerms"
  ]
} as const satisfies ToolJsonSchema;
export const bramantipAai4ValidLookupOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "syllogism": {
      "type": "string",
      "description": "Mood and figure"
    },
    "valid": {
      "type": "boolean",
      "description": "Valid under supplied existence assumptions"
    },
    "requiredNonemptyTerm": {
      "type": "string",
      "enum": [
        "none",
        "S",
        "M",
        "P"
      ],
      "description": "Required existence assumption"
    }
  },
  "required": [
    "syllogism",
    "valid",
    "requiredNonemptyTerm"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.stat.berkeley.edu/~stark/SticiGui/Text/categoricalLogic.htm; https://faculty.fiu.edu/~harrisk/Notes/Critical%20Thinking/Categorical%20Syllogisms,%20Venn%20Diagrams%20and%20Rules%20for%20Testing.htm
export const calculateBramantipAai4ValidLookup = (rawInput: unknown): ToolResult<BramantipAai4ValidLookupOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly nonemptyTerms?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "nonemptyTerms"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const nonemptyTermsValue = candidate.nonemptyTerms;
  if (!Array.isArray(nonemptyTermsValue)) return issue("nonemptyTerms", "invalid_type", "Enter a dense array.");
  if (nonemptyTermsValue.length < 0) return issue("nonemptyTerms", "out_of_range", "Too few entries.");
  if (nonemptyTermsValue.length > 3) return issue("nonemptyTerms", "resource_limit", "Array exceeds the 3-entry resource limit.");
  const validatedNonemptyterms: ("S" | "M" | "P")[] = [];
  for (let index = 0; index < nonemptyTermsValue.length; index++) {
    if (!Object.prototype.hasOwnProperty.call(nonemptyTermsValue, index)) return issue(`nonemptyTerms.${index}`, "invalid_type", "Sparse arrays are not supported.");
    const item: unknown = nonemptyTermsValue[index];
    if (typeof item !== "string") return issue(`nonemptyTerms.${index}`, "invalid_type", "Enter a string value.");
    if (item !== "S" && item !== "M" && item !== "P") return issue(`nonemptyTerms.${index}`, "invalid_value", "Choose a supported value.");
    validatedNonemptyterms.push(item);
  }
  if (validatedNonemptyterms.reduce((total, cell) => total + cell.length, 0) > 100000) return issue("nonemptyTerms", "resource_limit", "Combined cell text exceeds 100,000 UTF-16 code units.");

  const input: BramantipAai4ValidLookupInput = { nonemptyTerms: validatedNonemptyterms };
  return toolSuccess({ syllogism: "AAI-4", valid: categoricalValidity("A", "A", "I", 4, input.nonemptyTerms), requiredNonemptyTerm: "P" });
};
export const example = {
  input: {
    "nonemptyTerms": [
      "P"
    ]
  },
  output: {
    "syllogism": "AAI-4",
    "valid": true,
    "requiredNonemptyTerm": "P"
  },
} satisfies ToolExample<BramantipAai4ValidLookupInput, BramantipAai4ValidLookupOutput>;
export const bramantipAai4ValidLookupTool = defineTool<BramantipAai4ValidLookupInput, BramantipAai4ValidLookupOutput>({
  id: "logic/bramantip-aai4-valid-lookup",
  title: "Bramantip AAI-4 Fourth Figure Valid Lookup",
  description: "Check Bramantip (AAI-4) under explicit nonempty-term assumptions using classical categorical semantics.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: bramantipAai4ValidLookupInputSchema,
  outputSchema: bramantipAai4ValidLookupOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "nonemptyTerms",
        "label": "Terms assumed nonempty",
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
        "id": "syllogism",
        "label": "Mood and figure",
        "valueType": {
          "type": "string"
        }
      },
      {
        "id": "valid",
        "label": "Valid under supplied existence assumptions",
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "requiredNonemptyTerm",
        "label": "Required existence assumption",
        "valueType": {
          "type": "string"
        }
      }
    ]
  },
  execute: calculateBramantipAai4ValidLookup,
});
export const runBramantipAai4ValidLookup = bramantipAai4ValidLookupTool.execute;
export default bramantipAai4ValidLookupTool;
