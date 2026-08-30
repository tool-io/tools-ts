import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { categoricalValidity, figureTerms, termDistributed } from "../syllogism-mood-figure-parser/tool.js";
export type FestinoEio2ValidLookupInput = {
  readonly nonemptyTerms: ReadonlyArray<"S" | "M" | "P">;
};
export type FestinoEio2ValidLookupOutput = {
  readonly syllogism: string;
  readonly valid: boolean;
  readonly requiredNonemptyTerm: "none" | "S" | "M" | "P";
};
export const festinoEio2ValidLookupInputSchema = {
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
export const festinoEio2ValidLookupOutputSchema = {
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
export const calculateFestinoEio2ValidLookup = (rawInput: unknown): ToolResult<FestinoEio2ValidLookupOutput> => {
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

  const input: FestinoEio2ValidLookupInput = { nonemptyTerms: validatedNonemptyterms };
  return toolSuccess({ syllogism: "EIO-2", valid: categoricalValidity("E", "I", "O", 2, input.nonemptyTerms), requiredNonemptyTerm: "none" });
};
export const example = {
  input: {
    "nonemptyTerms": []
  },
  output: {
    "syllogism": "EIO-2",
    "valid": true,
    "requiredNonemptyTerm": "none"
  },
} satisfies ToolExample<FestinoEio2ValidLookupInput, FestinoEio2ValidLookupOutput>;
export const festinoEio2ValidLookupTool = defineTool<FestinoEio2ValidLookupInput, FestinoEio2ValidLookupOutput>({
  id: "logic/festino-eio2-valid-lookup",
  title: "Festino EIO-2 Valid Form Lookup",
  description: "Check Festino (EIO-2) under explicit nonempty-term assumptions using classical categorical semantics.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: festinoEio2ValidLookupInputSchema,
  outputSchema: festinoEio2ValidLookupOutputSchema,
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
  execute: calculateFestinoEio2ValidLookup,
});
export const runFestinoEio2ValidLookup = festinoEio2ValidLookupTool.execute;
export default festinoEio2ValidLookupTool;
