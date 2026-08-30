import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type ConversionSwapperValidityCheckerInput = {
  readonly kind: "A" | "E" | "I" | "O";
  readonly subject: string;
  readonly predicate: string;
};
export type ConversionSwapperValidityCheckerOutput = {
  readonly kind: "A" | "E" | "I" | "O";
  readonly subject: string;
  readonly predicate: string;
  readonly valid: boolean;
};
export const conversionSwapperValidityCheckerInputSchema = {
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
export const conversionSwapperValidityCheckerOutputSchema = {
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
      "description": "Converted proposition kind"
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
    "valid": {
      "type": "boolean",
      "description": "Conversion preserves truth"
    }
  },
  "required": [
    "kind",
    "subject",
    "predicate",
    "valid"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://homepages.hass.rpi.edu/heuveb/Teaching/CriticalWisdom/Deduction.htm; https://www.stat.berkeley.edu/~stark/SticiGui/Text/categoricalLogic.htm
export const calculateConversionSwapperValidityChecker = (rawInput: unknown): ToolResult<ConversionSwapperValidityCheckerOutput> => {
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

  const input: ConversionSwapperValidityCheckerInput = { kind: kindValue, subject: subjectValue, predicate: predicateValue };
  return toolSuccess({ kind: input.kind, subject: input.predicate, predicate: input.subject, valid: input.kind === "E" || input.kind === "I" || input.subject === input.predicate });
};
export const example = {
  input: {
    "kind": "E",
    "subject": "S",
    "predicate": "P"
  },
  output: {
    "kind": "E",
    "subject": "P",
    "predicate": "S",
    "valid": true
  },
} satisfies ToolExample<ConversionSwapperValidityCheckerInput, ConversionSwapperValidityCheckerOutput>;
export const conversionSwapperValidityCheckerTool = defineTool<ConversionSwapperValidityCheckerInput, ConversionSwapperValidityCheckerOutput>({
  id: "logic/conversion-swapper-validity-checker",
  title: "Conversion Immediate Inference Subject-Predicate Swapper (E,I valid)",
  description: "Swap subject and predicate by simple conversion and test whether that conversion preserves truth for identifier categories.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: conversionSwapperValidityCheckerInputSchema,
  outputSchema: conversionSwapperValidityCheckerOutputSchema,
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
        "label": "Converted proposition kind",
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
        "id": "valid",
        "label": "Conversion preserves truth",
        "valueType": {
          "type": "boolean"
        }
      }
    ]
  },
  execute: calculateConversionSwapperValidityChecker,
});
export const runConversionSwapperValidityChecker = conversionSwapperValidityCheckerTool.execute;
export default conversionSwapperValidityCheckerTool;
