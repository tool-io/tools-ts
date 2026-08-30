import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type XnorEqualityDefinitionCheckerInput = {
  readonly p: boolean;
  readonly q: boolean;
};
export type XnorEqualityDefinitionCheckerOutput = {
  readonly xnor: boolean;
  readonly expanded: boolean;
};
export const xnorEqualityDefinitionCheckerInputSchema = {
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
export const xnorEqualityDefinitionCheckerOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "xnor": {
      "type": "boolean",
      "description": "Xnor"
    },
    "expanded": {
      "type": "boolean",
      "description": "Expanded"
    }
  },
  "required": [
    "xnor",
    "expanded"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://forallx.openlogicproject.org/html/Ch11.html; https://forallx.openlogicproject.org/html/Ch19.html
export const calculateXnorEqualityDefinitionChecker = (rawInput: unknown): ToolResult<XnorEqualityDefinitionCheckerOutput> => {
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

  const input: XnorEqualityDefinitionCheckerInput = { p: pValue, q: qValue };
  return toolSuccess({ xnor: input.p === input.q, expanded: (input.p && input.q) || (!input.p && !input.q) });
};
export const example = {
  input: {
    "p": true,
    "q": true
  },
  output: {
    "xnor": true,
    "expanded": true
  },
} satisfies ToolExample<XnorEqualityDefinitionCheckerInput, XnorEqualityDefinitionCheckerOutput>;
export const xnorEqualityDefinitionCheckerTool = defineTool<XnorEqualityDefinitionCheckerInput, XnorEqualityDefinitionCheckerOutput>({
  id: "logic/xnor-equality-definition-checker",
  title: "XNOR Equality Gate Definition Checker",
  description: "Evaluate XNOR equality and its classical matching-state expansion on two Boolean inputs.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: xnorEqualityDefinitionCheckerInputSchema,
  outputSchema: xnorEqualityDefinitionCheckerOutputSchema,
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
        "id": "xnor",
        "label": "Xnor",
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
  execute: calculateXnorEqualityDefinitionChecker,
});
export const runXnorEqualityDefinitionChecker = xnorEqualityDefinitionCheckerTool.execute;
export default xnorEqualityDefinitionCheckerTool;
