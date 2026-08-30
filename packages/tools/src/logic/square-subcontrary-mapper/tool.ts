import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type SquareSubcontraryMapperInput = {
  readonly kind: "I" | "O";
  readonly subjectNonempty: boolean;
};
export type SquareSubcontraryMapperOutput = {
  readonly subcontrary: "I" | "O";
  readonly relationGuaranteed: boolean;
};
export const squareSubcontraryMapperInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "kind": {
      "type": "string",
      "enum": [
        "I",
        "O"
      ],
      "description": "Particular proposition kind"
    },
    "subjectNonempty": {
      "type": "boolean",
      "description": "Subject class known nonempty"
    }
  },
  "required": [
    "kind",
    "subjectNonempty"
  ]
} as const satisfies ToolJsonSchema;
export const squareSubcontraryMapperOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "subcontrary": {
      "type": "string",
      "enum": [
        "I",
        "O"
      ],
      "description": "Subcontrary proposition kind"
    },
    "relationGuaranteed": {
      "type": "boolean",
      "description": "Cannot both be false under the assumption"
    }
  },
  "required": [
    "subcontrary",
    "relationGuaranteed"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.stat.berkeley.edu/~stark/SticiGui/Text/categoricalLogic.htm
export const calculateSquareSubcontraryMapper = (rawInput: unknown): ToolResult<SquareSubcontraryMapperOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly kind?: unknown; readonly subjectNonempty?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "kind",
  "subjectNonempty"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const kindValue = candidate.kind;
  if (typeof kindValue !== "string") return issue("kind", "invalid_type", "Enter a string value.");
  if (kindValue !== "I" && kindValue !== "O") return issue("kind", "invalid_value", "Choose a supported value.");
  const subjectNonemptyValue = candidate.subjectNonempty;
  if (typeof subjectNonemptyValue !== "boolean") return issue("subjectNonempty", "invalid_type", "Enter a boolean value.");

  const input: SquareSubcontraryMapperInput = { kind: kindValue, subjectNonempty: subjectNonemptyValue };
  return toolSuccess({ subcontrary: input.kind === "I" ? "O" : "I", relationGuaranteed: input.subjectNonempty });
};
export const example = {
  input: {
    "kind": "I",
    "subjectNonempty": true
  },
  output: {
    "subcontrary": "O",
    "relationGuaranteed": true
  },
} satisfies ToolExample<SquareSubcontraryMapperInput, SquareSubcontraryMapperOutput>;
export const squareSubcontraryMapperTool = defineTool<SquareSubcontraryMapperInput, SquareSubcontraryMapperOutput>({
  id: "logic/square-subcontrary-mapper",
  title: "Square of Opposition Subcontrary Pair Mapper (I-O)",
  description: "Map an I or O proposition to its subcontrary and state whether a nonempty subject guarantees the relation.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: squareSubcontraryMapperInputSchema,
  outputSchema: squareSubcontraryMapperOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "kind",
        "label": "Particular proposition kind",
        "required": true,
        "valueType": {
          "type": "string"
        }
      },
      {
        "id": "subjectNonempty",
        "label": "Subject class known nonempty",
        "required": true,
        "valueType": {
          "type": "boolean"
        }
      }
    ],
    "outputs": [
      {
        "id": "subcontrary",
        "label": "Subcontrary proposition kind",
        "valueType": {
          "type": "string"
        }
      },
      {
        "id": "relationGuaranteed",
        "label": "Cannot both be false under the assumption",
        "valueType": {
          "type": "boolean"
        }
      }
    ]
  },
  execute: calculateSquareSubcontraryMapper,
});
export const runSquareSubcontraryMapper = squareSubcontraryMapperTool.execute;
export default squareSubcontraryMapperTool;
