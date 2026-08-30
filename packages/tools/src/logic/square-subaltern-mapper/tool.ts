import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type SquareSubalternMapperInput = {
  readonly kind: "A" | "E";
  readonly subjectNonempty: boolean;
};
export type SquareSubalternMapperOutput = {
  readonly subaltern: "I" | "O";
  readonly implicationGuaranteed: boolean;
};
export const squareSubalternMapperInputSchema = {
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
export const squareSubalternMapperOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "subaltern": {
      "type": "string",
      "enum": [
        "I",
        "O"
      ],
      "description": "Particular proposition kind"
    },
    "implicationGuaranteed": {
      "type": "boolean",
      "description": "Universal implies particular under the assumption"
    }
  },
  "required": [
    "subaltern",
    "implicationGuaranteed"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.stat.berkeley.edu/~stark/SticiGui/Text/categoricalLogic.htm
export const calculateSquareSubalternMapper = (rawInput: unknown): ToolResult<SquareSubalternMapperOutput> => {
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

  const input: SquareSubalternMapperInput = { kind: kindValue, subjectNonempty: subjectNonemptyValue };
  return toolSuccess({ subaltern: input.kind === "A" ? "I" : "O", implicationGuaranteed: input.subjectNonempty });
};
export const example = {
  input: {
    "kind": "A",
    "subjectNonempty": true
  },
  output: {
    "subaltern": "I",
    "implicationGuaranteed": true
  },
} satisfies ToolExample<SquareSubalternMapperInput, SquareSubalternMapperOutput>;
export const squareSubalternMapperTool = defineTool<SquareSubalternMapperInput, SquareSubalternMapperOutput>({
  id: "logic/square-subaltern-mapper",
  title: "Square of Opposition Subaltern Implication Mapper (A-I, E-O)",
  description: "Map A to I or E to O and state whether a nonempty subject guarantees universal-to-particular implication.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: squareSubalternMapperInputSchema,
  outputSchema: squareSubalternMapperOutputSchema,
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
        "id": "subaltern",
        "label": "Particular proposition kind",
        "valueType": {
          "type": "string"
        }
      },
      {
        "id": "implicationGuaranteed",
        "label": "Universal implies particular under the assumption",
        "valueType": {
          "type": "boolean"
        }
      }
    ]
  },
  execute: calculateSquareSubalternMapper,
});
export const runSquareSubalternMapper = squareSubalternMapperTool.execute;
export default squareSubalternMapperTool;
