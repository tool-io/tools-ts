import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type NthChildZebraOddEvenClassifierInput = {
  readonly index: number;
};
export type NthChildZebraOddEvenClassifierOutput = {
  readonly matchesOdd: boolean;
  readonly matchesEven: boolean;
};
export const nthChildZebraOddEvenClassifierInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "index": {
      "type": "integer",
      "minimum": 1,
      "maximum": 9007199254740991,
      "description": "One-based child index"
    }
  },
  "required": [
    "index"
  ]
} as const satisfies ToolJsonSchema;
export const nthChildZebraOddEvenClassifierOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "matchesOdd": {
      "type": "boolean",
      "description": "Matches odd"
    },
    "matchesEven": {
      "type": "boolean",
      "description": "Matches even"
    }
  },
  "required": [
    "matchesOdd",
    "matchesEven"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.w3.org/TR/selectors-4/#the-nth-child-pseudo
export const calculateNthChildZebraOddEvenClassifier = (rawInput: unknown): ToolResult<NthChildZebraOddEvenClassifierOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly index?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "index"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const indexValue = candidate.index;
  if (typeof indexValue !== "number" || !Number.isSafeInteger(indexValue)) return issue("index", "invalid_type", "Enter a finite safe integer.");
  if (indexValue < 1) return issue("index", "out_of_range", "Value is outside the accepted range.");
  if (indexValue > 9007199254740991) return issue("index", "out_of_range", "Value is outside the accepted range.");

  const input: NthChildZebraOddEvenClassifierInput = { index: indexValue };
  return toolSuccess({ matchesOdd: input.index % 2 === 1, matchesEven: input.index % 2 === 0 });
};
export const example = {
  input: {
    "index": 3
  },
  output: {
    "matchesOdd": true,
    "matchesEven": false
  },
} satisfies ToolExample<NthChildZebraOddEvenClassifierInput, NthChildZebraOddEvenClassifierOutput>;
export const nthChildZebraOddEvenClassifierTool = defineTool<NthChildZebraOddEvenClassifierInput, NthChildZebraOddEvenClassifierOutput>({
  id: "css/nth-child-zebra-odd-even-classifier",
  title: ":nth-child Zebra Odd/Even Classifier",
  description: "Classify a one-based child index for the odd and even nth-child selectors.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: nthChildZebraOddEvenClassifierInputSchema,
  outputSchema: nthChildZebraOddEvenClassifierOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "index",
        "label": "One-based child index",
        "required": true,
        "valueType": {
          "type": "integer"
        }
      }
    ],
    "outputs": [
      {
        "id": "matchesOdd",
        "label": "Matches odd",
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "matchesEven",
        "label": "Matches even",
        "valueType": {
          "type": "boolean"
        }
      }
    ]
  },
  execute: calculateNthChildZebraOddEvenClassifier,
});
export const runNthChildZebraOddEvenClassifier = nthChildZebraOddEvenClassifierTool.execute;
export default nthChildZebraOddEvenClassifierTool;
