import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { readCsvText } from "../rfc4180-quoted-field-parser-check/tool.js";
export type CommentLineHashPrefixSkipperInput = {
  readonly csv: string;
  readonly delimiter: "," | ";" | "\t";
};
export type CommentLineHashPrefixSkipperOutput = {
  readonly csv: string;
  readonly removedLineCount: number;
};
export const commentLineHashPrefixSkipperInputSchema = {
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
export const commentLineHashPrefixSkipperOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "csv": {
      "type": "string",
      "description": "CSV text"
    },
    "removedLineCount": {
      "type": "integer",
      "minimum": 0,
      "maximum": 9007199254740991,
      "description": "Removed line count"
    }
  },
  "required": [
    "csv",
    "removedLineCount"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.rfc-editor.org/rfc/rfc4180
export const calculateCommentLineHashPrefixSkipper = (rawInput: unknown): ToolResult<CommentLineHashPrefixSkipperOutput> => {
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
  const input: CommentLineHashPrefixSkipperInput = { csv: csvValue, delimiter: delimiterValue };
  let state: "start" | "plain" | "quoted" | "closed" = "start";
  let csv = "";
  let removedLineCount = 0;
  const lines = input.csv.match(/[^\r\n]*(?:\r\n|\r|\n|$)/g) ?? [];
  for (const line of lines) {
    if (line === "") continue;
    if (state !== "quoted" && line.startsWith("#")) { removedLineCount++; continue; }
    csv += line;
    for (let index = 0; index < line.length; index++) {
      const character = line.charAt(index);
      if (state === "quoted") {
        if (character === '"') {
          if (line[index + 1] === '"') index++;
          else state = "closed";
        }
      } else if (character === input.delimiter || character === "\r" || character === "\n") state = "start";
      else if (character === '"' && state === "start") state = "quoted";
      else if (state !== "closed") state = "plain";
    }
  }
  const parsed = readCsvText(csv, input.delimiter);
  if (!parsed.ok) return issue("csv", parsed.code, parsed.message);
  return toolSuccess({ csv, removedLineCount });
};
export const example = {
  input: {
    "csv": "# metadata\na,b\n\"first\n#inside\",c\n# final\n",
    "delimiter": ","
  },
  output: {
    "csv": "a,b\n\"first\n#inside\",c\n",
    "removedLineCount": 2
  },
} satisfies ToolExample<CommentLineHashPrefixSkipperInput, CommentLineHashPrefixSkipperOutput>;
export const commentLineHashPrefixSkipperTool = defineTool<CommentLineHashPrefixSkipperInput, CommentLineHashPrefixSkipperOutput>({
  id: "csv/comment-line-hash-prefix-skipper",
  title: "Comment Line #-Prefix Skipper",
  description: "Remove physical lines starting with # outside quoted CSV fields, preserving such lines inside multiline fields; # comments are an explicit non-RFC extension.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: commentLineHashPrefixSkipperInputSchema,
  outputSchema: commentLineHashPrefixSkipperOutputSchema,
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
        "id": "csv",
        "label": "CSV text",
        "valueType": {
          "type": "string"
        }
      },
      {
        "id": "removedLineCount",
        "label": "Removed line count",
        "valueType": {
          "type": "integer"
        }
      }
    ]
  },
  execute: calculateCommentLineHashPrefixSkipper,
});
export const runCommentLineHashPrefixSkipper = commentLineHashPrefixSkipperTool.execute;
export default commentLineHashPrefixSkipperTool;
