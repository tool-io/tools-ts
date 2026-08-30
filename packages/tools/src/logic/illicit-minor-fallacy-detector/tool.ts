import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { categoricalValidity, figureTerms, termDistributed } from "../syllogism-mood-figure-parser/tool.js";
export type IllicitMinorFallacyDetectorInput = {
  readonly minorKind: "A" | "E" | "I" | "O";
  readonly conclusionKind: "A" | "E" | "I" | "O";
  readonly figure: number;
};
export type IllicitMinorFallacyDetectorOutput = {
  readonly illicitMinor: boolean;
};
export const illicitMinorFallacyDetectorInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
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
    "minorKind",
    "conclusionKind",
    "figure"
  ]
} as const satisfies ToolJsonSchema;
export const illicitMinorFallacyDetectorOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "illicitMinor": {
      "type": "boolean",
      "description": "Illicit Minor"
    }
  },
  "required": [
    "illicitMinor"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.stat.berkeley.edu/~stark/SticiGui/Text/categoricalLogic.htm; https://faculty.fiu.edu/~harrisk/Notes/Critical%20Thinking/Categorical%20Syllogisms,%20Venn%20Diagrams%20and%20Rules%20for%20Testing.htm
export const calculateIllicitMinorFallacyDetector = (rawInput: unknown): ToolResult<IllicitMinorFallacyDetectorOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly minorKind?: unknown; readonly conclusionKind?: unknown; readonly figure?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "minorKind",
  "conclusionKind",
  "figure"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const minorKindValue = candidate.minorKind;
  if (typeof minorKindValue !== "string") return issue("minorKind", "invalid_type", "Enter a string value.");
  if (minorKindValue !== "A" && minorKindValue !== "E" && minorKindValue !== "I" && minorKindValue !== "O") return issue("minorKind", "invalid_value", "Choose a supported value.");
  const conclusionKindValue = candidate.conclusionKind;
  if (typeof conclusionKindValue !== "string") return issue("conclusionKind", "invalid_type", "Enter a string value.");
  if (conclusionKindValue !== "A" && conclusionKindValue !== "E" && conclusionKindValue !== "I" && conclusionKindValue !== "O") return issue("conclusionKind", "invalid_value", "Choose a supported value.");
  const figureValue = candidate.figure;
  if (typeof figureValue !== "number" || !Number.isSafeInteger(figureValue)) return issue("figure", "invalid_type", "Enter a finite safe integer.");
  if (figureValue < 1) return issue("figure", "out_of_range", "Value is outside the accepted range.");
  if (figureValue > 4) return issue("figure", "out_of_range", "Value is outside the accepted range.");

  const input: IllicitMinorFallacyDetectorInput = { minorKind: minorKindValue, conclusionKind: conclusionKindValue, figure: figureValue };
  const terms = figureTerms(input.figure);
  const premiseDistributed = termDistributed(input.minorKind, terms.minorSubject === "S" ? "subject" : "predicate");
  return toolSuccess({ illicitMinor: termDistributed(input.conclusionKind, "subject") && !premiseDistributed });
};
export const example = {
  input: {
    "minorKind": "A",
    "conclusionKind": "A",
    "figure": 3
  },
  output: {
    "illicitMinor": true
  },
} satisfies ToolExample<IllicitMinorFallacyDetectorInput, IllicitMinorFallacyDetectorOutput>;
export const illicitMinorFallacyDetectorTool = defineTool<IllicitMinorFallacyDetectorInput, IllicitMinorFallacyDetectorOutput>({
  id: "logic/illicit-minor-fallacy-detector",
  title: "Illicit Minor Fallacy Detector",
  description: "Detect a minor term distributed in a categorical conclusion but undistributed in its minor premise.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: illicitMinorFallacyDetectorInputSchema,
  outputSchema: illicitMinorFallacyDetectorOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "minorKind",
        "label": "Minor proposition kind",
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
        "id": "illicitMinor",
        "label": "Illicit Minor",
        "valueType": {
          "type": "boolean"
        }
      }
    ]
  },
  execute: calculateIllicitMinorFallacyDetector,
});
export const runIllicitMinorFallacyDetector = illicitMinorFallacyDetectorTool.execute;
export default illicitMinorFallacyDetectorTool;
