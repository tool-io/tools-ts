import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { isoDateMillis } from "../excel-serial-date-to-iso-converter/tool.js";
export type IsoDateToExcelSerialExportInput = {
  readonly isoDate: string;
  readonly system: "1900" | "1904";
};
export type IsoDateToExcelSerialExportOutput = {
  readonly serial: number;
};
export const isoDateToExcelSerialExportInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "isoDate": {
      "type": "string",
      "maxLength": 10,
      "description": "Iso date"
    },
    "system": {
      "type": "string",
      "enum": [
        "1900",
        "1904"
      ],
      "description": "System"
    }
  },
  "required": [
    "isoDate",
    "system"
  ]
} as const satisfies ToolJsonSchema;
export const isoDateToExcelSerialExportOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "serial": {
      "type": "integer",
      "minimum": 0,
      "maximum": 9007199254740991,
      "description": "Serial"
    }
  },
  "required": [
    "serial"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://support.microsoft.com/en-us/excel/date-systems-in-excel
export const calculateIsoDateToExcelSerialExport = (rawInput: unknown): ToolResult<IsoDateToExcelSerialExportOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly isoDate?: unknown; readonly system?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "isoDate",
  "system"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const isoDateValue = candidate.isoDate;
  if (typeof isoDateValue !== "string") return issue("isoDate", "invalid_type", "Enter a string value.");
  if (isoDateValue.length > 10) return issue("isoDate", "resource_limit", "Text exceeds the 10-character resource limit.");
  const systemValue = candidate.system;
  if (typeof systemValue !== "string") return issue("system", "invalid_type", "Enter a string value.");
  if (systemValue !== "1900" && systemValue !== "1904") return issue("system", "invalid_value", "Choose a supported value.");
  const input: IsoDateToExcelSerialExportInput = { isoDate: isoDateValue, system: systemValue };
  const millis = isoDateMillis(input.isoDate);
  if (millis === undefined) return issue("isoDate", "invalid_date", "Enter a real Gregorian date in YYYY-MM-DD form.");
  const epoch = input.system === "1900" ? Date.UTC(1899, 11, 31) : Date.UTC(1904, 0, 1);
  let serial = (millis - epoch) / 86400000;
  if (input.system === "1900" && millis >= Date.UTC(1900, 2, 1)) serial++;
  if (serial < (input.system === "1900" ? 1 : 0)) return issue("isoDate", "date_range", "Date precedes the start of the selected Excel system.");
  return toolSuccess({ serial });
};
export const example = {
  input: {
    "isoDate": "2011-07-05",
    "system": "1900"
  },
  output: {
    "serial": 40729
  },
} satisfies ToolExample<IsoDateToExcelSerialExportInput, IsoDateToExcelSerialExportOutput>;
export const isoDateToExcelSerialExportTool = defineTool<IsoDateToExcelSerialExportInput, IsoDateToExcelSerialExportOutput>({
  id: "csv/iso-date-to-excel-serial-export",
  title: "ISO Date to Excel Serial Export",
  description: "Convert a valid Gregorian YYYY-MM-DD date to an integer Excel serial in an explicit 1900 or 1904 system, including Excel’s inserted 1900 leap-bug offset.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: isoDateToExcelSerialExportInputSchema,
  outputSchema: isoDateToExcelSerialExportOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "isoDate",
        "label": "Iso date",
        "required": true,
        "valueType": {
          "type": "string"
        }
      },
      {
        "id": "system",
        "label": "System",
        "required": true,
        "valueType": {
          "type": "string"
        }
      }
    ],
    "outputs": [
      {
        "id": "serial",
        "label": "Serial",
        "valueType": {
          "type": "integer"
        }
      }
    ]
  },
  execute: calculateIsoDateToExcelSerialExport,
});
export const runIsoDateToExcelSerialExport = isoDateToExcelSerialExportTool.execute;
export default isoDateToExcelSerialExportTool;
