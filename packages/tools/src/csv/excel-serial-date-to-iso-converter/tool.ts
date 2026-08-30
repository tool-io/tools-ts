import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type ExcelSerialDateToIsoConverterInput = {
  readonly serial: number;
  readonly system: "1900" | "1904";
};
export type ExcelSerialDateToIsoConverterOutput = {
  readonly isoDate: string;
};
export const excelSerialDateToIsoConverterInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "serial": {
      "type": "integer",
      "minimum": 0,
      "maximum": 9007199254740991,
      "description": "Serial"
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
    "serial",
    "system"
  ]
} as const satisfies ToolJsonSchema;
export const excelSerialDateToIsoConverterOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "isoDate": {
      "type": "string",
      "description": "Iso date"
    }
  },
  "required": [
    "isoDate"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

export const isGregorianDate = (year: number, month: number, day: number): boolean => {
  if (!Number.isInteger(year) || year < 1 || year > 9999 || !Number.isInteger(month) || month < 1 || month > 12 || !Number.isInteger(day)) return false;
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1];
  return days !== undefined && day >= 1 && day <= days;
};
export const isoDateMillis = (text: string): number | undefined => {
  const match = /^([0-9]{4})-([0-9]{2})-([0-9]{2})$/.exec(text);
  if (match === null) return undefined;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (!isGregorianDate(year, month, day)) return undefined;
  const date = new Date(0);
  date.setUTCFullYear(year, month - 1, day);
  date.setUTCHours(0, 0, 0, 0);
  return date.getTime();
};

// Reference: https://support.microsoft.com/en-us/excel/date-systems-in-excel; https://learn.microsoft.com/en-us/troubleshoot/microsoft-365-apps/excel/wrongly-assumes-1900-is-leap-year
export const calculateExcelSerialDateToIsoConverter = (rawInput: unknown): ToolResult<ExcelSerialDateToIsoConverterOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly serial?: unknown; readonly system?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "serial",
  "system"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const serialValue = candidate.serial;
  if (typeof serialValue !== "number" || !Number.isSafeInteger(serialValue)) return issue("serial", "invalid_type", "Enter a finite safe integer.");
  if (serialValue < 0) return issue("serial", "out_of_range", "Value is outside the accepted range.");
  if (serialValue > 9007199254740991) return issue("serial", "out_of_range", "Value is outside the accepted range.");
  const systemValue = candidate.system;
  if (typeof systemValue !== "string") return issue("system", "invalid_type", "Enter a string value.");
  if (systemValue !== "1900" && systemValue !== "1904") return issue("system", "invalid_value", "Choose a supported value.");
  const input: ExcelSerialDateToIsoConverterInput = { serial: serialValue, system: systemValue };
  const minimum = input.system === "1900" ? 1 : 0;
  const maximum = input.system === "1900" ? 2958465 : 2957003;
  if (input.serial < minimum || input.serial > maximum) return issue("serial", "date_range", "Date must lie within this Excel system through year 9999.");
  if (input.system === "1900" && input.serial === 60) return issue("serial", "fictitious_date", "Serial 60 denotes the nonexistent Gregorian date 1900-02-29.");
  const epoch = input.system === "1900" ? Date.UTC(1899, 11, 31) : Date.UTC(1904, 0, 1);
  const days = input.serial - (input.system === "1900" && input.serial > 60 ? 1 : 0);
  return toolSuccess({ isoDate: new Date(epoch + days * 86400000).toISOString().slice(0, 10) });
};
export const example = {
  input: {
    "serial": 40729,
    "system": "1900"
  },
  output: {
    "isoDate": "2011-07-05"
  },
} satisfies ToolExample<ExcelSerialDateToIsoConverterInput, ExcelSerialDateToIsoConverterOutput>;
export const excelSerialDateToIsoConverterTool = defineTool<ExcelSerialDateToIsoConverterInput, ExcelSerialDateToIsoConverterOutput>({
  id: "csv/excel-serial-date-to-iso-converter",
  title: "Excel Serial Date to ISO Converter",
  description: "Convert integer Excel dates in an explicit 1900 or 1904 system to Gregorian ISO dates; reject the fictitious 1900-system day 60 and fractional time values.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: excelSerialDateToIsoConverterInputSchema,
  outputSchema: excelSerialDateToIsoConverterOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "serial",
        "label": "Serial",
        "required": true,
        "valueType": {
          "type": "integer"
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
        "id": "isoDate",
        "label": "Iso date",
        "valueType": {
          "type": "string"
        }
      }
    ]
  },
  execute: calculateExcelSerialDateToIsoConverter,
});
export const runExcelSerialDateToIsoConverter = excelSerialDateToIsoConverterTool.execute;
export default excelSerialDateToIsoConverterTool;
