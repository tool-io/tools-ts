import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type NonprintableCharStripperCellsInput = {
  readonly values: ReadonlyArray<string>;
  readonly preserveLineBreaks: boolean;
};
export type NonprintableCharStripperCellsOutput = {
  readonly values: ReadonlyArray<string>;
};
export const nonprintableCharStripperCellsInputSchema = {
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
    },
    "preserveLineBreaks": {
      "type": "boolean",
      "description": "Preserve line breaks"
    }
  },
  "required": [
    "values",
    "preserveLineBreaks"
  ]
} as const satisfies ToolJsonSchema;
export const nonprintableCharStripperCellsOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "values": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Values"
    }
  },
  "required": [
    "values"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.unicode.org/reports/tr44/#General_Category_Values
export const calculateNonprintableCharStripperCells = (rawInput: unknown): ToolResult<NonprintableCharStripperCellsOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly values?: unknown; readonly preserveLineBreaks?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "values",
  "preserveLineBreaks"
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
  const preserveLineBreaksValue = candidate.preserveLineBreaks;
  if (typeof preserveLineBreaksValue !== "boolean") return issue("preserveLineBreaks", "invalid_type", "Enter a boolean value.");
  const input: NonprintableCharStripperCellsInput = { values: validatedValues, preserveLineBreaks: preserveLineBreaksValue };
  const values = input.values.map((value) => value.replace(/[\u0000-\u001f\u007f-\u009f]/g, (character) => input.preserveLineBreaks && /[\t\r\n]/.test(character) ? character : ""));
  return toolSuccess({ values });
};
export const example = {
  "input": {
    "values": [
      "a\u0000b\tc\n",
      "x\u0085y"
    ],
    "preserveLineBreaks": true
  },
  "output": {
    "values": [
      "ab\tc\n",
      "xy"
    ]
  }
} satisfies ToolExample<NonprintableCharStripperCellsInput, NonprintableCharStripperCellsOutput>;
export const nonprintableCharStripperCellsTool = defineTool<NonprintableCharStripperCellsInput, NonprintableCharStripperCellsOutput>({
  id: "csv/nonprintable-char-stripper-cells",
  title: "Non-Printable Char Stripper Cells",
  description: "Remove C0/C1 control characters and DEL from cell strings, optionally preserving tab, LF, and CR; other Unicode format characters are left intact.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: nonprintableCharStripperCellsInputSchema,
  outputSchema: nonprintableCharStripperCellsOutputSchema,
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
        "id": "preserveLineBreaks",
        "label": "Preserve line breaks",
        "required": true,
        "valueType": {
          "type": "boolean"
        }
      }
    ],
    "outputs": [
      {
        "id": "values",
        "label": "Values",
        "valueType": {
          "type": "list",
          "items": {
            "type": "string"
          }
        }
      }
    ]
  },
  execute: calculateNonprintableCharStripperCells,
});
export const runNonprintableCharStripperCells = nonprintableCharStripperCellsTool.execute;
export default nonprintableCharStripperCellsTool;
