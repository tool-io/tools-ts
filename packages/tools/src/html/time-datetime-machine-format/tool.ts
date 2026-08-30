import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type TimeDatetimeMachineFormatInput = {
  readonly mode: "date" | "local-datetime" | "global-datetime";
  readonly year: number;
  readonly month: number;
  readonly day: number;
  readonly hour: number;
  readonly minute: number;
  readonly second: number;
  readonly millisecond: number;
  readonly offsetMinutes: number;
};
export type TimeDatetimeMachineFormatOutput = {
  readonly datetime: string;
};
export const timeDatetimeMachineFormatInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "mode": {
      "type": "string",
      "enum": [
        "date",
        "local-datetime",
        "global-datetime"
      ],
      "description": "Mode"
    },
    "year": {
      "type": "integer",
      "minimum": 1,
      "maximum": 999999,
      "description": "Year"
    },
    "month": {
      "type": "integer",
      "minimum": 1,
      "maximum": 12,
      "description": "Month"
    },
    "day": {
      "type": "integer",
      "minimum": 1,
      "maximum": 31,
      "description": "Day"
    },
    "hour": {
      "type": "integer",
      "minimum": 0,
      "maximum": 23,
      "description": "Hour"
    },
    "minute": {
      "type": "integer",
      "minimum": 0,
      "maximum": 59,
      "description": "Minute"
    },
    "second": {
      "type": "integer",
      "minimum": 0,
      "maximum": 59,
      "description": "Second"
    },
    "millisecond": {
      "type": "integer",
      "minimum": 0,
      "maximum": 999,
      "description": "Millisecond"
    },
    "offsetMinutes": {
      "type": "integer",
      "minimum": -1439,
      "maximum": 1439,
      "description": "Offset Minutes"
    }
  },
  "required": [
    "mode",
    "year",
    "month",
    "day",
    "hour",
    "minute",
    "second",
    "millisecond",
    "offsetMinutes"
  ]
} as const satisfies ToolJsonSchema;
export const timeDatetimeMachineFormatOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "datetime": {
      "type": "string",
      "description": "Datetime"
    }
  },
  "required": [
    "datetime"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-time-element; https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#dates-and-times
export const calculateTimeDatetimeMachineFormat = (rawInput: unknown): ToolResult<TimeDatetimeMachineFormatOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly mode?: unknown; readonly year?: unknown; readonly month?: unknown; readonly day?: unknown; readonly hour?: unknown; readonly minute?: unknown; readonly second?: unknown; readonly millisecond?: unknown; readonly offsetMinutes?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "mode",
  "year",
  "month",
  "day",
  "hour",
  "minute",
  "second",
  "millisecond",
  "offsetMinutes"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const modeValue = candidate.mode;
if (typeof modeValue !== "string") return issue("mode", "invalid_type", "Enter a string value.");
if (modeValue !== "date" && modeValue !== "local-datetime" && modeValue !== "global-datetime") return issue("mode", "invalid_value", "Choose a supported value.");
const yearValue = candidate.year;
if (typeof yearValue !== "number" || !Number.isSafeInteger(yearValue)) return issue("year", "invalid_type", "Enter a finite safe integer.");
if (yearValue < 1) return issue("year", "out_of_range", "Value is outside the accepted range.");
if (yearValue > 999999) return issue("year", "out_of_range", "Value is outside the accepted range.");
const monthValue = candidate.month;
if (typeof monthValue !== "number" || !Number.isSafeInteger(monthValue)) return issue("month", "invalid_type", "Enter a finite safe integer.");
if (monthValue < 1) return issue("month", "out_of_range", "Value is outside the accepted range.");
if (monthValue > 12) return issue("month", "out_of_range", "Value is outside the accepted range.");
const dayValue = candidate.day;
if (typeof dayValue !== "number" || !Number.isSafeInteger(dayValue)) return issue("day", "invalid_type", "Enter a finite safe integer.");
if (dayValue < 1) return issue("day", "out_of_range", "Value is outside the accepted range.");
if (dayValue > 31) return issue("day", "out_of_range", "Value is outside the accepted range.");
const hourValue = candidate.hour;
if (typeof hourValue !== "number" || !Number.isSafeInteger(hourValue)) return issue("hour", "invalid_type", "Enter a finite safe integer.");
if (hourValue < 0) return issue("hour", "out_of_range", "Value is outside the accepted range.");
if (hourValue > 23) return issue("hour", "out_of_range", "Value is outside the accepted range.");
const minuteValue = candidate.minute;
if (typeof minuteValue !== "number" || !Number.isSafeInteger(minuteValue)) return issue("minute", "invalid_type", "Enter a finite safe integer.");
if (minuteValue < 0) return issue("minute", "out_of_range", "Value is outside the accepted range.");
if (minuteValue > 59) return issue("minute", "out_of_range", "Value is outside the accepted range.");
const secondValue = candidate.second;
if (typeof secondValue !== "number" || !Number.isSafeInteger(secondValue)) return issue("second", "invalid_type", "Enter a finite safe integer.");
if (secondValue < 0) return issue("second", "out_of_range", "Value is outside the accepted range.");
if (secondValue > 59) return issue("second", "out_of_range", "Value is outside the accepted range.");
const millisecondValue = candidate.millisecond;
if (typeof millisecondValue !== "number" || !Number.isSafeInteger(millisecondValue)) return issue("millisecond", "invalid_type", "Enter a finite safe integer.");
if (millisecondValue < 0) return issue("millisecond", "out_of_range", "Value is outside the accepted range.");
if (millisecondValue > 999) return issue("millisecond", "out_of_range", "Value is outside the accepted range.");
const offsetMinutesValue = candidate.offsetMinutes;
if (typeof offsetMinutesValue !== "number" || !Number.isSafeInteger(offsetMinutesValue)) return issue("offsetMinutes", "invalid_type", "Enter a finite safe integer.");
if (offsetMinutesValue < -1439) return issue("offsetMinutes", "out_of_range", "Value is outside the accepted range.");
if (offsetMinutesValue > 1439) return issue("offsetMinutes", "out_of_range", "Value is outside the accepted range.");
  const input: TimeDatetimeMachineFormatInput = { mode: modeValue, year: yearValue, month: monthValue, day: dayValue, hour: hourValue, minute: minuteValue, second: secondValue, millisecond: millisecondValue, offsetMinutes: offsetMinutesValue };
 const leap = input.year % 4 === 0 && (input.year % 100 !== 0 || input.year % 400 === 0);
 const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][input.month - 1];
 if (days === undefined || input.day > days) return issue("day", "invalid_date", "Day does not exist in this Gregorian month.");
 const pad = (value: number, width = 2): string => value.toString().padStart(width, "0");
 let datetime = `${pad(input.year, 4)}-${pad(input.month)}-${pad(input.day)}`;
 if (input.mode !== "date") {
   datetime += `T${pad(input.hour)}:${pad(input.minute)}:${pad(input.second)}`;
   if (input.millisecond > 0) datetime += `.${pad(input.millisecond, 3).replace(/0+$/, "")}`;
   if (input.mode === "global-datetime") {
     const offset = Math.abs(input.offsetMinutes);
     datetime += offset === 0 ? "Z" : `${input.offsetMinutes < 0 ? "-" : "+"}${pad(Math.floor(offset / 60))}:${pad(offset % 60)}`;
   }
 }
 return toolSuccess({ datetime });
};
export const example = {
  "input": {
    "mode": "global-datetime",
    "year": 2024,
    "month": 2,
    "day": 29,
    "hour": 14,
    "minute": 5,
    "second": 9,
    "millisecond": 120,
    "offsetMinutes": 330
  },
  "output": {
    "datetime": "2024-02-29T14:05:09.12+05:30"
  }
} satisfies ToolExample<TimeDatetimeMachineFormatInput, TimeDatetimeMachineFormatOutput>;
export const timeDatetimeMachineFormatTool = defineTool<TimeDatetimeMachineFormatInput, TimeDatetimeMachineFormatOutput>({
  id: "html/time-datetime-machine-format",
  title: "time datetime Machine Format",
  description: "Builds a valid time-element datetime value from a proleptic Gregorian date and optional local/global time. Supports date, local-datetime and global-datetime profiles with years 1 through 999999; no timezone database or date inference is used.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: timeDatetimeMachineFormatInputSchema,
  outputSchema: timeDatetimeMachineFormatOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "mode",
        "label": "Mode",
        "required": true,
        "valueType": {
          "type": "string"
        }
      },
      {
        "id": "year",
        "label": "Year",
        "required": true,
        "valueType": {
          "type": "integer"
        }
      },
      {
        "id": "month",
        "label": "Month",
        "required": true,
        "valueType": {
          "type": "integer"
        }
      },
      {
        "id": "day",
        "label": "Day",
        "required": true,
        "valueType": {
          "type": "integer"
        }
      },
      {
        "id": "hour",
        "label": "Hour",
        "required": true,
        "valueType": {
          "type": "integer",
          "unit": "h"
        }
      },
      {
        "id": "minute",
        "label": "Minute",
        "required": true,
        "valueType": {
          "type": "integer",
          "unit": "min"
        }
      },
      {
        "id": "second",
        "label": "Second",
        "required": true,
        "valueType": {
          "type": "integer",
          "unit": "s"
        }
      },
      {
        "id": "millisecond",
        "label": "Millisecond",
        "required": true,
        "valueType": {
          "type": "integer",
          "unit": "ms"
        }
      },
      {
        "id": "offsetMinutes",
        "label": "Offset Minutes",
        "required": true,
        "valueType": {
          "type": "integer",
          "unit": "min"
        }
      }
    ],
    "outputs": [
      {
        "id": "datetime",
        "label": "Datetime",
        "valueType": {
          "type": "string"
        }
      }
    ]
  },
  execute: calculateTimeDatetimeMachineFormat,
});
export const runTimeDatetimeMachineFormat = timeDatetimeMachineFormatTool.execute;
export default timeDatetimeMachineFormatTool;
