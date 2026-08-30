import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type KeyspaceSizeCalculatorInput = {
  readonly alphabetSize: number;
  readonly length: number;
};
export type KeyspaceSizeCalculatorOutput = {
  readonly keyspace: string;
};
export const keyspaceSizeCalculatorInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "alphabetSize": {
      "type": "integer",
      "minimum": 1,
      "maximum": 9007199254740991,
      "description": "Alphabet size"
    },
    "length": {
      "type": "integer",
      "minimum": 0,
      "maximum": 10000,
      "description": "Position count"
    }
  },
  "required": [
    "alphabetSize",
    "length"
  ]
} as const satisfies ToolJsonSchema;
export const keyspaceSizeCalculatorOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "keyspace": {
      "type": "string",
      "description": "Exact keyspace size"
    }
  },
  "required": [
    "keyspace"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://people.math.harvard.edu/~ctm/home/text/others/shannon/entropy/entropy.pdf
export const calculateKeyspaceSizeCalculator = (rawInput: unknown): ToolResult<KeyspaceSizeCalculatorOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly alphabetSize?: unknown; readonly length?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "alphabetSize",
  "length"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const alphabetSizeValue = candidate.alphabetSize;
if (typeof alphabetSizeValue !== "number" || !Number.isSafeInteger(alphabetSizeValue)) return issue("alphabetSize", "invalid_type", "Enter a finite safe integer.");
if (alphabetSizeValue < 1) return issue("alphabetSize", "out_of_range", "Value is outside the accepted range.");
if (alphabetSizeValue > 9007199254740991) return issue("alphabetSize", "out_of_range", "Value is outside the accepted range.");
const lengthValue = candidate.length;
if (typeof lengthValue !== "number" || !Number.isSafeInteger(lengthValue)) return issue("length", "invalid_type", "Enter a finite safe integer.");
if (lengthValue < 0) return issue("length", "out_of_range", "Value is outside the accepted range.");
if (lengthValue > 10000) return issue("length", "out_of_range", "Value is outside the accepted range.");
  const input: KeyspaceSizeCalculatorInput = { alphabetSize: alphabetSizeValue, length: lengthValue };
  return toolSuccess({ keyspace: (BigInt(input.alphabetSize) ** BigInt(input.length)).toString() });
};
export const example = {
  "input": {
    "alphabetSize": 10,
    "length": 4
  },
  "output": {
    "keyspace": "10000"
  }
} satisfies ToolExample<KeyspaceSizeCalculatorInput, KeyspaceSizeCalculatorOutput>;
export const keyspaceSizeCalculatorTool = defineTool<KeyspaceSizeCalculatorInput, KeyspaceSizeCalculatorOutput>({
  id: "cryptography/keyspace-size-calculator",
  title: "Keyspace Size Calculator",
  description: "Return the exact keyspace size for independent positions chosen from a fixed-size alphabet, with bounded output materialization.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: keyspaceSizeCalculatorInputSchema,
  outputSchema: keyspaceSizeCalculatorOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "alphabetSize",
        "label": "Alphabet size",
        "required": true,
        "valueType": {
          "type": "integer"
        }
      },
      {
        "id": "length",
        "label": "Position count",
        "required": true,
        "valueType": {
          "type": "integer"
        }
      }
    ],
    "outputs": [
      {
        "id": "keyspace",
        "label": "Exact keyspace size",
        "valueType": {
          "type": "string",
          "format": "integer-decimal"
        }
      }
    ]
  },
  execute: calculateKeyspaceSizeCalculator,
});
export const runKeyspaceSizeCalculator = keyspaceSizeCalculatorTool.execute;
export default keyspaceSizeCalculatorTool;
