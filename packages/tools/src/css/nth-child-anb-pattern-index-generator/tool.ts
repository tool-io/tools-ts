import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type NthChildAnbPatternIndexGeneratorInput = {
  readonly a: number;
  readonly b: number;
  readonly limit: number;
};
export type NthChildAnbPatternIndexGeneratorOutput = {
  readonly indices: ReadonlyArray<number>;
};
export const nthChildAnbPatternIndexGeneratorInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "a": {
      "type": "integer",
      "minimum": -9007199254740991,
      "maximum": 9007199254740991,
      "description": "A"
    },
    "b": {
      "type": "integer",
      "minimum": -9007199254740991,
      "maximum": 9007199254740991,
      "description": "B"
    },
    "limit": {
      "type": "integer",
      "minimum": 1,
      "maximum": 100000,
      "description": "Limit"
    }
  },
  "required": [
    "a",
    "b",
    "limit"
  ]
} as const satisfies ToolJsonSchema;
export const nthChildAnbPatternIndexGeneratorOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "indices": {
      "type": "array",
      "items": {
        "type": "integer",
        "minimum": 1
      },
      "description": "Indices"
    }
  },
  "required": [
    "indices"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.w3.org/TR/selectors-4/#the-nth-child-pseudo
export const calculateNthChildAnbPatternIndexGenerator = (rawInput: unknown): ToolResult<NthChildAnbPatternIndexGeneratorOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly a?: unknown; readonly b?: unknown; readonly limit?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "a",
  "b",
  "limit"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const aValue = candidate.a;
  if (typeof aValue !== "number" || !Number.isSafeInteger(aValue)) return issue("a", "invalid_type", "Enter a finite safe integer.");
  if (aValue < -9007199254740991) return issue("a", "out_of_range", "Value is outside the accepted range.");
  if (aValue > 9007199254740991) return issue("a", "out_of_range", "Value is outside the accepted range.");
  const bValue = candidate.b;
  if (typeof bValue !== "number" || !Number.isSafeInteger(bValue)) return issue("b", "invalid_type", "Enter a finite safe integer.");
  if (bValue < -9007199254740991) return issue("b", "out_of_range", "Value is outside the accepted range.");
  if (bValue > 9007199254740991) return issue("b", "out_of_range", "Value is outside the accepted range.");
  const limitValue = candidate.limit;
  if (typeof limitValue !== "number" || !Number.isSafeInteger(limitValue)) return issue("limit", "invalid_type", "Enter a finite safe integer.");
  if (limitValue < 1) return issue("limit", "out_of_range", "Value is outside the accepted range.");
  if (limitValue > 100000) return issue("limit", "out_of_range", "Value is outside the accepted range.");
  const input: NthChildAnbPatternIndexGeneratorInput = { a: aValue, b: bValue, limit: limitValue };
  const a = BigInt(input.a);
  const b = BigInt(input.b);
  const indices: number[] = [];
  for (let index = 1; index <= input.limit; index++) {
    const delta = BigInt(index) - b;
    if (a === 0n ? delta === 0n : delta % a === 0n && delta / a >= 0n) indices.push(index);
  }
  return toolSuccess({ indices });
};
export const example = {
  input: {
    "a": 2,
    "b": 1,
    "limit": 7
  },
  output: {
    "indices": [
      1,
      3,
      5,
      7
    ]
  },
} satisfies ToolExample<NthChildAnbPatternIndexGeneratorInput, NthChildAnbPatternIndexGeneratorOutput>;
export const nthChildAnbPatternIndexGeneratorTool = defineTool<NthChildAnbPatternIndexGeneratorInput, NthChildAnbPatternIndexGeneratorOutput>({
  id: "css/nth-child-anb-pattern-index-generator",
  title: ":nth-child an+b Pattern Index Generator",
  description: "List positive child indices up to a supplied bound matching a*n+b for integer n at least zero, supporting negative and zero a; exact integer arithmetic avoids overflow.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: nthChildAnbPatternIndexGeneratorInputSchema,
  outputSchema: nthChildAnbPatternIndexGeneratorOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "a",
        "label": "A",
        "required": true,
        "valueType": {
          "type": "integer"
        }
      },
      {
        "id": "b",
        "label": "B",
        "required": true,
        "valueType": {
          "type": "integer"
        }
      },
      {
        "id": "limit",
        "label": "Limit",
        "required": true,
        "valueType": {
          "type": "integer"
        }
      }
    ],
    "outputs": [
      {
        "id": "indices",
        "label": "Indices",
        "valueType": {
          "type": "list",
          "items": {
            "type": "integer"
          }
        }
      }
    ]
  },
  execute: calculateNthChildAnbPatternIndexGenerator,
});
export const runNthChildAnbPatternIndexGenerator = nthChildAnbPatternIndexGeneratorTool.execute;
export default nthChildAnbPatternIndexGeneratorTool;
