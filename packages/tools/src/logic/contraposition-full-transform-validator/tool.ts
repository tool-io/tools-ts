import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type ContrapositionFullTransformValidatorInput = {
  readonly kind: "A" | "E" | "I" | "O";
  readonly subject: string;
  readonly predicate: string;
};
export type ContrapositionFullTransformValidatorOutput = {
  readonly kind: "A" | "E" | "I" | "O";
  readonly subject: string;
  readonly predicate: string;
  readonly subjectComplemented: boolean;
  readonly predicateComplemented: boolean;
  readonly valid: boolean;
};
export const contrapositionFullTransformValidatorInputSchema = {
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
      "description": "Proposition kind"
    },
    "subject": {
      "type": "string",
      "maxLength": 100,
      "pattern": "^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])",
      "description": "Subject"
    },
    "predicate": {
      "type": "string",
      "maxLength": 100,
      "pattern": "^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])",
      "description": "Predicate"
    }
  },
  "required": [
    "kind",
    "subject",
    "predicate"
  ]
} as const satisfies ToolJsonSchema;
export const contrapositionFullTransformValidatorOutputSchema = {
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
      "description": "Contraposed proposition kind"
    },
    "subject": {
      "type": "string",
      "pattern": "^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])",
      "description": "Subject"
    },
    "predicate": {
      "type": "string",
      "pattern": "^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])",
      "description": "Predicate"
    },
    "subjectComplemented": {
      "type": "boolean",
      "description": "Output subject complemented"
    },
    "predicateComplemented": {
      "type": "boolean",
      "description": "Output predicate complemented"
    },
    "valid": {
      "type": "boolean",
      "description": "Full contraposition preserves truth"
    }
  },
  "required": [
    "kind",
    "subject",
    "predicate",
    "subjectComplemented",
    "predicateComplemented",
    "valid"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://homepages.hass.rpi.edu/heuveb/Teaching/CriticalWisdom/Deduction.htm; https://www.stat.berkeley.edu/~stark/SticiGui/Text/categoricalLogic.htm
export const calculateContrapositionFullTransformValidator = (rawInput: unknown): ToolResult<ContrapositionFullTransformValidatorOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly kind?: unknown; readonly subject?: unknown; readonly predicate?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "kind",
  "subject",
  "predicate"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const kindValue = candidate.kind;
  if (typeof kindValue !== "string") return issue("kind", "invalid_type", "Enter a string value.");
  if (kindValue !== "A" && kindValue !== "E" && kindValue !== "I" && kindValue !== "O") return issue("kind", "invalid_value", "Choose a supported value.");
  const subjectValue = candidate.subject;
  if (typeof subjectValue !== "string") return issue("subject", "invalid_type", "Enter a string value.");
  if (subjectValue.length > 100) return issue("subject", "resource_limit", "Text exceeds the 100-character resource limit.");
  if (!(new RegExp("^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])")).test(subjectValue)) return issue("subject", "invalid_format", "Text does not match the accepted syntax.");
  const predicateValue = candidate.predicate;
  if (typeof predicateValue !== "string") return issue("predicate", "invalid_type", "Enter a string value.");
  if (predicateValue.length > 100) return issue("predicate", "resource_limit", "Text exceeds the 100-character resource limit.");
  if (!(new RegExp("^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])")).test(predicateValue)) return issue("predicate", "invalid_format", "Text does not match the accepted syntax.");

  const input: ContrapositionFullTransformValidatorInput = { kind: kindValue, subject: subjectValue, predicate: predicateValue };
  return toolSuccess({ kind: input.kind, subject: input.predicate, predicate: input.subject, subjectComplemented: true, predicateComplemented: true, valid: input.kind === "A" || input.kind === "O" });
};
export const example = {
  input: {
    "kind": "A",
    "subject": "S",
    "predicate": "P"
  },
  output: {
    "kind": "A",
    "subject": "P",
    "predicate": "S",
    "subjectComplemented": true,
    "predicateComplemented": true,
    "valid": true
  },
} satisfies ToolExample<ContrapositionFullTransformValidatorInput, ContrapositionFullTransformValidatorOutput>;
export const contrapositionFullTransformValidatorTool = defineTool<ContrapositionFullTransformValidatorInput, ContrapositionFullTransformValidatorOutput>({
  id: "logic/contraposition-full-transform-validator",
  title: "Contraposition Immediate Inference Full Transform Validator (A,O valid)",
  description: "Form full contraposition by swapping and complementing both categorical terms and test its validity.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: contrapositionFullTransformValidatorInputSchema,
  outputSchema: contrapositionFullTransformValidatorOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "kind",
        "label": "Proposition kind",
        "required": true,
        "valueType": {
          "type": "string"
        }
      },
      {
        "id": "subject",
        "label": "Subject",
        "required": true,
        "valueType": {
          "type": "string"
        }
      },
      {
        "id": "predicate",
        "label": "Predicate",
        "required": true,
        "valueType": {
          "type": "string"
        }
      }
    ],
    "outputs": [
      {
        "id": "kind",
        "label": "Contraposed proposition kind",
        "valueType": {
          "type": "string"
        }
      },
      {
        "id": "subject",
        "label": "Subject",
        "valueType": {
          "type": "string"
        }
      },
      {
        "id": "predicate",
        "label": "Predicate",
        "valueType": {
          "type": "string"
        }
      },
      {
        "id": "subjectComplemented",
        "label": "Output subject complemented",
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "predicateComplemented",
        "label": "Output predicate complemented",
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "valid",
        "label": "Full contraposition preserves truth",
        "valueType": {
          "type": "boolean"
        }
      }
    ]
  },
  execute: calculateContrapositionFullTransformValidator,
});
export const runContrapositionFullTransformValidator = contrapositionFullTransformValidatorTool.execute;
export default contrapositionFullTransformValidatorTool;
