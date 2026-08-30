import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type Latin1MojibakeSequenceDetectorInput = {
  readonly values: ReadonlyArray<string>;
};
export type Latin1MojibakeSequenceDetectorOutput = {
  readonly suspiciousIndices: ReadonlyArray<number>;
};
export const latin1MojibakeSequenceDetectorInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "values": {
      "type": "array",
      "items": {
        "type": "string",
        "maxLength": 10000
      },
      "minItems": 0,
      "maxItems": 10000,
      "description": "Values"
    }
  },
  "required": [
    "values"
  ]
} as const satisfies ToolJsonSchema;
export const latin1MojibakeSequenceDetectorOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "suspiciousIndices": {
      "type": "array",
      "items": {
        "type": "integer",
        "minimum": 0
      },
      "description": "Suspicious indices"
    }
  },
  "required": [
    "suspiciousIndices"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.rfc-editor.org/rfc/rfc3629.txt
export const calculateLatin1MojibakeSequenceDetector = (rawInput: unknown): ToolResult<Latin1MojibakeSequenceDetectorOutput> => {
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
  if (valuesValue.length < 0) return issue("values", "out_of_range", "Too few entries.");
  if (valuesValue.length > 10000) return issue("values", "resource_limit", "Array exceeds the 10000-entry resource limit.");
  const validatedValues: string[] = [];
  for (let index = 0; index < valuesValue.length; index++) {
    if (!Object.prototype.hasOwnProperty.call(valuesValue, index)) return issue(`values.${index}`, "invalid_type", "Sparse arrays are not supported.");
    const item: unknown = valuesValue[index];
    if (typeof item !== "string") return issue(`values.${index}`, "invalid_type", "Enter a string value.");
    if (item.length > 10000) return issue(`values.${index}`, "resource_limit", "Text exceeds the 10000-character resource limit.");
    validatedValues.push(item);
  }
  if (validatedValues.reduce((total, cell) => total + cell.length, 0) > 100000) return issue("values", "resource_limit", "Combined cell text exceeds 100,000 UTF-16 code units.");
  const input: Latin1MojibakeSequenceDetectorInput = { values: validatedValues };
  return toolSuccess({ suspiciousIndices: input.values.flatMap((value, index) => /[\u00c2\u00c3][\u0080-\u00bf]/.test(value) ? [index] : []) });
};
export const example = {
  input: {
    "values": [
      "cafÃ©",
      "café",
      "plain"
    ]
  },
  output: {
    "suspiciousIndices": [
      0
    ]
  },
} satisfies ToolExample<Latin1MojibakeSequenceDetectorInput, Latin1MojibakeSequenceDetectorOutput>;
export const latin1MojibakeSequenceDetectorTool = defineTool<Latin1MojibakeSequenceDetectorInput, Latin1MojibakeSequenceDetectorOutput>({
  id: "csv/latin1-mojibake-sequence-detector",
  title: "Latin-1 Mojibake Sequence Detector",
  description: "Flag a narrow mojibake heuristic: Latin-1 characters corresponding to UTF-8 C2/C3 lead bytes followed by an 80–BF continuation byte; this is evidence rather than encoding identification.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: latin1MojibakeSequenceDetectorInputSchema,
  outputSchema: latin1MojibakeSequenceDetectorOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "values",
        "label": "Values",
        "required": true,
        "valueType": {
          "type": "list",
          "items": {
            "type": "string"
          }
        }
      }
    ],
    "outputs": [
      {
        "id": "suspiciousIndices",
        "label": "Suspicious indices",
        "valueType": {
          "type": "list",
          "items": {
            "type": "integer"
          }
        }
      }
    ]
  },
  execute: calculateLatin1MojibakeSequenceDetector,
});
export const runLatin1MojibakeSequenceDetector = latin1MojibakeSequenceDetectorTool.execute;
export default latin1MojibakeSequenceDetectorTool;
