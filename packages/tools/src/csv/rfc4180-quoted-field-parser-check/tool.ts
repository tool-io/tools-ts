import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type Rfc4180QuotedFieldParserCheckInput = {
  readonly csv: string;
  readonly delimiter: "," | ";" | "\t";
};
export type Rfc4180QuotedFieldParserCheckOutput = {
  readonly valid: boolean;
  readonly recordCount: number;
  readonly fieldCount: number;
  readonly errorOffset: number;
  readonly errorCode: string;
};
export const rfc4180QuotedFieldParserCheckInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "csv": {
      "type": "string",
      "maxLength": 100000,
      "description": "CSV text"
    },
    "delimiter": {
      "type": "string",
      "enum": [
        ",",
        ";",
        "\t"
      ],
      "description": "Delimiter"
    }
  },
  "required": [
    "csv",
    "delimiter"
  ]
} as const satisfies ToolJsonSchema;
export const rfc4180QuotedFieldParserCheckOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "valid": {
      "type": "boolean",
      "description": "Valid"
    },
    "recordCount": {
      "type": "integer",
      "minimum": 0,
      "maximum": 9007199254740991,
      "description": "Record count"
    },
    "fieldCount": {
      "type": "integer",
      "minimum": 0,
      "maximum": 9007199254740991,
      "description": "Field count"
    },
    "errorOffset": {
      "type": "integer",
      "minimum": -1,
      "maximum": 9007199254740991,
      "description": "Error offset"
    },
    "errorCode": {
      "type": "string",
      "description": "Error code"
    }
  },
  "required": [
    "valid",
    "recordCount",
    "fieldCount",
    "errorOffset",
    "errorCode"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

export type CsvReadResult =
  | { readonly ok: true; readonly records: ReadonlyArray<ReadonlyArray<string>>; readonly rawRecords: ReadonlyArray<string>; readonly hasTerminalBreak: boolean; readonly fieldCount: number }
  | { readonly ok: false; readonly code: "invalid_csv" | "resource_limit"; readonly message: string; readonly offset: number };

/** RFC 4180 quote rules; Unicode text and CR/LF record endings are accepted extensions. */
export const readCsvText = (text: string, delimiter: string = ","): CsvReadResult => {
  const failure = (code: "invalid_csv" | "resource_limit", message: string, offset: number): CsvReadResult => ({ ok: false, code, message, offset });
  if (text.length > 100000) return failure("resource_limit", "CSV exceeds 100,000 UTF-16 code units.", 100000);
  if (delimiter !== "," && delimiter !== ";" && delimiter !== "\t") return failure("invalid_csv", "Unsupported delimiter.", 0);
  const records: string[][] = [];
  const rawRecords: string[] = [];
  let row: string[] = [];
  let field = "";
  let state: "start" | "plain" | "quoted" | "closed" = "start";
  let start = 0;
  let fieldCount = 0;
  let terminal = false;
  const finishField = (): boolean => {
    fieldCount++;
    if (fieldCount > 10000) return false;
    row.push(field);
    field = "";
    state = "start";
    return true;
  };
  for (let index = 0; index < text.length; index++) {
    const character = text[index];
    terminal = false;
    if (state === "quoted") {
      if (character === '"') {
        if (text[index + 1] === '"') { field += '"'; index++; }
        else state = "closed";
      } else field += character;
      continue;
    }
    if (character === delimiter) {
      if (!finishField()) return failure("resource_limit", "CSV exceeds 10,000 fields.", index);
      continue;
    }
    if (character === "\r" || character === "\n") {
      if (!finishField()) return failure("resource_limit", "CSV exceeds 10,000 fields.", index);
      records.push(row);
      rawRecords.push(text.slice(start, index));
      row = [];
      if (character === "\r" && text[index + 1] === "\n") index++;
      start = index + 1;
      terminal = true;
      continue;
    }
    if (state === "closed") return failure("invalid_csv", "Only a delimiter or record ending may follow a closing quote.", index);
    if (character === '"') {
      if (state !== "start") return failure("invalid_csv", "A quote inside an unquoted field is invalid.", index);
      state = "quoted";
    } else { field += character; state = "plain"; }
  }
  if (state === "quoted") return failure("invalid_csv", "Quoted field is not closed.", text.length);
  if (start < text.length) {
    if (!finishField()) return failure("resource_limit", "CSV exceeds 10,000 fields.", text.length);
    records.push(row);
    rawRecords.push(text.slice(start));
  }
  return { ok: true, records, rawRecords, hasTerminalBreak: terminal, fieldCount };
};

/** Preserve a one-cell empty record by quoting it; output uses LF with no terminal break. */
export const writeCsvRecords = (records: ReadonlyArray<ReadonlyArray<string>>, delimiter = ",", quoteAll = false): string =>
  records.map((row) => row.map((cell) => {
    const quote = quoteAll || cell.includes(delimiter) || /["\r\n]/.test(cell) || (row.length === 1 && cell === "");
    return quote ? '"' + cell.replace(/"/g, '""') + '"' : cell;
  }).join(delimiter)).join("\n");

export const csvShape = (records: ReadonlyArray<ReadonlyArray<string>>): number | undefined => {
  const width = records[0]?.length ?? 0;
  return records.every((row) => row.length === width) ? width : undefined;
};

// Reference: https://www.rfc-editor.org/rfc/rfc4180
export const calculateRfc4180QuotedFieldParserCheck = (rawInput: unknown): ToolResult<Rfc4180QuotedFieldParserCheckOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly csv?: unknown; readonly delimiter?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "csv",
  "delimiter"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const csvValue = candidate.csv;
  if (typeof csvValue !== "string") return issue("csv", "invalid_type", "Enter a string value.");
  if (csvValue.length > 100000) return issue("csv", "resource_limit", "Text exceeds the 100000-character resource limit.");
  const delimiterValue = candidate.delimiter;
  if (typeof delimiterValue !== "string") return issue("delimiter", "invalid_type", "Enter a string value.");
  if (delimiterValue !== "," && delimiterValue !== ";" && delimiterValue !== "\t") return issue("delimiter", "invalid_value", "Choose a supported value.");
  const input: Rfc4180QuotedFieldParserCheckInput = { csv: csvValue, delimiter: delimiterValue };
  const parsed = readCsvText(input.csv, input.delimiter);
  if (!parsed.ok) {
    if (parsed.code === "resource_limit") return issue("csv", parsed.code, parsed.message);
    return toolSuccess({ valid: false, recordCount: 0, fieldCount: 0, errorOffset: parsed.offset, errorCode: parsed.code });
  }
  return toolSuccess({ valid: true, recordCount: parsed.records.length, fieldCount: parsed.fieldCount, errorOffset: -1, errorCode: "" });
};
export const example = {
  input: {
    "csv": "name,note\r\nAda,\"a,b\r\nc\"",
    "delimiter": ","
  },
  output: {
    "valid": true,
    "recordCount": 2,
    "fieldCount": 4,
    "errorOffset": -1,
    "errorCode": ""
  },
} satisfies ToolExample<Rfc4180QuotedFieldParserCheckInput, Rfc4180QuotedFieldParserCheckOutput>;
export const rfc4180QuotedFieldParserCheckTool = defineTool<Rfc4180QuotedFieldParserCheckInput, Rfc4180QuotedFieldParserCheckOutput>({
  id: "csv/rfc4180-quoted-field-parser-check",
  title: "RFC 4180 Quoted Field Parser Check",
  description: "Check RFC 4180 field quoting with explicit Unicode and CR/LF extensions; blank records are retained, and field-width consistency is checked separately.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: rfc4180QuotedFieldParserCheckInputSchema,
  outputSchema: rfc4180QuotedFieldParserCheckOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "csv",
        "label": "CSV text",
        "required": true,
        "valueType": {
          "type": "string"
        }
      },
      {
        "id": "delimiter",
        "label": "Delimiter",
        "required": true,
        "valueType": {
          "type": "string"
        }
      }
    ],
    "outputs": [
      {
        "id": "valid",
        "label": "Valid",
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "recordCount",
        "label": "Record count",
        "valueType": {
          "type": "integer"
        }
      },
      {
        "id": "fieldCount",
        "label": "Field count",
        "valueType": {
          "type": "integer"
        }
      },
      {
        "id": "errorOffset",
        "label": "Error offset",
        "valueType": {
          "type": "integer"
        }
      },
      {
        "id": "errorCode",
        "label": "Error code",
        "valueType": {
          "type": "string"
        }
      }
    ]
  },
  execute: calculateRfc4180QuotedFieldParserCheck,
});
export const runRfc4180QuotedFieldParserCheck = rfc4180QuotedFieldParserCheckTool.execute;
export default rfc4180QuotedFieldParserCheckTool;
