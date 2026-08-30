import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type InvolutionCancelCheckerInput = {
  readonly atom: string;
  readonly negationCount: number;
};
export type InvolutionCancelCheckerOutput = {
  readonly simplified: string;
  readonly remainingNegations: number;
};
export const involutionCancelCheckerInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "atom": {
      "type": "string",
      "maxLength": 100,
      "pattern": "^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])",
      "description": "Identifier atom"
    },
    "negationCount": {
      "type": "integer",
      "minimum": 0,
      "maximum": 9007199254740991,
      "description": "Nested negation count"
    }
  },
  "required": [
    "atom",
    "negationCount"
  ]
} as const satisfies ToolJsonSchema;
export const involutionCancelCheckerOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "simplified": {
      "type": "string",
      "description": "Resulting propositional formula"
    },
    "remainingNegations": {
      "type": "integer",
      "minimum": 0,
      "maximum": 1,
      "description": "Remaining negation count"
    }
  },
  "required": [
    "simplified",
    "remainingNegations"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://forallx.openlogicproject.org/html/Ch11.html; https://forallx.openlogicproject.org/html/Ch19.html
export const calculateInvolutionCancelChecker = (rawInput: unknown): ToolResult<InvolutionCancelCheckerOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly atom?: unknown; readonly negationCount?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "atom",
  "negationCount"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const atomValue = candidate.atom;
  if (typeof atomValue !== "string") return issue("atom", "invalid_type", "Enter a string value.");
  if (atomValue.length > 100) return issue("atom", "resource_limit", "Text exceeds the 100-character resource limit.");
  if (!(new RegExp("^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])")).test(atomValue)) return issue("atom", "invalid_format", "Text does not match the accepted syntax.");
  const negationCountValue = candidate.negationCount;
  if (typeof negationCountValue !== "number" || !Number.isSafeInteger(negationCountValue)) return issue("negationCount", "invalid_type", "Enter a finite safe integer.");
  if (negationCountValue < 0) return issue("negationCount", "out_of_range", "Value is outside the accepted range.");
  if (negationCountValue > 9007199254740991) return issue("negationCount", "out_of_range", "Value is outside the accepted range.");

  const input: InvolutionCancelCheckerInput = { atom: atomValue, negationCount: negationCountValue };
  const remainingNegations = input.negationCount % 2;
  return toolSuccess({ simplified: `${remainingNegations === 1 ? "!" : ""}${input.atom}`, remainingNegations });
};
export const example = {
  input: {
    "atom": "p",
    "negationCount": 4
  },
  output: {
    "simplified": "p",
    "remainingNegations": 0
  },
} satisfies ToolExample<InvolutionCancelCheckerInput, InvolutionCancelCheckerOutput>;
export const involutionCancelCheckerTool = defineTool<InvolutionCancelCheckerInput, InvolutionCancelCheckerOutput>({
  id: "logic/involution-cancel-checker",
  title: "Involution Double Complement Cancel Checker",
  description: "Cancel pairs of nested negations around an identifier atom using classical involution.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: involutionCancelCheckerInputSchema,
  outputSchema: involutionCancelCheckerOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "atom",
        "label": "Identifier atom",
        "required": true,
        "valueType": {
          "type": "string"
        }
      },
      {
        "id": "negationCount",
        "label": "Nested negation count",
        "required": true,
        "valueType": {
          "type": "integer"
        }
      }
    ],
    "outputs": [
      {
        "id": "simplified",
        "label": "Resulting propositional formula",
        "valueType": {
          "type": "string",
          "format": "propositional-formula"
        }
      },
      {
        "id": "remainingNegations",
        "label": "Remaining negation count",
        "valueType": {
          "type": "integer"
        }
      }
    ]
  },
  execute: calculateInvolutionCancelChecker,
});
export const runInvolutionCancelChecker = involutionCancelCheckerTool.execute;
export default involutionCancelCheckerTool;
