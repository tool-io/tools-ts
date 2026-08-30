import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type Utf8NoBomExportStandardCheckerInput = {
  readonly bytes: ReadonlyArray<number>;
};
export type Utf8NoBomExportStandardCheckerOutput = {
  readonly validUtf8: boolean;
  readonly hasBom: boolean;
  readonly conforms: boolean;
  readonly errorOffset: number;
};
export const utf8NoBomExportStandardCheckerInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "bytes": {
      "type": "array",
      "items": {
        "type": "integer",
        "minimum": 0,
        "maximum": 255
      },
      "minItems": 0,
      "maxItems": 100000,
      "description": "Bytes"
    }
  },
  "required": [
    "bytes"
  ]
} as const satisfies ToolJsonSchema;
export const utf8NoBomExportStandardCheckerOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "validUtf8": {
      "type": "boolean",
      "description": "Valid utf8"
    },
    "hasBom": {
      "type": "boolean",
      "description": "Has bom"
    },
    "conforms": {
      "type": "boolean",
      "description": "Conforms"
    },
    "errorOffset": {
      "type": "integer",
      "minimum": -1,
      "maximum": 9007199254740991,
      "description": "Error offset"
    }
  },
  "required": [
    "validUtf8",
    "hasBom",
    "conforms",
    "errorOffset"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

export const utf8ErrorOffset = (bytes: ReadonlyArray<number>): number => {
  for (let index = 0; index < bytes.length;) {
    const lead = bytes[index];
    if (lead === undefined) return index;
    if (lead <= 127) { index++; continue; }
    let length = 0;
    let secondMin = 128;
    let secondMax = 191;
    if (lead >= 194 && lead <= 223) length = 2;
    else if (lead >= 224 && lead <= 239) {
      length = 3;
      if (lead === 224) secondMin = 160;
      if (lead === 237) secondMax = 159;
    } else if (lead >= 240 && lead <= 244) {
      length = 4;
      if (lead === 240) secondMin = 144;
      if (lead === 244) secondMax = 143;
    } else return index;
    if (index + length > bytes.length) return index;
    for (let offset = 1; offset < length; offset++) {
      const value = bytes[index + offset];
      const minimum = offset === 1 ? secondMin : 128;
      const maximum = offset === 1 ? secondMax : 191;
      if (value === undefined || value < minimum || value > maximum) return index;
    }
    index += length;
  }
  return -1;
};

// Reference: https://www.rfc-editor.org/rfc/rfc3629.txt
export const calculateUtf8NoBomExportStandardChecker = (rawInput: unknown): ToolResult<Utf8NoBomExportStandardCheckerOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly bytes?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "bytes"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const bytesValue = candidate.bytes;
  if (!Array.isArray(bytesValue)) return issue("bytes", "invalid_type", "Enter a dense array.");
  if (bytesValue.length < 0) return issue("bytes", "out_of_range", "Too few entries.");
  if (bytesValue.length > 100000) return issue("bytes", "resource_limit", "Array exceeds the 100000-entry resource limit.");
  const validatedBytes: number[] = [];
  for (let index = 0; index < bytesValue.length; index++) {
    if (!Object.prototype.hasOwnProperty.call(bytesValue, index)) return issue(`bytes.${index}`, "invalid_type", "Sparse arrays are not supported.");
    const item: unknown = bytesValue[index];
    if (typeof item !== "number" || !Number.isSafeInteger(item)) return issue(`bytes.${index}`, "invalid_type", "Enter a finite safe integer.");
    if (item < 0) return issue(`bytes.${index}`, "out_of_range", "Value is outside the accepted range.");
    if (item > 255) return issue(`bytes.${index}`, "out_of_range", "Value is outside the accepted range.");
    validatedBytes.push(item);
  }
  const input: Utf8NoBomExportStandardCheckerInput = { bytes: validatedBytes };
  const errorOffset = utf8ErrorOffset(input.bytes);
  const validUtf8 = errorOffset === -1;
  const hasBom = input.bytes[0] === 239 && input.bytes[1] === 187 && input.bytes[2] === 191;
  return toolSuccess({ validUtf8, hasBom, conforms: validUtf8 && !hasBom, errorOffset });
};
export const example = {
  input: {
    "bytes": [
      65,
      44,
      195,
      169,
      10
    ]
  },
  output: {
    "validUtf8": true,
    "hasBom": false,
    "conforms": true,
    "errorOffset": -1
  },
} satisfies ToolExample<Utf8NoBomExportStandardCheckerInput, Utf8NoBomExportStandardCheckerOutput>;
export const utf8NoBomExportStandardCheckerTool = defineTool<Utf8NoBomExportStandardCheckerInput, Utf8NoBomExportStandardCheckerOutput>({
  id: "csv/utf8-no-bom-export-standard-checker",
  title: "UTF-8 No-BOM Export Standard Check",
  description: "Check a chosen export profile of well-formed RFC 3629 UTF-8 without an initial BOM, reporting UTF-8 validity separately from profile conformance; UTF-8 itself permits a BOM.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: utf8NoBomExportStandardCheckerInputSchema,
  outputSchema: utf8NoBomExportStandardCheckerOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "bytes",
        "label": "Bytes",
        "required": true,
        "valueType": {
          "type": "list",
          "items": {
            "type": "integer"
          }
        }
      }
    ],
    "outputs": [
      {
        "id": "validUtf8",
        "label": "Valid utf8",
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "hasBom",
        "label": "Has bom",
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "conforms",
        "label": "Conforms",
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "errorOffset",
        "label": "Error offset",
        "valueType": {
          "type": "integer"
        }
      }
    ]
  },
  execute: calculateUtf8NoBomExportStandardChecker,
});
export const runUtf8NoBomExportStandardChecker = utf8NoBomExportStandardCheckerTool.execute;
export default utf8NoBomExportStandardCheckerTool;
