import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { categoricalValidity, figureTerms, termDistributed } from "../syllogism-mood-figure-parser/tool.js";
export type UndistributedMiddleFallacyDetectorInput = {
  readonly majorKind: "A" | "E" | "I" | "O";
  readonly minorKind: "A" | "E" | "I" | "O";
  readonly figure: number;
};
export type UndistributedMiddleFallacyDetectorOutput = {
  readonly undistributedMiddle: boolean;
};
export const undistributedMiddleFallacyDetectorInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "majorKind": {
      "type": "string",
      "enum": [
        "A",
        "E",
        "I",
        "O"
      ],
      "description": "Major proposition kind"
    },
    "minorKind": {
      "type": "string",
      "enum": [
        "A",
        "E",
        "I",
        "O"
      ],
      "description": "Minor proposition kind"
    },
    "figure": {
      "type": "integer",
      "minimum": 1,
      "maximum": 4,
      "description": "Syllogism figure"
    }
  },
  "required": [
    "majorKind",
    "minorKind",
    "figure"
  ]
} as const satisfies ToolJsonSchema;
export const undistributedMiddleFallacyDetectorOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "undistributedMiddle": {
      "type": "boolean",
      "description": "Undistributed Middle"
    }
  },
  "required": [
    "undistributedMiddle"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.stat.berkeley.edu/~stark/SticiGui/Text/categoricalLogic.htm; https://faculty.fiu.edu/~harrisk/Notes/Critical%20Thinking/Categorical%20Syllogisms,%20Venn%20Diagrams%20and%20Rules%20for%20Testing.htm
export const calculateUndistributedMiddleFallacyDetector = (rawInput: unknown): ToolResult<UndistributedMiddleFallacyDetectorOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly majorKind?: unknown; readonly minorKind?: unknown; readonly figure?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "majorKind",
  "minorKind",
  "figure"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const majorKindValue = candidate.majorKind;
  if (typeof majorKindValue !== "string") return issue("majorKind", "invalid_type", "Enter a string value.");
  if (majorKindValue !== "A" && majorKindValue !== "E" && majorKindValue !== "I" && majorKindValue !== "O") return issue("majorKind", "invalid_value", "Choose a supported value.");
  const minorKindValue = candidate.minorKind;
  if (typeof minorKindValue !== "string") return issue("minorKind", "invalid_type", "Enter a string value.");
  if (minorKindValue !== "A" && minorKindValue !== "E" && minorKindValue !== "I" && minorKindValue !== "O") return issue("minorKind", "invalid_value", "Choose a supported value.");
  const figureValue = candidate.figure;
  if (typeof figureValue !== "number" || !Number.isSafeInteger(figureValue)) return issue("figure", "invalid_type", "Enter a finite safe integer.");
  if (figureValue < 1) return issue("figure", "out_of_range", "Value is outside the accepted range.");
  if (figureValue > 4) return issue("figure", "out_of_range", "Value is outside the accepted range.");

  const input: UndistributedMiddleFallacyDetectorInput = { majorKind: majorKindValue, minorKind: minorKindValue, figure: figureValue };
  const terms = figureTerms(input.figure);
  const inMajor = termDistributed(input.majorKind, terms.majorSubject === "M" ? "subject" : "predicate");
  const inMinor = termDistributed(input.minorKind, terms.minorSubject === "M" ? "subject" : "predicate");
  return toolSuccess({ undistributedMiddle: !inMajor && !inMinor });
};
export const example = {
  input: {
    "majorKind": "A",
    "minorKind": "A",
    "figure": 2
  },
  output: {
    "undistributedMiddle": true
  },
} satisfies ToolExample<UndistributedMiddleFallacyDetectorInput, UndistributedMiddleFallacyDetectorOutput>;
export const undistributedMiddleFallacyDetectorTool = defineTool<UndistributedMiddleFallacyDetectorInput, UndistributedMiddleFallacyDetectorOutput>({
  id: "logic/undistributed-middle-fallacy-detector",
  title: "Undistributed Middle Fallacy Detector",
  description: "Detect an undistributed middle term in the two premises of a standard categorical syllogism.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: undistributedMiddleFallacyDetectorInputSchema,
  outputSchema: undistributedMiddleFallacyDetectorOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "majorKind",
        "label": "Major proposition kind",
        "required": true,
        "valueType": {
          "type": "string"
        }
      },
      {
        "id": "minorKind",
        "label": "Minor proposition kind",
        "required": true,
        "valueType": {
          "type": "string"
        }
      },
      {
        "id": "figure",
        "label": "Syllogism figure",
        "required": true,
        "valueType": {
          "type": "integer"
        }
      }
    ],
    "outputs": [
      {
        "id": "undistributedMiddle",
        "label": "Undistributed Middle",
        "valueType": {
          "type": "boolean"
        }
      }
    ]
  },
  execute: calculateUndistributedMiddleFallacyDetector,
});
export const runUndistributedMiddleFallacyDetector = undistributedMiddleFallacyDetectorTool.execute;
export default undistributedMiddleFallacyDetectorTool;
