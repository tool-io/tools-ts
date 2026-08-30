import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type DeMorganOrToAndTransformerInput = {
  readonly p: string;
  readonly q: string;
};
export type DeMorganOrToAndTransformerOutput = {
  readonly original: string;
  readonly rewritten: string;
};
export const deMorganOrToAndTransformerInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
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
    "p",
    "q"
  ]
} as const satisfies ToolJsonSchema;
export const deMorganOrToAndTransformerOutputSchema = {
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
export const calculateDeMorganOrToAndTransformer = (rawInput: unknown): ToolResult<DeMorganOrToAndTransformerOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly p?: unknown; readonly q?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "p",
  "q"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const pValue = candidate.p;
  if (typeof pValue !== "string") return issue("p", "invalid_type", "Enter a string value.");
  if (pValue.length > 100) return issue("p", "resource_limit", "Text exceeds the 100-character resource limit.");
  if (!(new RegExp("^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])")).test(pValue)) return issue("p", "invalid_format", "Text does not match the accepted syntax.");
  const qValue = candidate.q;
  if (typeof qValue !== "string") return issue("q", "invalid_type", "Enter a string value.");
  if (qValue.length > 100) return issue("q", "resource_limit", "Text exceeds the 100-character resource limit.");
  if (!(new RegExp("^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])")).test(qValue)) return issue("q", "invalid_format", "Text does not match the accepted syntax.");

  const input: DeMorganOrToAndTransformerInput = { p: pValue, q: qValue };
  return toolSuccess({ original: `!(${input.p} || ${input.q})`, rewritten: `(!${input.p} && !${input.q})` });
};
export const example = {
  input: {
    "p": "p",
    "q": "q"
  },
  output: {
    "original": "!(p || q)",
    "rewritten": "(!p && !q)"
  },
} satisfies ToolExample<DeMorganOrToAndTransformerInput, DeMorganOrToAndTransformerOutput>;
export const deMorganOrToAndTransformerTool = defineTool<DeMorganOrToAndTransformerInput, DeMorganOrToAndTransformerOutput>({
  id: "logic/de-morgan-or-to-and-transformer",
  title: "De Morgan OR-to-AND Negation Transformer",
  description: "Rewrite a negated disjunction of two identifier atoms using ! for negation and && for conjunction.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: deMorganOrToAndTransformerInputSchema,
  outputSchema: deMorganOrToAndTransformerOutputSchema,
  ports: {
    "inputs": [
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
  execute: calculateDeMorganOrToAndTransformer,
});
export const runDeMorganOrToAndTransformer = deMorganOrToAndTransformerTool.execute;
export default deMorganOrToAndTransformerTool;
