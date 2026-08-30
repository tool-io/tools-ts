import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type UnixTimestampColumnToIsoDatetimeInput = {
  readonly values: ReadonlyArray<string>;
  readonly unit: "seconds" | "milliseconds";
};
export type UnixTimestampColumnToIsoDatetimeOutput = {
  readonly isoDatetimes: ReadonlyArray<string>;
};
export const unixTimestampColumnToIsoDatetimeInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "values": {
      "type": "array",
      "items": {
        "type": "string",
        "maxLength": 30
      },
      "minItems": 0,
      "maxItems": 10000,
      "description": "Values"
    },
    "unit": {
      "type": "string",
      "enum": [
        "seconds",
        "milliseconds"
      ],
      "description": "Unit"
    }
  },
  "required": [
    "values",
    "unit"
  ]
} as const satisfies ToolJsonSchema;
export const unixTimestampColumnToIsoDatetimeOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "isoDatetimes": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Iso datetimes"
    }
  },
  "required": [
    "isoDatetimes"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-date-objects
export const calculateUnixTimestampColumnToIsoDatetime = (rawInput: unknown): ToolResult<UnixTimestampColumnToIsoDatetimeOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly values?: unknown; readonly unit?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "values",
  "unit"
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
    if (item.length > 30) return issue(`values.${index}`, "resource_limit", "Text exceeds the 30-character resource limit.");
    validatedValues.push(item);
  }
  const unitValue = candidate.unit;
  if (typeof unitValue !== "string") return issue("unit", "invalid_type", "Enter a string value.");
  if (unitValue !== "seconds" && unitValue !== "milliseconds") return issue("unit", "invalid_value", "Choose a supported value.");
  if (validatedValues.reduce((total, cell) => total + cell.length, 0) > 100000) return issue("values", "resource_limit", "Combined cell text exceeds 100,000 UTF-16 code units.");
  const input: UnixTimestampColumnToIsoDatetimeInput = { values: validatedValues, unit: unitValue };
  const isoDatetimes: string[] = [];
  for (const [index, cell] of input.values.entries()) {
    const text = cell.trim();
    if (!/^[+-]?[0-9]+$/.test(text)) return issue(`values.${index}`, "invalid_timestamp", "Enter an integer Unix timestamp.");
    const millis = BigInt(text) * (input.unit === "seconds" ? 1000n : 1n);
    if (millis < -62135596800000n || millis > 253402300799999n) return issue(`values.${index}`, "date_range", "Timestamp must lie in years 0001 through 9999.");
    isoDatetimes.push(new Date(Number(millis)).toISOString());
  }
  return toolSuccess({ isoDatetimes });
};
export const example = {
  input: {
    "values": [
      "0",
      "1704067200"
    ],
    "unit": "seconds"
  },
  output: {
    "isoDatetimes": [
      "1970-01-01T00:00:00.000Z",
      "2024-01-01T00:00:00.000Z"
    ]
  },
} satisfies ToolExample<UnixTimestampColumnToIsoDatetimeInput, UnixTimestampColumnToIsoDatetimeOutput>;
export const unixTimestampColumnToIsoDatetimeTool = defineTool<UnixTimestampColumnToIsoDatetimeInput, UnixTimestampColumnToIsoDatetimeOutput>({
  id: "csv/unix-timestamp-column-to-iso-datetime",
  title: "Unix Timestamp Column to ISO Datetime",
  description: "Convert integer Unix timestamp cells in explicit seconds or milliseconds to UTC ISO datetimes with millisecond precision, limited to years 0001 through 9999.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: unixTimestampColumnToIsoDatetimeInputSchema,
  outputSchema: unixTimestampColumnToIsoDatetimeOutputSchema,
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
      },
      {
        "id": "unit",
        "label": "Unit",
        "required": true,
        "valueType": {
          "type": "string"
        }
      }
    ],
    "outputs": [
      {
        "id": "isoDatetimes",
        "label": "Iso datetimes",
        "valueType": {
          "type": "list",
          "items": {
            "type": "string"
          }
        }
      }
    ]
  },
  execute: calculateUnixTimestampColumnToIsoDatetime,
});
export const runUnixTimestampColumnToIsoDatetime = unixTimestampColumnToIsoDatetimeTool.execute;
export default unixTimestampColumnToIsoDatetimeTool;
