import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type ContrapositiveFormGeneratorInput = {
  readonly antecedent: string;
  readonly consequent: string;
};
export type ContrapositiveFormGeneratorOutput = {
  readonly original: string;
  readonly rewritten: string;
};
export const contrapositiveFormGeneratorInputSchema = {
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
export const contrapositiveFormGeneratorOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "original": {
      "type": "string",
      "description": "Original propositional formula"
    },
    "rewritten": {
      "type": "string",
      "description": "Equivalent propositional formula"
    }
  },
  "required": [
    "original",
    "rewritten"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://forallx.openlogicproject.org/html/Ch11.html; https://forallx.openlogicproject.org/html/Ch19.html
export const calculateContrapositiveFormGenerator = (rawInput: unknown): ToolResult<ContrapositiveFormGeneratorOutput> => {
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

  const input: ContrapositiveFormGeneratorInput = { antecedent: antecedentValue, consequent: consequentValue };
  return toolSuccess({ original: `(${input.antecedent} -> ${input.consequent})`, rewritten: `(!${input.consequent} -> !${input.antecedent})` });
};
export const example = {
  input: {
    "antecedent": "p",
    "consequent": "q"
  },
  output: {
    "original": "(p -> q)",
    "rewritten": "(!q -> !p)"
  },
} satisfies ToolExample<ContrapositiveFormGeneratorInput, ContrapositiveFormGeneratorOutput>;
export const contrapositiveFormGeneratorTool = defineTool<ContrapositiveFormGeneratorInput, ContrapositiveFormGeneratorOutput>({
  id: "logic/contrapositive-form-generator",
  title: "Contrapositive Form Generator (P\u2192Q \u2261 \u00acQ\u2192\u00acP)",
  description: "Generate the equivalent contrapositive of a conditional between identifier atoms.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: contrapositiveFormGeneratorInputSchema,
  outputSchema: contrapositiveFormGeneratorOutputSchema,
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
        "label": "Original propositional formula",
        "valueType": {
          "type": "string",
          "format": "propositional-formula"
        }
      },
      {
        "id": "rewritten",
        "label": "Equivalent propositional formula",
        "valueType": {
          "type": "string",
          "format": "propositional-formula"
        }
      }
    ]
  },
  execute: calculateContrapositiveFormGenerator,
});
export const runContrapositiveFormGenerator = contrapositiveFormGeneratorTool.execute;
export default contrapositiveFormGeneratorTool;
