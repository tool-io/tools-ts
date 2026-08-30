import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type ConverseGeneratorValidityWarningInput = {
  readonly antecedent: string;
  readonly consequent: string;
};
export type ConverseGeneratorValidityWarningOutput = {
  readonly original: string;
  readonly converse: string;
  readonly equivalent: boolean;
};
export const converseGeneratorValidityWarningInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "antecedent": {
      "type": "string",
      "maxLength": 100,
      "pattern": "^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])",
      "description": "Antecedent"
    },
    "consequent": {
      "type": "string",
      "maxLength": 100,
      "pattern": "^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])",
      "description": "Consequent"
    }
  },
  "required": [
    "antecedent",
    "consequent"
  ]
} as const satisfies ToolJsonSchema;
export const converseGeneratorValidityWarningOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "original": {
      "type": "string",
      "description": "Original conditional"
    },
    "converse": {
      "type": "string",
      "description": "Converse conditional"
    },
    "equivalent": {
      "type": "boolean",
      "description": "Logically equivalent"
    }
  },
  "required": [
    "original",
    "converse",
    "equivalent"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://forallx.openlogicproject.org/html/Ch11.html; https://forallx.openlogicproject.org/html/Ch19.html
export const calculateConverseGeneratorValidityWarning = (rawInput: unknown): ToolResult<ConverseGeneratorValidityWarningOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly antecedent?: unknown; readonly consequent?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "antecedent",
  "consequent"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const antecedentValue = candidate.antecedent;
  if (typeof antecedentValue !== "string") return issue("antecedent", "invalid_type", "Enter a string value.");
  if (antecedentValue.length > 100) return issue("antecedent", "resource_limit", "Text exceeds the 100-character resource limit.");
  if (!(new RegExp("^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])")).test(antecedentValue)) return issue("antecedent", "invalid_format", "Text does not match the accepted syntax.");
  const consequentValue = candidate.consequent;
  if (typeof consequentValue !== "string") return issue("consequent", "invalid_type", "Enter a string value.");
  if (consequentValue.length > 100) return issue("consequent", "resource_limit", "Text exceeds the 100-character resource limit.");
  if (!(new RegExp("^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])")).test(consequentValue)) return issue("consequent", "invalid_format", "Text does not match the accepted syntax.");

  const input: ConverseGeneratorValidityWarningInput = { antecedent: antecedentValue, consequent: consequentValue };
  return toolSuccess({ original: `(${input.antecedent} -> ${input.consequent})`, converse: `(${input.consequent} -> ${input.antecedent})`, equivalent: input.antecedent === input.consequent });
};
export const example = {
  input: {
    "antecedent": "p",
    "consequent": "q"
  },
  output: {
    "original": "(p -> q)",
    "converse": "(q -> p)",
    "equivalent": false
  },
} satisfies ToolExample<ConverseGeneratorValidityWarningInput, ConverseGeneratorValidityWarningOutput>;
export const converseGeneratorValidityWarningTool = defineTool<ConverseGeneratorValidityWarningInput, ConverseGeneratorValidityWarningOutput>({
  id: "logic/converse-generator-validity-warning",
  title: "Converse Statement Generator with Validity Warning",
  description: "Generate a conditional converse and determine whether it is equivalent for the supplied identifier atoms.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: converseGeneratorValidityWarningInputSchema,
  outputSchema: converseGeneratorValidityWarningOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "antecedent",
        "label": "Antecedent",
        "required": true,
        "valueType": {
          "type": "string"
        }
      },
      {
        "id": "consequent",
        "label": "Consequent",
        "required": true,
        "valueType": {
          "type": "string"
        }
      }
    ],
    "outputs": [
      {
        "id": "original",
        "label": "Original conditional",
        "valueType": {
          "type": "string",
          "format": "propositional-formula"
        }
      },
      {
        "id": "converse",
        "label": "Converse conditional",
        "valueType": {
          "type": "string",
          "format": "propositional-formula"
        }
      },
      {
        "id": "equivalent",
        "label": "Logically equivalent",
        "valueType": {
          "type": "boolean"
        }
      }
    ]
  },
  execute: calculateConverseGeneratorValidityWarning,
});
export const runConverseGeneratorValidityWarning = converseGeneratorValidityWarningTool.execute;
export default converseGeneratorValidityWarningTool;
