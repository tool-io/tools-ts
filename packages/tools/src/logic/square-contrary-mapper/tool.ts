import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type SquareContraryMapperInput = {
  readonly kind: "A" | "E";
  readonly subjectNonempty: boolean;
};
export type SquareContraryMapperOutput = {
  readonly contrary: "A" | "E";
  readonly relationGuaranteed: boolean;
};
export const squareContraryMapperInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "kind": {
      "type": "string",
      "enum": [
        "A",
        "E"
      ],
      "description": "Universal proposition kind"
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
export const squareContraryMapperOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "contrary": {
      "type": "string",
      "enum": [
        "A",
        "E"
      ],
      "description": "Contrary proposition kind"
    },
    "relationGuaranteed": {
      "type": "boolean",
      "description": "Cannot both be true under the assumption"
    }
  },
  "required": [
    "contrary",
    "relationGuaranteed"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.stat.berkeley.edu/~stark/SticiGui/Text/categoricalLogic.htm
export const calculateSquareContraryMapper = (rawInput: unknown): ToolResult<SquareContraryMapperOutput> => {
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
  if (kindValue !== "A" && kindValue !== "E") return issue("kind", "invalid_value", "Choose a supported value.");
  const subjectNonemptyValue = candidate.subjectNonempty;
  if (typeof subjectNonemptyValue !== "boolean") return issue("subjectNonempty", "invalid_type", "Enter a boolean value.");

  const input: SquareContraryMapperInput = { kind: kindValue, subjectNonempty: subjectNonemptyValue };
  return toolSuccess({ contrary: input.kind === "A" ? "E" : "A", relationGuaranteed: input.subjectNonempty });
};
export const example = {
  input: {
    "kind": "A",
    "subjectNonempty": true
  },
  output: {
    "contrary": "E",
    "relationGuaranteed": true
  },
} satisfies ToolExample<SquareContraryMapperInput, SquareContraryMapperOutput>;
export const squareContraryMapperTool = defineTool<SquareContraryMapperInput, SquareContraryMapperOutput>({
  id: "logic/square-contrary-mapper",
  title: "Square of Opposition Contrary Pair Mapper (A-E)",
  description: "Map an A or E proposition to its contrary and state whether a nonempty subject guarantees the relation.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: squareContraryMapperInputSchema,
  outputSchema: squareContraryMapperOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "kind",
        "label": "Universal proposition kind",
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
        "id": "contrary",
        "label": "Contrary proposition kind",
        "valueType": {
          "type": "string"
        }
      },
      {
        "id": "relationGuaranteed",
        "label": "Cannot both be true under the assumption",
        "valueType": {
          "type": "boolean"
        }
      }
    ]
  },
  execute: calculateSquareContraryMapper,
});
export const runSquareContraryMapper = squareContraryMapperTool.execute;
export default squareContraryMapperTool;
