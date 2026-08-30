import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type RemRootConsistencyCheckerInput = {
  readonly rootSize: number;
  readonly remValue: number;
  readonly observedPixels: number;
  readonly tolerance: number;
};
export type RemRootConsistencyCheckerOutput = {
  readonly expectedPixels: number;
  readonly consistent: boolean;
};
export const remRootConsistencyCheckerInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "rootSize": {
      "type": "number",
      "minimum": 0,
      "description": "Root font size"
    },
    "remValue": {
      "type": "number",
      "minimum": 0,
      "description": "Length in rem"
    },
    "observedPixels": {
      "type": "number",
      "minimum": 0,
      "description": "Observed pixel length"
    },
    "tolerance": {
      "type": "number",
      "minimum": 0,
      "description": "Absolute pixel tolerance"
    }
  },
  "required": [
    "rootSize",
    "remValue",
    "observedPixels",
    "tolerance"
  ]
} as const satisfies ToolJsonSchema;
export const remRootConsistencyCheckerOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "expectedPixels": {
      "type": "number",
      "minimum": 0,
      "description": "Expected pixel length"
    },
    "consistent": {
      "type": "boolean",
      "description": "Within tolerance"
    }
  },
  "required": [
    "expectedPixels",
    "consistent"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.w3.org/TR/css-values-3/#font-relative-lengths
export const calculateRemRootConsistencyChecker = (rawInput: unknown): ToolResult<RemRootConsistencyCheckerOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly rootSize?: unknown; readonly remValue?: unknown; readonly observedPixels?: unknown; readonly tolerance?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "rootSize",
  "remValue",
  "observedPixels",
  "tolerance"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const rootSizeValue = candidate.rootSize;
  if (typeof rootSizeValue !== "number" || !Number.isFinite(rootSizeValue)) return issue("rootSize", "invalid_type", "Enter a finite number.");
  if (rootSizeValue < 0) return issue("rootSize", "out_of_range", "Value is outside the accepted range.");
  const remValueValue = candidate.remValue;
  if (typeof remValueValue !== "number" || !Number.isFinite(remValueValue)) return issue("remValue", "invalid_type", "Enter a finite number.");
  if (remValueValue < 0) return issue("remValue", "out_of_range", "Value is outside the accepted range.");
  const observedPixelsValue = candidate.observedPixels;
  if (typeof observedPixelsValue !== "number" || !Number.isFinite(observedPixelsValue)) return issue("observedPixels", "invalid_type", "Enter a finite number.");
  if (observedPixelsValue < 0) return issue("observedPixels", "out_of_range", "Value is outside the accepted range.");
  const toleranceValue = candidate.tolerance;
  if (typeof toleranceValue !== "number" || !Number.isFinite(toleranceValue)) return issue("tolerance", "invalid_type", "Enter a finite number.");
  if (toleranceValue < 0) return issue("tolerance", "out_of_range", "Value is outside the accepted range.");

  const input: RemRootConsistencyCheckerInput = { rootSize: rootSizeValue, remValue: remValueValue, observedPixels: observedPixelsValue, tolerance: toleranceValue };
  const expectedPixels = input.rootSize * input.remValue;
  if (!Number.isFinite(expectedPixels)) return issue("remValue", "numeric_overflow", "The resolved length exceeds finite number range.");
  return toolSuccess({ expectedPixels: expectedPixels === 0 ? 0 : expectedPixels, consistent: Math.abs(expectedPixels - input.observedPixels) <= input.tolerance });
};
export const example = {
  input: {
    "rootSize": 16,
    "remValue": 2,
    "observedPixels": 32,
    "tolerance": 0
  },
  output: {
    "expectedPixels": 32,
    "consistent": true
  },
} satisfies ToolExample<RemRootConsistencyCheckerInput, RemRootConsistencyCheckerOutput>;
export const remRootConsistencyCheckerTool = defineTool<RemRootConsistencyCheckerInput, RemRootConsistencyCheckerOutput>({
  id: "css/rem-root-consistency-checker",
  title: "rem Root Consistency Checker",
  description: "Resolve a nonnegative rem length against the root font size and compare it with a supplied computed pixel length.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: remRootConsistencyCheckerInputSchema,
  outputSchema: remRootConsistencyCheckerOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "rootSize",
        "label": "Root font size",
        "required": true,
        "valueType": {
          "type": "number",
          "unit": "px"
        }
      },
      {
        "id": "remValue",
        "label": "Length in rem",
        "required": true,
        "valueType": {
          "type": "number",
          "unit": "rem"
        }
      },
      {
        "id": "observedPixels",
        "label": "Observed pixel length",
        "required": true,
        "valueType": {
          "type": "number",
          "unit": "px"
        }
      },
      {
        "id": "tolerance",
        "label": "Absolute pixel tolerance",
        "required": true,
        "valueType": {
          "type": "number",
          "unit": "px"
        }
      }
    ],
    "outputs": [
      {
        "id": "expectedPixels",
        "label": "Expected pixel length",
        "valueType": {
          "type": "number",
          "unit": "px"
        }
      },
      {
        "id": "consistent",
        "label": "Within tolerance",
        "valueType": {
          "type": "boolean"
        }
      }
    ]
  },
  execute: calculateRemRootConsistencyChecker,
});
export const runRemRootConsistencyChecker = remRootConsistencyCheckerTool.execute;
export default remRootConsistencyCheckerTool;
