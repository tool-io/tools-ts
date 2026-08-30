import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type ColgroupSpanCountCalculatorInput = {
  readonly hasGroupSpan: boolean;
  readonly groupSpan: number;
  readonly childSpans: ReadonlyArray<number>;
};
export type ColgroupSpanCountCalculatorOutput = {
  readonly columnCount: number;
  readonly groupSpanAllowed: boolean;
};
export const colgroupSpanCountCalculatorInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "hasGroupSpan": {
      "type": "boolean",
      "description": "Has Group Span"
    },
    "groupSpan": {
      "type": "integer",
      "minimum": 1,
      "maximum": 1000,
      "description": "Group Span"
    },
    "childSpans": {
      "type": "array",
      "items": {
        "type": "integer",
        "minimum": 1,
        "maximum": 1000
      },
      "minItems": 0,
      "maxItems": 10000,
      "description": "Child Spans"
    }
  },
  "required": [
    "hasGroupSpan",
    "groupSpan",
    "childSpans"
  ]
} as const satisfies ToolJsonSchema;
export const colgroupSpanCountCalculatorOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "columnCount": {
      "type": "integer",
      "minimum": 0,
      "maximum": 9007199254740991,
      "description": "Column Count"
    },
    "groupSpanAllowed": {
      "type": "boolean",
      "description": "Group Span Allowed"
    }
  },
  "required": [
    "columnCount",
    "groupSpanAllowed"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://html.spec.whatwg.org/multipage/tables.html#the-colgroup-element
export const calculateColgroupSpanCountCalculator = (rawInput: unknown): ToolResult<ColgroupSpanCountCalculatorOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly hasGroupSpan?: unknown; readonly groupSpan?: unknown; readonly childSpans?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "hasGroupSpan",
  "groupSpan",
  "childSpans"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const hasGroupSpanValue = candidate.hasGroupSpan;
if (typeof hasGroupSpanValue !== "boolean") return issue("hasGroupSpan", "invalid_type", "Enter a boolean value.");
const groupSpanValue = candidate.groupSpan;
if (typeof groupSpanValue !== "number" || !Number.isSafeInteger(groupSpanValue)) return issue("groupSpan", "invalid_type", "Enter a finite safe integer.");
if (groupSpanValue < 1) return issue("groupSpan", "out_of_range", "Value is outside the accepted range.");
if (groupSpanValue > 1000) return issue("groupSpan", "out_of_range", "Value is outside the accepted range.");
const childSpansValue = candidate.childSpans;
if (!Array.isArray(childSpansValue)) return issue("childSpans", "invalid_type", "Enter a dense array.");
if (childSpansValue.length < 0) return issue("childSpans", "out_of_range", "Too few entries.");
if (childSpansValue.length > 10000) return issue("childSpans", "resource_limit", "Array exceeds the 10000-entry resource limit.");
const validatedChildspans: number[] = [];
for (let index = 0; index < childSpansValue.length; index++) {
if (!Object.prototype.hasOwnProperty.call(childSpansValue, index)) return issue(`childSpans.${index}`, "invalid_type", "Sparse arrays are not supported.");
const item: unknown = childSpansValue[index];
if (typeof item !== "number" || !Number.isSafeInteger(item)) return issue(`childSpans.${index}`, "invalid_type", "Enter a finite safe integer.");
if (item < 1) return issue(`childSpans.${index}`, "out_of_range", "Value is outside the accepted range.");
if (item > 1000) return issue(`childSpans.${index}`, "out_of_range", "Value is outside the accepted range.");
validatedChildspans.push(item);
}
  const input: ColgroupSpanCountCalculatorInput = { hasGroupSpan: hasGroupSpanValue, groupSpan: groupSpanValue, childSpans: validatedChildspans };
 return toolSuccess({ columnCount: input.childSpans.length > 0 ? input.childSpans.reduce((sum, span) => sum + span, 0) : input.hasGroupSpan ? input.groupSpan : 1, groupSpanAllowed: input.childSpans.length === 0 });
};
export const example = {
  "input": {
    "hasGroupSpan": false,
    "groupSpan": 1,
    "childSpans": [
      2,
      3
    ]
  },
  "output": {
    "columnCount": 5,
    "groupSpanAllowed": false
  }
} satisfies ToolExample<ColgroupSpanCountCalculatorInput, ColgroupSpanCountCalculatorOutput>;
export const colgroupSpanCountCalculatorTool = defineTool<ColgroupSpanCountCalculatorInput, ColgroupSpanCountCalculatorOutput>({
  id: "html/colgroup-span-count-calculator",
  title: "colgroup span Count Calculator",
  description: "Counts colgroup columns from normalized positive spans (at most 1000 each). When col children exist their spans determine the count and a group span attribute is nonconforming.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: colgroupSpanCountCalculatorInputSchema,
  outputSchema: colgroupSpanCountCalculatorOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "hasGroupSpan",
        "label": "Has Group Span",
        "required": true,
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "groupSpan",
        "label": "Group Span",
        "required": true,
        "valueType": {
          "type": "integer"
        }
      },
      {
        "id": "childSpans",
        "label": "Child Spans",
        "required": true,
        "valueType": {
          "type": "list",
          "items": {
            "type": "integer"
          }
        }
      }
    ],
    "outputs": [
      {
        "id": "columnCount",
        "label": "Column Count",
        "valueType": {
          "type": "integer"
        }
      },
      {
        "id": "groupSpanAllowed",
        "label": "Group Span Allowed",
        "valueType": {
          "type": "boolean"
        }
      }
    ]
  },
  execute: calculateColgroupSpanCountCalculator,
});
export const runColgroupSpanCountCalculator = colgroupSpanCountCalculatorTool.execute;
export default colgroupSpanCountCalculatorTool;
