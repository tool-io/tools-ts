import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { categoricalValidity, figureTerms, termDistributed } from "../syllogism-mood-figure-parser/tool.js";
export type IllicitMajorFallacyDetectorInput = {
  readonly majorKind: "A" | "E" | "I" | "O";
  readonly conclusionKind: "A" | "E" | "I" | "O";
  readonly figure: number;
};
export type IllicitMajorFallacyDetectorOutput = {
  readonly illicitMajor: boolean;
};
export const illicitMajorFallacyDetectorInputSchema = {
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
    "conclusionKind": {
      "type": "string",
      "enum": [
        "A",
        "E",
        "I",
        "O"
      ],
      "description": "Conclusion proposition kind"
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
    "conclusionKind",
    "figure"
  ]
} as const satisfies ToolJsonSchema;
export const illicitMajorFallacyDetectorOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "illicitMajor": {
      "type": "boolean",
      "description": "Illicit Major"
    }
  },
  "required": [
    "illicitMajor"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.stat.berkeley.edu/~stark/SticiGui/Text/categoricalLogic.htm; https://faculty.fiu.edu/~harrisk/Notes/Critical%20Thinking/Categorical%20Syllogisms,%20Venn%20Diagrams%20and%20Rules%20for%20Testing.htm
export const calculateIllicitMajorFallacyDetector = (rawInput: unknown): ToolResult<IllicitMajorFallacyDetectorOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly majorKind?: unknown; readonly conclusionKind?: unknown; readonly figure?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "majorKind",
  "conclusionKind",
  "figure"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const majorKindValue = candidate.majorKind;
  if (typeof majorKindValue !== "string") return issue("majorKind", "invalid_type", "Enter a string value.");
  if (majorKindValue !== "A" && majorKindValue !== "E" && majorKindValue !== "I" && majorKindValue !== "O") return issue("majorKind", "invalid_value", "Choose a supported value.");
  const conclusionKindValue = candidate.conclusionKind;
  if (typeof conclusionKindValue !== "string") return issue("conclusionKind", "invalid_type", "Enter a string value.");
  if (conclusionKindValue !== "A" && conclusionKindValue !== "E" && conclusionKindValue !== "I" && conclusionKindValue !== "O") return issue("conclusionKind", "invalid_value", "Choose a supported value.");
  const figureValue = candidate.figure;
  if (typeof figureValue !== "number" || !Number.isSafeInteger(figureValue)) return issue("figure", "invalid_type", "Enter a finite safe integer.");
  if (figureValue < 1) return issue("figure", "out_of_range", "Value is outside the accepted range.");
  if (figureValue > 4) return issue("figure", "out_of_range", "Value is outside the accepted range.");

  const input: IllicitMajorFallacyDetectorInput = { majorKind: majorKindValue, conclusionKind: conclusionKindValue, figure: figureValue };
  const terms = figureTerms(input.figure);
  const premiseDistributed = termDistributed(input.majorKind, terms.majorSubject === "P" ? "subject" : "predicate");
  return toolSuccess({ illicitMajor: termDistributed(input.conclusionKind, "predicate") && !premiseDistributed });
};
export const example = {
  input: {
    "majorKind": "A",
    "conclusionKind": "E",
    "figure": 1
  },
  output: {
    "illicitMajor": true
  },
} satisfies ToolExample<IllicitMajorFallacyDetectorInput, IllicitMajorFallacyDetectorOutput>;
export const illicitMajorFallacyDetectorTool = defineTool<IllicitMajorFallacyDetectorInput, IllicitMajorFallacyDetectorOutput>({
  id: "logic/illicit-major-fallacy-detector",
  title: "Illicit Major Fallacy Detector",
  description: "Detect a major term distributed in a categorical conclusion but undistributed in its major premise.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: illicitMajorFallacyDetectorInputSchema,
  outputSchema: illicitMajorFallacyDetectorOutputSchema,
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
        "id": "conclusionKind",
        "label": "Conclusion proposition kind",
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
        "id": "illicitMajor",
        "label": "Illicit Major",
        "valueType": {
          "type": "boolean"
        }
      }
    ]
  },
  execute: calculateIllicitMajorFallacyDetector,
});
export const runIllicitMajorFallacyDetector = illicitMajorFallacyDetectorTool.execute;
export default illicitMajorFallacyDetectorTool;
