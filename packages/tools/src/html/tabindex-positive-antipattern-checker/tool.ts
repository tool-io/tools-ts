import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type TabindexPositiveAntipatternCheckerInput = {
  readonly tabindex: number;
};
export type TabindexPositiveAntipatternCheckerOutput = {
  readonly positiveOrdering: boolean;
  readonly requestsSequentialFocus: boolean;
  readonly requestsProgrammaticFocus: boolean;
};
export const tabindexPositiveAntipatternCheckerInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "tabindex": {
      "type": "integer",
      "minimum": -9007199254740991,
      "maximum": 9007199254740991,
      "description": "Tabindex"
    }
  },
  "required": [
    "tabindex"
  ]
} as const satisfies ToolJsonSchema;
export const tabindexPositiveAntipatternCheckerOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "positiveOrdering": {
      "type": "boolean",
      "description": "Positive Ordering"
    },
    "requestsSequentialFocus": {
      "type": "boolean",
      "description": "Requests Sequential Focus"
    },
    "requestsProgrammaticFocus": {
      "type": "boolean",
      "description": "Requests Programmatic Focus"
    }
  },
  "required": [
    "positiveOrdering",
    "requestsSequentialFocus",
    "requestsProgrammaticFocus"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://html.spec.whatwg.org/multipage/interaction.html#the-tabindex-attribute
export const calculateTabindexPositiveAntipatternChecker = (rawInput: unknown): ToolResult<TabindexPositiveAntipatternCheckerOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly tabindex?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "tabindex"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const tabindexValue = candidate.tabindex;
if (typeof tabindexValue !== "number" || !Number.isSafeInteger(tabindexValue)) return issue("tabindex", "invalid_type", "Enter a finite safe integer.");
if (tabindexValue < -9007199254740991) return issue("tabindex", "out_of_range", "Value is outside the accepted range.");
if (tabindexValue > 9007199254740991) return issue("tabindex", "out_of_range", "Value is outside the accepted range.");
  const input: TabindexPositiveAntipatternCheckerInput = { tabindex: tabindexValue };
 return toolSuccess({ positiveOrdering: input.tabindex > 0, requestsSequentialFocus: input.tabindex >= 0, requestsProgrammaticFocus: true });
};
export const example = {
  "input": {
    "tabindex": 3
  },
  "output": {
    "positiveOrdering": true,
    "requestsSequentialFocus": true,
    "requestsProgrammaticFocus": true
  }
} satisfies ToolExample<TabindexPositiveAntipatternCheckerInput, TabindexPositiveAntipatternCheckerOutput>;
export const tabindexPositiveAntipatternCheckerTool = defineTool<TabindexPositiveAntipatternCheckerInput, TabindexPositiveAntipatternCheckerOutput>({
  id: "html/tabindex-positive-antipattern-checker",
  title: "Positive tabindex Anti-Pattern Check",
  description: "Classifies an explicit parsed tabindex integer: positive values request an ordering priority, zero follows ordinary sequential order, negative requests exclusion from sequential navigation. Disabled, inert and browser focus preferences are outside this attribute-only check.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: tabindexPositiveAntipatternCheckerInputSchema,
  outputSchema: tabindexPositiveAntipatternCheckerOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "tabindex",
        "label": "Tabindex",
        "required": true,
        "valueType": {
          "type": "integer"
        }
      }
    ],
    "outputs": [
      {
        "id": "positiveOrdering",
        "label": "Positive Ordering",
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "requestsSequentialFocus",
        "label": "Requests Sequential Focus",
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "requestsProgrammaticFocus",
        "label": "Requests Programmatic Focus",
        "valueType": {
          "type": "boolean"
        }
      }
    ]
  },
  execute: calculateTabindexPositiveAntipatternChecker,
});
export const runTabindexPositiveAntipatternChecker = tabindexPositiveAntipatternCheckerTool.execute;
export default tabindexPositiveAntipatternCheckerTool;
