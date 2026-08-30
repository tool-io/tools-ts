import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type TwoDigitYearCenturyWindowRuleLookupInput = {
  readonly twoDigitYear: number;
  readonly windowStartYear: number;
};
export type TwoDigitYearCenturyWindowRuleLookupOutput = {
  readonly year: number;
};
export const twoDigitYearCenturyWindowRuleLookupInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "twoDigitYear": {
      "type": "integer",
      "minimum": 0,
      "maximum": 99,
      "description": "Two digit year"
    },
    "windowStartYear": {
      "type": "integer",
      "minimum": 1,
      "maximum": 9900,
      "description": "Window start year"
    }
  },
  "required": [
    "twoDigitYear",
    "windowStartYear"
  ]
} as const satisfies ToolJsonSchema;
export const twoDigitYearCenturyWindowRuleLookupOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "year": {
      "type": "integer",
      "minimum": 1,
      "maximum": 9999,
      "description": "Year"
    }
  },
  "required": [
    "year"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://support.microsoft.com/en-au/excel/change-the-date-system-format-or-two-digit-year-interpretation
export const calculateTwoDigitYearCenturyWindowRuleLookup = (rawInput: unknown): ToolResult<TwoDigitYearCenturyWindowRuleLookupOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly twoDigitYear?: unknown; readonly windowStartYear?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "twoDigitYear",
  "windowStartYear"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const twoDigitYearValue = candidate.twoDigitYear;
  if (typeof twoDigitYearValue !== "number" || !Number.isSafeInteger(twoDigitYearValue)) return issue("twoDigitYear", "invalid_type", "Enter a finite safe integer.");
  if (twoDigitYearValue < 0) return issue("twoDigitYear", "out_of_range", "Value is outside the accepted range.");
  if (twoDigitYearValue > 99) return issue("twoDigitYear", "out_of_range", "Value is outside the accepted range.");
  const windowStartYearValue = candidate.windowStartYear;
  if (typeof windowStartYearValue !== "number" || !Number.isSafeInteger(windowStartYearValue)) return issue("windowStartYear", "invalid_type", "Enter a finite safe integer.");
  if (windowStartYearValue < 1) return issue("windowStartYear", "out_of_range", "Value is outside the accepted range.");
  if (windowStartYearValue > 9900) return issue("windowStartYear", "out_of_range", "Value is outside the accepted range.");
  const input: TwoDigitYearCenturyWindowRuleLookupInput = { twoDigitYear: twoDigitYearValue, windowStartYear: windowStartYearValue };
  let year = Math.floor(input.windowStartYear / 100) * 100 + input.twoDigitYear;
  if (year < input.windowStartYear) year += 100;
  return toolSuccess({ year });
};
export const example = {
  input: {
    "twoDigitYear": 29,
    "windowStartYear": 1930
  },
  output: {
    "year": 2029
  },
} satisfies ToolExample<TwoDigitYearCenturyWindowRuleLookupInput, TwoDigitYearCenturyWindowRuleLookupOutput>;
export const twoDigitYearCenturyWindowRuleLookupTool = defineTool<TwoDigitYearCenturyWindowRuleLookupInput, TwoDigitYearCenturyWindowRuleLookupOutput>({
  id: "csv/two-digit-year-century-window-rule-lookup",
  title: "Two-Digit Year Century Window Rule Lookup",
  description: "Resolve a two-digit year into a caller-specified inclusive 100-year window, returning the unique year with matching final digits; no operating-system date setting is assumed.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: twoDigitYearCenturyWindowRuleLookupInputSchema,
  outputSchema: twoDigitYearCenturyWindowRuleLookupOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "twoDigitYear",
        "label": "Two digit year",
        "required": true,
        "valueType": {
          "type": "integer"
        }
      },
      {
        "id": "windowStartYear",
        "label": "Window start year",
        "required": true,
        "valueType": {
          "type": "integer"
        }
      }
    ],
    "outputs": [
      {
        "id": "year",
        "label": "Year",
        "valueType": {
          "type": "integer"
        }
      }
    ]
  },
  execute: calculateTwoDigitYearCenturyWindowRuleLookup,
});
export const runTwoDigitYearCenturyWindowRuleLookup = twoDigitYearCenturyWindowRuleLookupTool.execute;
export default twoDigitYearCenturyWindowRuleLookupTool;
