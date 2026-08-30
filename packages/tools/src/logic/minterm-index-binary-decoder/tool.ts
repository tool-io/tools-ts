import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { truthAssignment } from "../cnf-clause-set-from-truth-table-builder/tool.js";
export type MintermIndexBinaryDecoderInput = {
  readonly variables: ReadonlyArray<string>;
  readonly index: number;
};
export type MintermIndexBinaryDecoderOutput = {
  readonly bits: string;
  readonly minterm: string;
};
export const mintermIndexBinaryDecoderInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "variables": {
      "type": "array",
      "items": {
        "type": "string",
        "maxLength": 100,
        "pattern": "^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])"
      },
      "minItems": 0,
      "maxItems": 52,
      "description": "Distinct variables in most-significant-bit order"
    },
    "index": {
      "type": "integer",
      "minimum": 0,
      "maximum": 9007199254740991,
      "description": "Minterm index"
    }
  },
  "required": [
    "variables",
    "index"
  ]
} as const satisfies ToolJsonSchema;
export const mintermIndexBinaryDecoderOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "bits": {
      "type": "string",
      "description": "Binary assignment"
    },
    "minterm": {
      "type": "string",
      "description": "Minterm formula"
    }
  },
  "required": [
    "bits",
    "minterm"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://forallx.openlogicproject.org/html/Ch11.html; https://forallx.openlogicproject.org/html/Ch19.html
export const calculateMintermIndexBinaryDecoder = (rawInput: unknown): ToolResult<MintermIndexBinaryDecoderOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly variables?: unknown; readonly index?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "variables",
  "index"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const variablesValue = candidate.variables;
  if (!Array.isArray(variablesValue)) return issue("variables", "invalid_type", "Enter a dense array.");
  if (variablesValue.length < 0) return issue("variables", "out_of_range", "Too few entries.");
  if (variablesValue.length > 52) return issue("variables", "resource_limit", "Array exceeds the 52-entry resource limit.");
  const validatedVariables: string[] = [];
  for (let index = 0; index < variablesValue.length; index++) {
    if (!Object.prototype.hasOwnProperty.call(variablesValue, index)) return issue(`variables.${index}`, "invalid_type", "Sparse arrays are not supported.");
    const item: unknown = variablesValue[index];
    if (typeof item !== "string") return issue(`variables.${index}`, "invalid_type", "Enter a string value.");
    if (item.length > 100) return issue(`variables.${index}`, "resource_limit", "Text exceeds the 100-character resource limit.");
    if (!(new RegExp("^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])")).test(item)) return issue(`variables.${index}`, "invalid_format", "Text does not match the accepted syntax.");
    validatedVariables.push(item);
  }
  if (validatedVariables.reduce((total, cell) => total + cell.length, 0) > 100000) return issue("variables", "resource_limit", "Combined cell text exceeds 100,000 UTF-16 code units.");
  const indexValue = candidate.index;
  if (typeof indexValue !== "number" || !Number.isSafeInteger(indexValue)) return issue("index", "invalid_type", "Enter a finite safe integer.");
  if (indexValue < 0) return issue("index", "out_of_range", "Value is outside the accepted range.");
  if (indexValue > 9007199254740991) return issue("index", "out_of_range", "Value is outside the accepted range.");

  const input: MintermIndexBinaryDecoderInput = { variables: validatedVariables, index: indexValue };
  if (new Set(input.variables).size !== input.variables.length) return issue("variables", "duplicate_variable", "Variable identifiers must be distinct.");
  if (input.index >= 2 ** input.variables.length) return issue("index", "out_of_range", "Index exceeds the variable bit width.");
  const assignment = truthAssignment(input.index, input.variables.length);
  return toolSuccess({ bits: assignment.map((bit) => bit ? "1" : "0").join(""), minterm: input.variables.map((name, index) => `${assignment[index] ? "" : "!"}${name}`).join(" && ") || "true" });
};
export const example = {
  input: {
    "variables": [
      "p",
      "q",
      "r"
    ],
    "index": 5
  },
  output: {
    "bits": "101",
    "minterm": "p && !q && r"
  },
} satisfies ToolExample<MintermIndexBinaryDecoderInput, MintermIndexBinaryDecoderOutput>;
export const mintermIndexBinaryDecoderTool = defineTool<MintermIndexBinaryDecoderInput, MintermIndexBinaryDecoderOutput>({
  id: "logic/minterm-index-binary-decoder",
  title: "Minterm Index Binary Assignment Decoder",
  description: "Decode a minterm index into fixed-width binary bits and the corresponding conjunction of identifier literals.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: mintermIndexBinaryDecoderInputSchema,
  outputSchema: mintermIndexBinaryDecoderOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "variables",
        "label": "Distinct variables in most-significant-bit order",
        "required": true,
        "valueType": {
          "type": "list",
          "items": {
            "type": "string"
          }
        }
      },
      {
        "id": "index",
        "label": "Minterm index",
        "required": true,
        "valueType": {
          "type": "integer"
        }
      }
    ],
    "outputs": [
      {
        "id": "bits",
        "label": "Binary assignment",
        "valueType": {
          "type": "string",
          "format": "binary"
        }
      },
      {
        "id": "minterm",
        "label": "Minterm formula",
        "valueType": {
          "type": "string",
          "format": "propositional-formula"
        }
      }
    ]
  },
  execute: calculateMintermIndexBinaryDecoder,
});
export const runMintermIndexBinaryDecoder = mintermIndexBinaryDecoderTool.execute;
export default mintermIndexBinaryDecoderTool;
