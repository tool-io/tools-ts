import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type SquareContradictoryMapperInput = {
  readonly kind: "A" | "E" | "I" | "O";
};
export type SquareContradictoryMapperOutput = {
  readonly contradictory: "A" | "E" | "I" | "O";
};
export const squareContradictoryMapperInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "kind": {
      "type": "string",
      "enum": [
        "A",
        "E",
        "I",
        "O"
      ],
      "description": "Categorical proposition kind"
    }
  },
  "required": [
    "kind"
  ]
} as const satisfies ToolJsonSchema;
export const squareContradictoryMapperOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "contradictory": {
      "type": "string",
      "enum": [
        "A",
        "E",
        "I",
        "O"
      ],
      "description": "Contradictory proposition kind"
    }
  },
  "required": [
    "contradictory"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.stat.berkeley.edu/~stark/SticiGui/Text/categoricalLogic.htm
export const calculateSquareContradictoryMapper = (rawInput: unknown): ToolResult<SquareContradictoryMapperOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly kind?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "kind"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const kindValue = candidate.kind;
  if (typeof kindValue !== "string") return issue("kind", "invalid_type", "Enter a string value.");
  if (kindValue !== "A" && kindValue !== "E" && kindValue !== "I" && kindValue !== "O") return issue("kind", "invalid_value", "Choose a supported value.");

  const input: SquareContradictoryMapperInput = { kind: kindValue };
  const pairs = { A: "O", E: "I", I: "E", O: "A" } as const;
  return toolSuccess({ contradictory: pairs[input.kind] });
};
export const example = {
  input: {
    "kind": "A"
  },
  output: {
    "contradictory": "O"
  },
} satisfies ToolExample<SquareContradictoryMapperInput, SquareContradictoryMapperOutput>;
export const squareContradictoryMapperTool = defineTool<SquareContradictoryMapperInput, SquareContradictoryMapperOutput>({
  id: "logic/square-contradictory-mapper",
  title: "Square of Opposition Contradictory Pair Mapper (A-O, E-I)",
  description: "Map a categorical proposition to its contradictory form for the same subject and predicate.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: squareContradictoryMapperInputSchema,
  outputSchema: squareContradictoryMapperOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "kind",
        "label": "Categorical proposition kind",
        "required": true,
        "valueType": {
          "type": "string"
        }
      }
    ],
    "outputs": [
      {
        "id": "contradictory",
        "label": "Contradictory proposition kind",
        "valueType": {
          "type": "string"
        }
      }
    ]
  },
  execute: calculateSquareContradictoryMapper,
});
export const runSquareContradictoryMapper = squareContradictoryMapperTool.execute;
export default squareContradictoryMapperTool;
