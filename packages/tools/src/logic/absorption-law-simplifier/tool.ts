import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type AbsorptionLawSimplifierInput = {
  readonly outerOperator: "and" | "or";
  readonly p: string;
  readonly q: string;
};
export type AbsorptionLawSimplifierOutput = {
  readonly original: string;
  readonly rewritten: string;
};
export const absorptionLawSimplifierInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "outerOperator": {
      "type": "string",
      "enum": [
        "and",
        "or"
      ],
      "description": "Outer Boolean operator"
    },
    "p": {
      "type": "string",
      "maxLength": 100,
      "pattern": "^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])",
      "description": "P"
    },
    "q": {
      "type": "string",
      "maxLength": 100,
      "pattern": "^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])",
      "description": "Q"
    }
  },
  "required": [
    "outerOperator",
    "p",
    "q"
  ]
} as const satisfies ToolJsonSchema;
export const absorptionLawSimplifierOutputSchema = {
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
export const calculateAbsorptionLawSimplifier = (rawInput: unknown): ToolResult<AbsorptionLawSimplifierOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly outerOperator?: unknown; readonly p?: unknown; readonly q?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "outerOperator",
  "p",
  "q"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const outerOperatorValue = candidate.outerOperator;
  if (typeof outerOperatorValue !== "string") return issue("outerOperator", "invalid_type", "Enter a string value.");
  if (outerOperatorValue !== "and" && outerOperatorValue !== "or") return issue("outerOperator", "invalid_value", "Choose a supported value.");
  const pValue = candidate.p;
  if (typeof pValue !== "string") return issue("p", "invalid_type", "Enter a string value.");
  if (pValue.length > 100) return issue("p", "resource_limit", "Text exceeds the 100-character resource limit.");
  if (!(new RegExp("^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])")).test(pValue)) return issue("p", "invalid_format", "Text does not match the accepted syntax.");
  const qValue = candidate.q;
  if (typeof qValue !== "string") return issue("q", "invalid_type", "Enter a string value.");
  if (qValue.length > 100) return issue("q", "resource_limit", "Text exceeds the 100-character resource limit.");
  if (!(new RegExp("^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])")).test(qValue)) return issue("q", "invalid_format", "Text does not match the accepted syntax.");

  const input: AbsorptionLawSimplifierInput = { outerOperator: outerOperatorValue, p: pValue, q: qValue };
  const outer = input.outerOperator === "and" ? "&&" : "||", inner = input.outerOperator === "and" ? "||" : "&&";
  return toolSuccess({ original: `(${input.p} ${outer} (${input.p} ${inner} ${input.q}))`, rewritten: input.p });
};
export const example = {
  input: {
    "outerOperator": "or",
    "p": "p",
    "q": "q"
  },
  output: {
    "original": "(p || (p && q))",
    "rewritten": "p"
  },
} satisfies ToolExample<AbsorptionLawSimplifierInput, AbsorptionLawSimplifierOutput>;
export const absorptionLawSimplifierTool = defineTool<AbsorptionLawSimplifierInput, AbsorptionLawSimplifierOutput>({
  id: "logic/absorption-law-simplifier",
  title: "Absorption Law Simplifier (P\u2228(P\u2227Q)=P)",
  description: "Simplify either classical absorption-law form for two identifier atoms.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: absorptionLawSimplifierInputSchema,
  outputSchema: absorptionLawSimplifierOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "outerOperator",
        "label": "Outer Boolean operator",
        "required": true,
        "valueType": {
          "type": "string"
        }
      },
      {
        "id": "p",
        "label": "P",
        "required": true,
        "valueType": {
          "type": "string"
        }
      },
      {
        "id": "q",
        "label": "Q",
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
  execute: calculateAbsorptionLawSimplifier,
});
export const runAbsorptionLawSimplifier = absorptionLawSimplifierTool.execute;
export default absorptionLawSimplifierTool;
