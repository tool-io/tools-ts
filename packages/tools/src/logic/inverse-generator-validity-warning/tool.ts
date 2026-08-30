import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type InverseGeneratorValidityWarningInput = {
  readonly antecedent: string;
  readonly consequent: string;
};
export type InverseGeneratorValidityWarningOutput = {
  readonly original: string;
  readonly inverse: string;
  readonly equivalent: boolean;
};
export const inverseGeneratorValidityWarningInputSchema = {
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
export const inverseGeneratorValidityWarningOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "original": {
      "type": "string",
      "description": "Original conditional"
    },
    "inverse": {
      "type": "string",
      "description": "Inverse conditional"
    },
    "equivalent": {
      "type": "boolean",
      "description": "Logically equivalent"
    }
  },
  "required": [
    "original",
    "inverse",
    "equivalent"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://forallx.openlogicproject.org/html/Ch11.html; https://forallx.openlogicproject.org/html/Ch19.html
export const calculateInverseGeneratorValidityWarning = (rawInput: unknown): ToolResult<InverseGeneratorValidityWarningOutput> => {
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

  const input: InverseGeneratorValidityWarningInput = { antecedent: antecedentValue, consequent: consequentValue };
  return toolSuccess({ original: `(${input.antecedent} -> ${input.consequent})`, inverse: `(!${input.antecedent} -> !${input.consequent})`, equivalent: input.antecedent === input.consequent });
};
export const example = {
  input: {
    "antecedent": "p",
    "consequent": "q"
  },
  output: {
    "original": "(p -> q)",
    "inverse": "(!p -> !q)",
    "equivalent": false
  },
} satisfies ToolExample<InverseGeneratorValidityWarningInput, InverseGeneratorValidityWarningOutput>;
export const inverseGeneratorValidityWarningTool = defineTool<InverseGeneratorValidityWarningInput, InverseGeneratorValidityWarningOutput>({
  id: "logic/inverse-generator-validity-warning",
  title: "Inverse Statement Generator with Validity Warning",
  description: "Generate a conditional inverse and determine whether it is equivalent for the supplied identifier atoms.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: inverseGeneratorValidityWarningInputSchema,
  outputSchema: inverseGeneratorValidityWarningOutputSchema,
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
        "id": "inverse",
        "label": "Inverse conditional",
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
  execute: calculateInverseGeneratorValidityWarning,
});
export const runInverseGeneratorValidityWarning = inverseGeneratorValidityWarningTool.execute;
export default inverseGeneratorValidityWarningTool;
