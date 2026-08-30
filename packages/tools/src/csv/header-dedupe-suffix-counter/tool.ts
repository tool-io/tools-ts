import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type HeaderDedupeSuffixCounterInput = {
  readonly headers: ReadonlyArray<string>;
};
export type HeaderDedupeSuffixCounterOutput = {
  readonly headers: ReadonlyArray<string>;
};
export const headerDedupeSuffixCounterInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "headers": {
      "type": "array",
      "items": {
        "type": "string",
        "maxLength": 10000
      },
      "minItems": 0,
      "maxItems": 10000,
      "description": "Headers"
    }
  },
  "required": [
    "headers"
  ]
} as const satisfies ToolJsonSchema;
export const headerDedupeSuffixCounterOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "headers": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Headers"
    }
  },
  "required": [
    "headers"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.rfc-editor.org/rfc/rfc4180
export const calculateHeaderDedupeSuffixCounter = (rawInput: unknown): ToolResult<HeaderDedupeSuffixCounterOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly headers?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "headers"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const headersValue = candidate.headers;
  if (!Array.isArray(headersValue)) return issue("headers", "invalid_type", "Enter a dense array.");
  if (headersValue.length < 0) return issue("headers", "out_of_range", "Too few entries.");
  if (headersValue.length > 10000) return issue("headers", "resource_limit", "Array exceeds the 10000-entry resource limit.");
  const validatedHeaders: string[] = [];
  for (let index = 0; index < headersValue.length; index++) {
    if (!Object.prototype.hasOwnProperty.call(headersValue, index)) return issue(`headers.${index}`, "invalid_type", "Sparse arrays are not supported.");
    const item: unknown = headersValue[index];
    if (typeof item !== "string") return issue(`headers.${index}`, "invalid_type", "Enter a string value.");
    if (item.length > 10000) return issue(`headers.${index}`, "resource_limit", "Text exceeds the 10000-character resource limit.");
    validatedHeaders.push(item);
  }
  if (validatedHeaders.reduce((total, cell) => total + cell.length, 0) > 100000) return issue("headers", "resource_limit", "Combined cell text exceeds 100,000 UTF-16 code units.");
  const input: HeaderDedupeSuffixCounterInput = { headers: validatedHeaders };
  const reserved = new Set(input.headers);
  const used = new Set<string>();
  const nextSuffix = new Map<string, number>();
  const headers: string[] = [];
  for (const header of input.headers) {
    let candidateName = header;
    if (used.has(header)) {
      let suffix = nextSuffix.get(header) ?? 2;
      while (reserved.has(header + "_" + suffix) || used.has(header + "_" + suffix)) suffix++;
      candidateName = header + "_" + suffix;
      nextSuffix.set(header, suffix + 1);
    }
    used.add(candidateName);
    headers.push(candidateName);
  }
  return toolSuccess({ headers });
};
export const example = {
  input: {
    "headers": [
      "name",
      "name",
      "name_2"
    ]
  },
  output: {
    "headers": [
      "name",
      "name_3",
      "name_2"
    ]
  },
} satisfies ToolExample<HeaderDedupeSuffixCounterInput, HeaderDedupeSuffixCounterOutput>;
export const headerDedupeSuffixCounterTool = defineTool<HeaderDedupeSuffixCounterInput, HeaderDedupeSuffixCounterOutput>({
  id: "csv/header-dedupe-suffix-counter",
  title: "Header Dedupe Suffix Counter",
  description: "Make exact duplicate headers unique with _2, _3, and later suffixes, reserving all original names so generated names never steal a later header.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: headerDedupeSuffixCounterInputSchema,
  outputSchema: headerDedupeSuffixCounterOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "headers",
        "label": "Headers",
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
        "id": "headers",
        "label": "Headers",
        "valueType": {
          "type": "list",
          "items": {
            "type": "string"
          }
        }
      }
    ]
  },
  execute: calculateHeaderDedupeSuffixCounter,
});
export const runHeaderDedupeSuffixCounter = headerDedupeSuffixCounterTool.execute;
export default headerDedupeSuffixCounterTool;
