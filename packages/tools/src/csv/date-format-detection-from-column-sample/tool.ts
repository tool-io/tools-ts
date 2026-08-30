import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { isoDateMillis, isGregorianDate } from "../excel-serial-date-to-iso-converter/tool.js";
export type DateFormatDetectionFromColumnSampleInput = {
  readonly values: ReadonlyArray<string>;
};
export type DateFormatDetectionFromColumnSampleOutput = {
  readonly formats: ReadonlyArray<string>;
  readonly ambiguous: boolean;
  readonly observedCount: number;
};
export const dateFormatDetectionFromColumnSampleInputSchema = {
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
export const dateFormatDetectionFromColumnSampleOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "formats": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Formats"
    },
    "ambiguous": {
      "type": "boolean",
      "description": "Ambiguous"
    },
    "observedCount": {
      "type": "integer",
      "minimum": 0,
      "maximum": 9007199254740991,
      "description": "Observed count"
    }
  },
  "required": [
    "formats",
    "ambiguous",
    "observedCount"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.rfc-editor.org/rfc/rfc3339
export const calculateDateFormatDetectionFromColumnSample = (rawInput: unknown): ToolResult<DateFormatDetectionFromColumnSampleOutput> => {
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
  const input: DateFormatDetectionFromColumnSampleInput = { values: validatedValues };
  const observed = input.values.map((value) => value.trim()).filter((value) => value !== "");
  const formats = observed.length === 0 ? [] : ["YYYY-MM-DD", "MM/DD/YYYY", "DD/MM/YYYY"].filter((format) => observed.every((value) => {
    if (format === "YYYY-MM-DD") return isoDateMillis(value) !== undefined;
    const match = /^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/.exec(value);
    if (match === null) return false;
    const first = Number(match[1]);
    const second = Number(match[2]);
    return isGregorianDate(Number(match[3]), format === "MM/DD/YYYY" ? first : second, format === "MM/DD/YYYY" ? second : first);
  }));
  return toolSuccess({ formats, ambiguous: formats.length !== 1, observedCount: observed.length });
};
export const example = {
  input: {
    "values": [
      "31/12/2024",
      "29/02/2024"
    ]
  },
  output: {
    "formats": [
      "DD/MM/YYYY"
    ],
    "ambiguous": false,
    "observedCount": 2
  },
} satisfies ToolExample<DateFormatDetectionFromColumnSampleInput, DateFormatDetectionFromColumnSampleOutput>;
export const dateFormatDetectionFromColumnSampleTool = defineTool<DateFormatDetectionFromColumnSampleInput, DateFormatDetectionFromColumnSampleOutput>({
  id: "csv/date-format-detection-from-column-sample",
  title: "Date Format Detection From Column Sample",
  description: "List Gregorian ISO YYYY-MM-DD, MM/DD/YYYY, and DD/MM/YYYY formats compatible with every nonblank sampled cell; ambiguous day/month order is retained.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: dateFormatDetectionFromColumnSampleInputSchema,
  outputSchema: dateFormatDetectionFromColumnSampleOutputSchema,
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
        "id": "formats",
        "label": "Formats",
        "valueType": {
          "type": "list",
          "items": {
            "type": "string"
          }
        }
      },
      {
        "id": "ambiguous",
        "label": "Ambiguous",
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "observedCount",
        "label": "Observed count",
        "valueType": {
          "type": "integer"
        }
      }
    ]
  },
  execute: calculateDateFormatDetectionFromColumnSample,
});
export const runDateFormatDetectionFromColumnSample = dateFormatDetectionFromColumnSampleTool.execute;
export default dateFormatDetectionFromColumnSampleTool;
