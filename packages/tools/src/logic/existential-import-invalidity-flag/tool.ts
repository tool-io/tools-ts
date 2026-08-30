import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { categoricalValidity, figureTerms, termDistributed } from "../syllogism-mood-figure-parser/tool.js";
export type ExistentialImportInvalidityFlagInput = {
  readonly majorKind: "A" | "E" | "I" | "O";
  readonly minorKind: "A" | "E" | "I" | "O";
  readonly conclusionKind: "A" | "E" | "I" | "O";
  readonly figure: number;
};
export type ExistentialImportInvalidityFlagOutput = {
  readonly validWithoutExistence: boolean;
  readonly validWithAllTermsNonempty: boolean;
  readonly existentialImportRequired: boolean;
};
export const existentialImportInvalidityFlagInputSchema = {
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
    "minorKind",
    "conclusionKind",
    "figure"
  ]
} as const satisfies ToolJsonSchema;
export const existentialImportInvalidityFlagOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "validWithoutExistence": {
      "type": "boolean",
      "description": "Valid Without Existence"
    },
    "validWithAllTermsNonempty": {
      "type": "boolean",
      "description": "Valid With All Terms Nonempty"
    },
    "existentialImportRequired": {
      "type": "boolean",
      "description": "Existential Import Required"
    }
  },
  "required": [
    "validWithoutExistence",
    "validWithAllTermsNonempty",
    "existentialImportRequired"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.stat.berkeley.edu/~stark/SticiGui/Text/categoricalLogic.htm; https://faculty.fiu.edu/~harrisk/Notes/Critical%20Thinking/Categorical%20Syllogisms,%20Venn%20Diagrams%20and%20Rules%20for%20Testing.htm
export const calculateExistentialImportInvalidityFlag = (rawInput: unknown): ToolResult<ExistentialImportInvalidityFlagOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly majorKind?: unknown; readonly minorKind?: unknown; readonly conclusionKind?: unknown; readonly figure?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "majorKind",
  "minorKind",
  "conclusionKind",
  "figure"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const majorKindValue = candidate.majorKind;
  if (typeof majorKindValue !== "string") return issue("majorKind", "invalid_type", "Enter a string value.");
  if (majorKindValue !== "A" && majorKindValue !== "E" && majorKindValue !== "I" && majorKindValue !== "O") return issue("majorKind", "invalid_value", "Choose a supported value.");
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

  const input: ExistentialImportInvalidityFlagInput = { majorKind: majorKindValue, minorKind: minorKindValue, conclusionKind: conclusionKindValue, figure: figureValue };
  const validWithoutExistence = categoricalValidity(input.majorKind, input.minorKind, input.conclusionKind, input.figure, []);
  const validWithAllTermsNonempty = categoricalValidity(input.majorKind, input.minorKind, input.conclusionKind, input.figure, ["S", "M", "P"]);
  return toolSuccess({ validWithoutExistence, validWithAllTermsNonempty, existentialImportRequired: !validWithoutExistence && validWithAllTermsNonempty });
};
export const example = {
  input: {
    "majorKind": "A",
    "minorKind": "A",
    "conclusionKind": "I",
    "figure": 3
  },
  output: {
    "validWithoutExistence": false,
    "validWithAllTermsNonempty": true,
    "existentialImportRequired": true
  },
} satisfies ToolExample<ExistentialImportInvalidityFlagInput, ExistentialImportInvalidityFlagOutput>;
export const existentialImportInvalidityFlagTool = defineTool<ExistentialImportInvalidityFlagInput, ExistentialImportInvalidityFlagOutput>({
  id: "logic/existential-import-invalidity-flag",
  title: "Existential Import Modern Invalidity Flag for AA-3",
  description: "Identify categorical syllogisms that become valid only when nonempty terms are assumed.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: existentialImportInvalidityFlagInputSchema,
  outputSchema: existentialImportInvalidityFlagOutputSchema,
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
        "id": "validWithoutExistence",
        "label": "Valid Without Existence",
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "validWithAllTermsNonempty",
        "label": "Valid With All Terms Nonempty",
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "existentialImportRequired",
        "label": "Existential Import Required",
        "valueType": {
          "type": "boolean"
        }
      }
    ]
  },
  execute: calculateExistentialImportInvalidityFlag,
});
export const runExistentialImportInvalidityFlag = existentialImportInvalidityFlagTool.execute;
export default existentialImportInvalidityFlagTool;
