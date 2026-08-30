import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type IndexOfCoincidenceCalculatorInput = {
  readonly text: string;
};
export type IndexOfCoincidenceCalculatorOutput = {
  readonly index: number;
  readonly letterCount: number;
};
export const indexOfCoincidenceCalculatorInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "text": {
      "type": "string",
      "maxLength": 100000,
      "description": "Text sample"
    }
  },
  "required": [
    "text"
  ]
} as const satisfies ToolJsonSchema;
export const indexOfCoincidenceCalculatorOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "index": {
      "type": "number",
      "minimum": 0,
      "maximum": 1,
      "description": "Index of coincidence"
    },
    "letterCount": {
      "type": "integer",
      "minimum": 0,
      "maximum": 9007199254740991,
      "description": "ASCII letter count"
    }
  },
  "required": [
    "index",
    "letterCount"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.nsa.gov/portals/75/documents/news-features/declassified-documents/friedman-documents/publications/folder_233/41761039080018.pdf
export const calculateIndexOfCoincidenceCalculator = (rawInput: unknown): ToolResult<IndexOfCoincidenceCalculatorOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly text?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "text"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const textValue = candidate.text;
if (typeof textValue !== "string") return issue("text", "invalid_type", "Enter a string value.");
if (textValue.length > 100000) return issue("text", "resource_limit", "Text exceeds the 100000-character resource limit.");
  const input: IndexOfCoincidenceCalculatorInput = { text: textValue };
  const letters = (input.text.match(/[A-Za-z]/g) ?? []).map(letter => letter.toUpperCase());
  if (letters.length < 2) return issue("text", "insufficient_letters", "At least two ASCII letters are required.");
  const counts = new Map<string, number>();
  for (const letter of letters) counts.set(letter, (counts.get(letter) ?? 0) + 1);
  const numerator = [...counts.values()].reduce((sum, count) => sum + count * (count - 1), 0);
  return toolSuccess({ index: numerator / (letters.length * (letters.length - 1)), letterCount: letters.length });
};
export const example = {
  "input": {
    "text": "AABA"
  },
  "output": {
    "index": 0.5,
    "letterCount": 4
  }
} satisfies ToolExample<IndexOfCoincidenceCalculatorInput, IndexOfCoincidenceCalculatorOutput>;
export const indexOfCoincidenceCalculatorTool = defineTool<IndexOfCoincidenceCalculatorInput, IndexOfCoincidenceCalculatorOutput>({
  id: "cryptography/index-of-coincidence-calculator",
  title: "Index of Coincidence Calculator",
  description: "Calculate the probability that two letters drawn without replacement match, using only ASCII A\u2013Z letters from the supplied text.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: indexOfCoincidenceCalculatorInputSchema,
  outputSchema: indexOfCoincidenceCalculatorOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "text",
        "label": "Text sample",
        "required": true,
        "valueType": {
          "type": "string"
        }
      }
    ],
    "outputs": [
      {
        "id": "index",
        "label": "Index of coincidence",
        "valueType": {
          "type": "number"
        }
      },
      {
        "id": "letterCount",
        "label": "ASCII letter count",
        "valueType": {
          "type": "integer"
        }
      }
    ]
  },
  execute: calculateIndexOfCoincidenceCalculator,
});
export const runIndexOfCoincidenceCalculator = indexOfCoincidenceCalculatorTool.execute;
export default indexOfCoincidenceCalculatorTool;
