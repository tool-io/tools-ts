import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type DistributivityAndOverOrApplierInput = {
  readonly p: string;
  readonly q: string;
  readonly r: string;
};
export type DistributivityAndOverOrApplierOutput = {
  readonly original: string;
  readonly rewritten: string;
};
export const distributivityAndOverOrApplierInputSchema = {
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
    },
    "r": {
      "type": "string",
      "maxLength": 100,
      "pattern": "^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])",
      "description": "R"
    }
  },
  "required": [
    "p",
    "q",
    "r"
  ]
} as const satisfies ToolJsonSchema;
export const distributivityAndOverOrApplierOutputSchema = {
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
export const calculateDistributivityAndOverOrApplier = (rawInput: unknown): ToolResult<DistributivityAndOverOrApplierOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly p?: unknown; readonly q?: unknown; readonly r?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "p",
  "q",
  "r"
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
  const rValue = candidate.r;
  if (typeof rValue !== "string") return issue("r", "invalid_type", "Enter a string value.");
  if (rValue.length > 100) return issue("r", "resource_limit", "Text exceeds the 100-character resource limit.");
  if (!(new RegExp("^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])")).test(rValue)) return issue("r", "invalid_format", "Text does not match the accepted syntax.");

  const input: DistributivityAndOverOrApplierInput = { p: pValue, q: qValue, r: rValue };
  return toolSuccess({ original: `(${input.p} && (${input.q} || ${input.r}))`, rewritten: `((${input.p} && ${input.q}) || (${input.p} && ${input.r}))` });
};
export const example = {
  input: {
    "p": "p",
    "q": "q",
    "r": "r"
  },
  output: {
    "original": "(p && (q || r))",
    "rewritten": "((p && q) || (p && r))"
  },
} satisfies ToolExample<DistributivityAndOverOrApplierInput, DistributivityAndOverOrApplierOutput>;
export const distributivityAndOverOrApplierTool = defineTool<DistributivityAndOverOrApplierInput, DistributivityAndOverOrApplierOutput>({
  id: "logic/distributivity-and-over-or-applier",
  title: "Distributivity AND-over-OR Expansion Applier",
  description: "Distribute conjunction over disjunction for three identifier atoms.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: distributivityAndOverOrApplierInputSchema,
  outputSchema: distributivityAndOverOrApplierOutputSchema,
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
      },
      {
        "id": "r",
        "label": "R",
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
  execute: calculateDistributivityAndOverOrApplier,
});
export const runDistributivityAndOverOrApplier = distributivityAndOverOrApplierTool.execute;
export default distributivityAndOverOrApplierTool;
