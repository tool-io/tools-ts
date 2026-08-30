import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type XorDefinitionExpansionCheckerInput = {
  readonly p: boolean;
  readonly q: boolean;
};
export type XorDefinitionExpansionCheckerOutput = {
  readonly xor: boolean;
  readonly expanded: boolean;
};
export const xorDefinitionExpansionCheckerInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "p": {
      "type": "boolean",
      "description": "P"
    },
    "q": {
      "type": "boolean",
      "description": "Q"
    }
  },
  "required": [
    "p",
    "q"
  ]
} as const satisfies ToolJsonSchema;
export const xorDefinitionExpansionCheckerOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "xor": {
      "type": "boolean",
      "description": "Xor"
    },
    "expanded": {
      "type": "boolean",
      "description": "Expanded"
    }
  },
  "required": [
    "xor",
    "expanded"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://forallx.openlogicproject.org/html/Ch11.html; https://forallx.openlogicproject.org/html/Ch19.html
export const calculateXorDefinitionExpansionChecker = (rawInput: unknown): ToolResult<XorDefinitionExpansionCheckerOutput> => {
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
  if (typeof pValue !== "boolean") return issue("p", "invalid_type", "Enter a boolean value.");
  const qValue = candidate.q;
  if (typeof qValue !== "boolean") return issue("q", "invalid_type", "Enter a boolean value.");

  const input: XorDefinitionExpansionCheckerInput = { p: pValue, q: qValue };
  return toolSuccess({ xor: input.p !== input.q, expanded: (input.p || input.q) && !(input.p && input.q) });
};
export const example = {
  input: {
    "p": true,
    "q": false
  },
  output: {
    "xor": true,
    "expanded": true
  },
} satisfies ToolExample<XorDefinitionExpansionCheckerInput, XorDefinitionExpansionCheckerOutput>;
export const xorDefinitionExpansionCheckerTool = defineTool<XorDefinitionExpansionCheckerInput, XorDefinitionExpansionCheckerOutput>({
  id: "logic/xor-definition-expansion-checker",
  title: "XOR Definition Expansion (\u00acP\u2227Q)\u2228(P\u2227\u00acQ) Checker",
  description: "Evaluate XOR and its classical conjunction/disjunction expansion on two Boolean inputs.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: xorDefinitionExpansionCheckerInputSchema,
  outputSchema: xorDefinitionExpansionCheckerOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "p",
        "label": "P",
        "required": true,
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "q",
        "label": "Q",
        "required": true,
        "valueType": {
          "type": "boolean"
        }
      }
    ],
    "outputs": [
      {
        "id": "xor",
        "label": "Xor",
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "expanded",
        "label": "Expanded",
        "valueType": {
          "type": "boolean"
        }
      }
    ]
  },
  execute: calculateXorDefinitionExpansionChecker,
});
export const runXorDefinitionExpansionChecker = xorDefinitionExpansionCheckerTool.execute;
export default xorDefinitionExpansionCheckerTool;
