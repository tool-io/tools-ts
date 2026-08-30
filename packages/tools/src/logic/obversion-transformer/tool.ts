import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type ObversionTransformerInput = {
  readonly kind: "A" | "E" | "I" | "O";
  readonly subject: string;
  readonly predicate: string;
  readonly predicateComplemented: boolean;
};
export type ObversionTransformerOutput = {
  readonly kind: "A" | "E" | "I" | "O";
  readonly subject: string;
  readonly predicate: string;
  readonly predicateComplemented: boolean;
};
export const obversionTransformerInputSchema = {
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
    },
    "predicateComplemented": {
      "type": "boolean",
      "description": "Input predicate complemented"
    }
  },
  "required": [
    "kind",
    "subject",
    "predicate",
    "predicateComplemented"
  ]
} as const satisfies ToolJsonSchema;
export const obversionTransformerOutputSchema = {
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
      "description": "Obverted proposition kind"
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
    "predicateComplemented": {
      "type": "boolean",
      "description": "Output predicate complemented"
    }
  },
  "required": [
    "kind",
    "subject",
    "predicate",
    "predicateComplemented"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://homepages.hass.rpi.edu/heuveb/Teaching/CriticalWisdom/Deduction.htm; https://www.stat.berkeley.edu/~stark/SticiGui/Text/categoricalLogic.htm
export const calculateObversionTransformer = (rawInput: unknown): ToolResult<ObversionTransformerOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly kind?: unknown; readonly subject?: unknown; readonly predicate?: unknown; readonly predicateComplemented?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "kind",
  "subject",
  "predicate",
  "predicateComplemented"
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
  const predicateComplementedValue = candidate.predicateComplemented;
  if (typeof predicateComplementedValue !== "boolean") return issue("predicateComplemented", "invalid_type", "Enter a boolean value.");

  const input: ObversionTransformerInput = { kind: kindValue, subject: subjectValue, predicate: predicateValue, predicateComplemented: predicateComplementedValue };
  const obverts = { A: "E", E: "A", I: "O", O: "I" } as const;
  return toolSuccess({ kind: obverts[input.kind], subject: input.subject, predicate: input.predicate, predicateComplemented: !input.predicateComplemented });
};
export const example = {
  input: {
    "kind": "A",
    "subject": "S",
    "predicate": "P",
    "predicateComplemented": false
  },
  output: {
    "kind": "E",
    "subject": "S",
    "predicate": "P",
    "predicateComplemented": true
  },
} satisfies ToolExample<ObversionTransformerInput, ObversionTransformerOutput>;
export const obversionTransformerTool = defineTool<ObversionTransformerInput, ObversionTransformerOutput>({
  id: "logic/obversion-transformer",
  title: "Obversion Immediate Inference Transformer (change quality + complement)",
  description: "Obvert a categorical proposition by changing its quality and complementing its predicate.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: obversionTransformerInputSchema,
  outputSchema: obversionTransformerOutputSchema,
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
      },
      {
        "id": "predicateComplemented",
        "label": "Input predicate complemented",
        "required": true,
        "valueType": {
          "type": "boolean"
        }
      }
    ],
    "outputs": [
      {
        "id": "kind",
        "label": "Obverted proposition kind",
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
        "id": "predicateComplemented",
        "label": "Output predicate complemented",
        "valueType": {
          "type": "boolean"
        }
      }
    ]
  },
  execute: calculateObversionTransformer,
});
export const runObversionTransformer = obversionTransformerTool.execute;
export default obversionTransformerTool;
