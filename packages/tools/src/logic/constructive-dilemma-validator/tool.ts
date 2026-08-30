import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type ConstructiveDilemmaValidatorInput = {
  readonly firstAntecedent: string;
  readonly firstConsequent: string;
  readonly secondAntecedent: string;
  readonly secondConsequent: string;
  readonly premiseLeft: string;
  readonly premiseRight: string;
  readonly conclusionLeft: string;
  readonly conclusionRight: string;
};
export type ConstructiveDilemmaValidatorOutput = {
  readonly matchesRule: boolean;
};
export const constructiveDilemmaValidatorInputSchema = {
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
    "premiseLeft": {
      "type": "string",
      "maxLength": 100,
      "pattern": "^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])",
      "description": "Premise Left"
    },
    "premiseRight": {
      "type": "string",
      "maxLength": 100,
      "pattern": "^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])",
      "description": "Premise Right"
    },
    "conclusionLeft": {
      "type": "string",
      "maxLength": 100,
      "pattern": "^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])",
      "description": "Conclusion Left"
    },
    "conclusionRight": {
      "type": "string",
      "maxLength": 100,
      "pattern": "^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])",
      "description": "Conclusion Right"
    }
  },
  "required": [
    "firstAntecedent",
    "firstConsequent",
    "secondAntecedent",
    "secondConsequent",
    "premiseLeft",
    "premiseRight",
    "conclusionLeft",
    "conclusionRight"
  ]
} as const satisfies ToolJsonSchema;
export const constructiveDilemmaValidatorOutputSchema = {
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
export const calculateConstructiveDilemmaValidator = (rawInput: unknown): ToolResult<ConstructiveDilemmaValidatorOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly firstAntecedent?: unknown; readonly firstConsequent?: unknown; readonly secondAntecedent?: unknown; readonly secondConsequent?: unknown; readonly premiseLeft?: unknown; readonly premiseRight?: unknown; readonly conclusionLeft?: unknown; readonly conclusionRight?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "firstAntecedent",
  "firstConsequent",
  "secondAntecedent",
  "secondConsequent",
  "premiseLeft",
  "premiseRight",
  "conclusionLeft",
  "conclusionRight"
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
  const premiseLeftValue = candidate.premiseLeft;
  if (typeof premiseLeftValue !== "string") return issue("premiseLeft", "invalid_type", "Enter a string value.");
  if (premiseLeftValue.length > 100) return issue("premiseLeft", "resource_limit", "Text exceeds the 100-character resource limit.");
  if (!(new RegExp("^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])")).test(premiseLeftValue)) return issue("premiseLeft", "invalid_format", "Text does not match the accepted syntax.");
  const premiseRightValue = candidate.premiseRight;
  if (typeof premiseRightValue !== "string") return issue("premiseRight", "invalid_type", "Enter a string value.");
  if (premiseRightValue.length > 100) return issue("premiseRight", "resource_limit", "Text exceeds the 100-character resource limit.");
  if (!(new RegExp("^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])")).test(premiseRightValue)) return issue("premiseRight", "invalid_format", "Text does not match the accepted syntax.");
  const conclusionLeftValue = candidate.conclusionLeft;
  if (typeof conclusionLeftValue !== "string") return issue("conclusionLeft", "invalid_type", "Enter a string value.");
  if (conclusionLeftValue.length > 100) return issue("conclusionLeft", "resource_limit", "Text exceeds the 100-character resource limit.");
  if (!(new RegExp("^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])")).test(conclusionLeftValue)) return issue("conclusionLeft", "invalid_format", "Text does not match the accepted syntax.");
  const conclusionRightValue = candidate.conclusionRight;
  if (typeof conclusionRightValue !== "string") return issue("conclusionRight", "invalid_type", "Enter a string value.");
  if (conclusionRightValue.length > 100) return issue("conclusionRight", "resource_limit", "Text exceeds the 100-character resource limit.");
  if (!(new RegExp("^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])")).test(conclusionRightValue)) return issue("conclusionRight", "invalid_format", "Text does not match the accepted syntax.");

  const input: ConstructiveDilemmaValidatorInput = { firstAntecedent: firstAntecedentValue, firstConsequent: firstConsequentValue, secondAntecedent: secondAntecedentValue, secondConsequent: secondConsequentValue, premiseLeft: premiseLeftValue, premiseRight: premiseRightValue, conclusionLeft: conclusionLeftValue, conclusionRight: conclusionRightValue };
  const premiseMatches = (input.premiseLeft === input.firstAntecedent && input.premiseRight === input.secondAntecedent) || (input.premiseRight === input.firstAntecedent && input.premiseLeft === input.secondAntecedent);
  const conclusionMatches = (input.conclusionLeft === input.firstConsequent && input.conclusionRight === input.secondConsequent) || (input.conclusionRight === input.firstConsequent && input.conclusionLeft === input.secondConsequent);
  return toolSuccess({ matchesRule: premiseMatches && conclusionMatches });
};
export const example = {
  input: {
    "firstAntecedent": "p",
    "firstConsequent": "q",
    "secondAntecedent": "r",
    "secondConsequent": "s",
    "premiseLeft": "p",
    "premiseRight": "r",
    "conclusionLeft": "q",
    "conclusionRight": "s"
  },
  output: {
    "matchesRule": true
  },
} satisfies ToolExample<ConstructiveDilemmaValidatorInput, ConstructiveDilemmaValidatorOutput>;
export const constructiveDilemmaValidatorTool = defineTool<ConstructiveDilemmaValidatorInput, ConstructiveDilemmaValidatorOutput>({
  id: "logic/constructive-dilemma-validator",
  title: "Constructive Dilemma Step Validator",
  description: "Validate constructive dilemma by matching two conditionals, the disjunction of antecedents, and the disjunction of consequents.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: constructiveDilemmaValidatorInputSchema,
  outputSchema: constructiveDilemmaValidatorOutputSchema,
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
        "id": "premiseLeft",
        "label": "Premise Left",
        "required": true,
        "valueType": {
          "type": "string"
        }
      },
      {
        "id": "premiseRight",
        "label": "Premise Right",
        "required": true,
        "valueType": {
          "type": "string"
        }
      },
      {
        "id": "conclusionLeft",
        "label": "Conclusion Left",
        "required": true,
        "valueType": {
          "type": "string"
        }
      },
      {
        "id": "conclusionRight",
        "label": "Conclusion Right",
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
  execute: calculateConstructiveDilemmaValidator,
});
export const runConstructiveDilemmaValidator = constructiveDilemmaValidatorTool.execute;
export default constructiveDilemmaValidatorTool;
