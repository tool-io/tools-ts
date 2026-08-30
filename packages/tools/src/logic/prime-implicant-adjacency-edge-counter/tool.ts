import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type PrimeImplicantAdjacencyEdgeCounterInput = {
  readonly variableCount: number;
  readonly minterms: ReadonlyArray<number>;
};
export type PrimeImplicantAdjacencyEdgeCounterOutput = {
  readonly edgeCount: number;
};
export const primeImplicantAdjacencyEdgeCounterInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "variableCount": {
      "type": "integer",
      "minimum": 0,
      "maximum": 52,
      "description": "Variable count"
    },
    "minterms": {
      "type": "array",
      "items": {
        "type": "integer",
        "minimum": 0,
        "maximum": 9007199254740991
      },
      "minItems": 0,
      "maxItems": 10000,
      "description": "Distinct minterm indices"
    }
  },
  "required": [
    "variableCount",
    "minterms"
  ]
} as const satisfies ToolJsonSchema;
export const primeImplicantAdjacencyEdgeCounterOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "edgeCount": {
      "type": "integer",
      "minimum": 0,
      "maximum": 9007199254740991,
      "description": "Undirected adjacency edge count"
    }
  },
  "required": [
    "edgeCount"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://forallx.openlogicproject.org/html/Ch11.html; https://forallx.openlogicproject.org/html/Ch19.html
export const calculatePrimeImplicantAdjacencyEdgeCounter = (rawInput: unknown): ToolResult<PrimeImplicantAdjacencyEdgeCounterOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly variableCount?: unknown; readonly minterms?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "variableCount",
  "minterms"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const variableCountValue = candidate.variableCount;
  if (typeof variableCountValue !== "number" || !Number.isSafeInteger(variableCountValue)) return issue("variableCount", "invalid_type", "Enter a finite safe integer.");
  if (variableCountValue < 0) return issue("variableCount", "out_of_range", "Value is outside the accepted range.");
  if (variableCountValue > 52) return issue("variableCount", "out_of_range", "Value is outside the accepted range.");
  const mintermsValue = candidate.minterms;
  if (!Array.isArray(mintermsValue)) return issue("minterms", "invalid_type", "Enter a dense array.");
  if (mintermsValue.length < 0) return issue("minterms", "out_of_range", "Too few entries.");
  if (mintermsValue.length > 10000) return issue("minterms", "resource_limit", "Array exceeds the 10000-entry resource limit.");
  const validatedMinterms: number[] = [];
  for (let index = 0; index < mintermsValue.length; index++) {
    if (!Object.prototype.hasOwnProperty.call(mintermsValue, index)) return issue(`minterms.${index}`, "invalid_type", "Sparse arrays are not supported.");
    const item: unknown = mintermsValue[index];
    if (typeof item !== "number" || !Number.isSafeInteger(item)) return issue(`minterms.${index}`, "invalid_type", "Enter a finite safe integer.");
    if (item < 0) return issue(`minterms.${index}`, "out_of_range", "Value is outside the accepted range.");
    if (item > 9007199254740991) return issue(`minterms.${index}`, "out_of_range", "Value is outside the accepted range.");
    validatedMinterms.push(item);
  }

  const input: PrimeImplicantAdjacencyEdgeCounterInput = { variableCount: variableCountValue, minterms: validatedMinterms };
  const indices = new Set(input.minterms);
  if (indices.size !== input.minterms.length) return issue("minterms", "duplicate_index", "Minterm indices must be distinct.");
  for (let index = 0; index < input.minterms.length; index++) if ((input.minterms[index] ?? 0) >= 2 ** input.variableCount) return issue(`minterms.${index}`, "out_of_range", "Index exceeds the variable bit width.");
  let edgeCount = 0;
  for (const index of indices) for (let bit = 0; bit < input.variableCount; bit++) {
    const weight = 2 ** bit;
    const neighbor = Math.floor(index / weight) % 2 === 0 ? index + weight : index - weight;
    if (neighbor > index && indices.has(neighbor)) edgeCount++;
  }
  return toolSuccess({ edgeCount });
};
export const example = {
  input: {
    "variableCount": 2,
    "minterms": [
      0,
      1,
      2,
      3
    ]
  },
  output: {
    "edgeCount": 4
  },
} satisfies ToolExample<PrimeImplicantAdjacencyEdgeCounterInput, PrimeImplicantAdjacencyEdgeCounterOutput>;
export const primeImplicantAdjacencyEdgeCounterTool = defineTool<PrimeImplicantAdjacencyEdgeCounterInput, PrimeImplicantAdjacencyEdgeCounterOutput>({
  id: "logic/prime-implicant-adjacency-edge-counter",
  title: "Prime Implicant Pair Adjacency Edge Counter",
  description: "Count adjacency edges among supplied binary minterm indices differing in exactly one bit.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: primeImplicantAdjacencyEdgeCounterInputSchema,
  outputSchema: primeImplicantAdjacencyEdgeCounterOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "variableCount",
        "label": "Variable count",
        "required": true,
        "valueType": {
          "type": "integer"
        }
      },
      {
        "id": "minterms",
        "label": "Distinct minterm indices",
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
        "id": "edgeCount",
        "label": "Undirected adjacency edge count",
        "valueType": {
          "type": "integer"
        }
      }
    ]
  },
  execute: calculatePrimeImplicantAdjacencyEdgeCounter,
});
export const runPrimeImplicantAdjacencyEdgeCounter = primeImplicantAdjacencyEdgeCounterTool.execute;
export default primeImplicantAdjacencyEdgeCounterTool;
