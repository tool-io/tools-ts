import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type HypotheticalSyllogismValidatorInput = {
  readonly firstAntecedent: string;
  readonly firstConsequent: string;
  readonly secondAntecedent: string;
  readonly secondConsequent: string;
  readonly conclusionAntecedent: string;
  readonly conclusionConsequent: string;
};
export type HypotheticalSyllogismValidatorOutput = {
  readonly matchesRule: boolean;
};
export const hypotheticalSyllogismValidatorInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "firstAntecedent": {
      "type": "string",
      "maxLength": 100,
      "pattern": "^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])",
      "description": "First Antecedent"
    },
    "firstConsequent": {
      "type": "string",
      "maxLength": 100,
      "pattern": "^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])",
      "description": "First Consequent"
    },
    "secondAntecedent": {
      "type": "string",
      "maxLength": 100,
      "pattern": "^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])",
      "description": "Second Antecedent"
    },
    "secondConsequent": {
      "type": "string",
      "maxLength": 100,
      "pattern": "^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])",
      "description": "Second Consequent"
    },
    "conclusionAntecedent": {
      "type": "string",
      "maxLength": 100,
      "pattern": "^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])",
      "description": "Conclusion Antecedent"
    },
    "conclusionConsequent": {
      "type": "string",
      "maxLength": 100,
      "pattern": "^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])",
      "description": "Conclusion Consequent"
    }
  },
  "required": [
    "firstAntecedent",
    "firstConsequent",
    "secondAntecedent",
    "secondConsequent",
    "conclusionAntecedent",
    "conclusionConsequent"
  ]
} as const satisfies ToolJsonSchema;
export const hypotheticalSyllogismValidatorOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "matchesRule": {
      "type": "boolean",
      "description": "Matches Rule"
    }
  },
  "required": [
    "matchesRule"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://forallx.openlogicproject.org/html/Ch11.html; https://forallx.openlogicproject.org/html/Ch19.html
export const calculateHypotheticalSyllogismValidator = (rawInput: unknown): ToolResult<HypotheticalSyllogismValidatorOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly firstAntecedent?: unknown; readonly firstConsequent?: unknown; readonly secondAntecedent?: unknown; readonly secondConsequent?: unknown; readonly conclusionAntecedent?: unknown; readonly conclusionConsequent?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "firstAntecedent",
  "firstConsequent",
  "secondAntecedent",
  "secondConsequent",
  "conclusionAntecedent",
  "conclusionConsequent"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const firstAntecedentValue = candidate.firstAntecedent;
  if (typeof firstAntecedentValue !== "string") return issue("firstAntecedent", "invalid_type", "Enter a string value.");
  if (firstAntecedentValue.length > 100) return issue("firstAntecedent", "resource_limit", "Text exceeds the 100-character resource limit.");
  if (!(new RegExp("^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])")).test(firstAntecedentValue)) return issue("firstAntecedent", "invalid_format", "Text does not match the accepted syntax.");
  const firstConsequentValue = candidate.firstConsequent;
  if (typeof firstConsequentValue !== "string") return issue("firstConsequent", "invalid_type", "Enter a string value.");
  if (firstConsequentValue.length > 100) return issue("firstConsequent", "resource_limit", "Text exceeds the 100-character resource limit.");
  if (!(new RegExp("^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])")).test(firstConsequentValue)) return issue("firstConsequent", "invalid_format", "Text does not match the accepted syntax.");
  const secondAntecedentValue = candidate.secondAntecedent;
  if (typeof secondAntecedentValue !== "string") return issue("secondAntecedent", "invalid_type", "Enter a string value.");
  if (secondAntecedentValue.length > 100) return issue("secondAntecedent", "resource_limit", "Text exceeds the 100-character resource limit.");
  if (!(new RegExp("^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])")).test(secondAntecedentValue)) return issue("secondAntecedent", "invalid_format", "Text does not match the accepted syntax.");
  const secondConsequentValue = candidate.secondConsequent;
  if (typeof secondConsequentValue !== "string") return issue("secondConsequent", "invalid_type", "Enter a string value.");
  if (secondConsequentValue.length > 100) return issue("secondConsequent", "resource_limit", "Text exceeds the 100-character resource limit.");
  if (!(new RegExp("^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])")).test(secondConsequentValue)) return issue("secondConsequent", "invalid_format", "Text does not match the accepted syntax.");
  const conclusionAntecedentValue = candidate.conclusionAntecedent;
  if (typeof conclusionAntecedentValue !== "string") return issue("conclusionAntecedent", "invalid_type", "Enter a string value.");
  if (conclusionAntecedentValue.length > 100) return issue("conclusionAntecedent", "resource_limit", "Text exceeds the 100-character resource limit.");
  if (!(new RegExp("^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])")).test(conclusionAntecedentValue)) return issue("conclusionAntecedent", "invalid_format", "Text does not match the accepted syntax.");
  const conclusionConsequentValue = candidate.conclusionConsequent;
  if (typeof conclusionConsequentValue !== "string") return issue("conclusionConsequent", "invalid_type", "Enter a string value.");
  if (conclusionConsequentValue.length > 100) return issue("conclusionConsequent", "resource_limit", "Text exceeds the 100-character resource limit.");
  if (!(new RegExp("^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])")).test(conclusionConsequentValue)) return issue("conclusionConsequent", "invalid_format", "Text does not match the accepted syntax.");

  const input: HypotheticalSyllogismValidatorInput = { firstAntecedent: firstAntecedentValue, firstConsequent: firstConsequentValue, secondAntecedent: secondAntecedentValue, secondConsequent: secondConsequentValue, conclusionAntecedent: conclusionAntecedentValue, conclusionConsequent: conclusionConsequentValue };
  return toolSuccess({ matchesRule: input.firstConsequent === input.secondAntecedent && input.conclusionAntecedent === input.firstAntecedent && input.conclusionConsequent === input.secondConsequent });
};
export const example = {
  input: {
    "firstAntecedent": "p",
    "firstConsequent": "q",
    "secondAntecedent": "q",
    "secondConsequent": "r",
    "conclusionAntecedent": "p",
    "conclusionConsequent": "r"
  },
  output: {
    "matchesRule": true
  },
} satisfies ToolExample<HypotheticalSyllogismValidatorInput, HypotheticalSyllogismValidatorOutput>;
export const hypotheticalSyllogismValidatorTool = defineTool<HypotheticalSyllogismValidatorInput, HypotheticalSyllogismValidatorOutput>({
  id: "logic/hypothetical-syllogism-validator",
  title: "Hypothetical Syllogism Chain Validator (P\u2192Q, Q\u2192R \u22a2 P\u2192R)",
  description: "Validate a hypothetical syllogism by matching two conditional links and the claimed endpoint conditional.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: hypotheticalSyllogismValidatorInputSchema,
  outputSchema: hypotheticalSyllogismValidatorOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "firstAntecedent",
        "label": "First Antecedent",
        "required": true,
        "valueType": {
          "type": "string"
        }
      },
      {
        "id": "firstConsequent",
        "label": "First Consequent",
        "required": true,
        "valueType": {
          "type": "string"
        }
      },
      {
        "id": "secondAntecedent",
        "label": "Second Antecedent",
        "required": true,
        "valueType": {
          "type": "string"
        }
      },
      {
        "id": "secondConsequent",
        "label": "Second Consequent",
        "required": true,
        "valueType": {
          "type": "string"
        }
      },
      {
        "id": "conclusionAntecedent",
        "label": "Conclusion Antecedent",
        "required": true,
        "valueType": {
          "type": "string"
        }
      },
      {
        "id": "conclusionConsequent",
        "label": "Conclusion Consequent",
        "required": true,
        "valueType": {
          "type": "string"
        }
      }
    ],
    "outputs": [
      {
        "id": "matchesRule",
        "label": "Matches Rule",
        "valueType": {
          "type": "boolean"
        }
      }
    ]
  },
  execute: calculateHypotheticalSyllogismValidator,
});
export const runHypotheticalSyllogismValidator = hypotheticalSyllogismValidatorTool.execute;
export default hypotheticalSyllogismValidatorTool;
