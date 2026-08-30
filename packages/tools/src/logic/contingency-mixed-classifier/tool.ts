import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { truthColumnSize } from "../tautology-all-true-checker/tool.js";
export type ContingencyMixedClassifierInput = {
  readonly values: ReadonlyArray<boolean>;
};
export type ContingencyMixedClassifierOutput = {
  readonly classification: "tautology" | "contradiction" | "contingency";
};
export const contingencyMixedClassifierInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "values": {
      "type": "array",
      "items": {
        "type": "boolean"
      },
      "minItems": 1,
      "maxItems": 4096,
      "description": "Complete truth column"
    }
  },
  "required": [
    "values"
  ]
} as const satisfies ToolJsonSchema;
export const contingencyMixedClassifierOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "classification": {
      "type": "string",
      "enum": [
        "tautology",
        "contradiction",
        "contingency"
      ],
      "description": "Logical classification"
    }
  },
  "required": [
    "classification"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://forallx.openlogicproject.org/html/Ch11.html; https://forallx.openlogicproject.org/html/Ch19.html
export const calculateContingencyMixedClassifier = (rawInput: unknown): ToolResult<ContingencyMixedClassifierOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly values?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "values"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const valuesValue = candidate.values;
  if (!Array.isArray(valuesValue)) return issue("values", "invalid_type", "Enter a dense array.");
  if (valuesValue.length < 1) return issue("values", "out_of_range", "Too few entries.");
  if (valuesValue.length > 4096) return issue("values", "resource_limit", "Array exceeds the 4096-entry resource limit.");
  const validatedValues: boolean[] = [];
  for (let index = 0; index < valuesValue.length; index++) {
    if (!Object.prototype.hasOwnProperty.call(valuesValue, index)) return issue(`values.${index}`, "invalid_type", "Sparse arrays are not supported.");
    const item: unknown = valuesValue[index];
    if (typeof item !== "boolean") return issue(`values.${index}`, "invalid_type", "Enter a boolean value.");
    validatedValues.push(item);
  }

  const input: ContingencyMixedClassifierInput = { values: validatedValues };
  if (!truthColumnSize(input.values.length)) return issue("values", "incomplete_table", "A complete truth column has a positive power-of-two row count.");
  return toolSuccess({ classification: input.values.every((value) => value) ? "tautology" : input.values.every((value) => !value) ? "contradiction" : "contingency" });
};
export const example = {
  input: {
    "values": [
      false,
      true
    ]
  },
  output: {
    "classification": "contingency"
  },
} satisfies ToolExample<ContingencyMixedClassifierInput, ContingencyMixedClassifierOutput>;
export const contingencyMixedClassifierTool = defineTool<ContingencyMixedClassifierInput, ContingencyMixedClassifierOutput>({
  id: "logic/contingency-mixed-classifier",
  title: "Contingency Mixed-Outcome Classifier",
  description: "Classify a complete ordered Boolean truth column as a tautology, contradiction, or contingency.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: contingencyMixedClassifierInputSchema,
  outputSchema: contingencyMixedClassifierOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "values",
        "label": "Complete truth column",
        "required": true,
        "valueType": {
          "type": "list",
          "items": {
            "type": "boolean"
          }
        }
      }
    ],
    "outputs": [
      {
        "id": "classification",
        "label": "Logical classification",
        "valueType": {
          "type": "string"
        }
      }
    ]
  },
  execute: calculateContingencyMixedClassifier,
});
export const runContingencyMixedClassifier = contingencyMixedClassifierTool.execute;
export default contingencyMixedClassifierTool;
