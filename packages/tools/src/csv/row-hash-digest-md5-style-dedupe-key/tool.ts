import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, type ToolResult } from "../../core/result.js";
import { md5Tool } from "../../hash/md5/tool.js";
export type RowHashDigestMd5StyleDedupeKeyInput = {
  readonly cells: ReadonlyArray<string>;
};
export type RowHashDigestMd5StyleDedupeKeyOutput = {
  readonly digest: string;
};
export const rowHashDigestMd5StyleDedupeKeyInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "cells": {
      "type": "array",
      "items": {
        "type": "string",
        "maxLength": 10000
      },
      "minItems": 0,
      "maxItems": 10000,
      "description": "Cells"
    }
  },
  "required": [
    "cells"
  ]
} as const satisfies ToolJsonSchema;
export const rowHashDigestMd5StyleDedupeKeyOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "digest": {
      "type": "string",
      "pattern": "^[0-9a-f]{32}$",
      "description": "Digest"
    }
  },
  "required": [
    "digest"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.rfc-editor.org/rfc/rfc1321; https://www.rfc-editor.org/rfc/rfc6151
export const calculateRowHashDigestMd5StyleDedupeKey = (rawInput: unknown): ToolResult<RowHashDigestMd5StyleDedupeKeyOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly cells?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "cells"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const cellsValue = candidate.cells;
  if (!Array.isArray(cellsValue)) return issue("cells", "invalid_type", "Enter a dense array.");
  if (cellsValue.length < 0) return issue("cells", "out_of_range", "Too few entries.");
  if (cellsValue.length > 10000) return issue("cells", "resource_limit", "Array exceeds the 10000-entry resource limit.");
  const validatedCells: string[] = [];
  for (let index = 0; index < cellsValue.length; index++) {
    if (!Object.prototype.hasOwnProperty.call(cellsValue, index)) return issue(`cells.${index}`, "invalid_type", "Sparse arrays are not supported.");
    const item: unknown = cellsValue[index];
    if (typeof item !== "string") return issue(`cells.${index}`, "invalid_type", "Enter a string value.");
    if (item.length > 10000) return issue(`cells.${index}`, "resource_limit", "Text exceeds the 10000-character resource limit.");
    validatedCells.push(item);
  }
  if (validatedCells.reduce((total, cell) => total + cell.length, 0) > 100000) return issue("cells", "resource_limit", "Combined cell text exceeds 100,000 UTF-16 code units.");
  const input: RowHashDigestMd5StyleDedupeKeyInput = { cells: validatedCells };
  return md5Tool.execute({ text: JSON.stringify(input.cells) });
};
export const example = {
  input: {
    "cells": [
      "Ada",
      "36"
    ]
  },
  output: {
    "digest": "a872fb1e68f10972395943b0605da494"
  },
} satisfies ToolExample<RowHashDigestMd5StyleDedupeKeyInput, RowHashDigestMd5StyleDedupeKeyOutput>;
export const rowHashDigestMd5StyleDedupeKeyTool = defineTool<RowHashDigestMd5StyleDedupeKeyInput, RowHashDigestMd5StyleDedupeKeyOutput>({
  id: "csv/row-hash-digest-md5-style-dedupe-key",
  title: "Row Hash Digest Dedupe Key",
  description: "Fingerprint one decoded row using legacy MD5 over UTF-8 JSON array text, preserving cell boundaries; confirm row equality before deduplication because MD5 is not collision resistant.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: rowHashDigestMd5StyleDedupeKeyInputSchema,
  outputSchema: rowHashDigestMd5StyleDedupeKeyOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "cells",
        "label": "Cells",
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
        "id": "digest",
        "label": "Digest",
        "valueType": {
          "type": "string"
        }
      }
    ]
  },
  execute: calculateRowHashDigestMd5StyleDedupeKey,
});
export const runRowHashDigestMd5StyleDedupeKey = rowHashDigestMd5StyleDedupeKeyTool.execute;
export default rowHashDigestMd5StyleDedupeKeyTool;
