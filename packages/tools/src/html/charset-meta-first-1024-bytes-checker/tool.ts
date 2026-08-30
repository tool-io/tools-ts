import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { asciiLower } from "../void-elements-list-checker/tool.js";
export type CharsetMetaFirst1024BytesCheckerInput = {
  readonly charset: string;
  readonly tagEndByteExclusive: number;
};
export type CharsetMetaFirst1024BytesCheckerOutput = {
  readonly utf8: boolean;
  readonly withinFirst1024: boolean;
  readonly passes: boolean;
};
export const charsetMetaFirst1024BytesCheckerInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "charset": {
      "type": "string",
      "maxLength": 100,
      "description": "Charset"
    },
    "tagEndByteExclusive": {
      "type": "integer",
      "minimum": 0,
      "maximum": 9007199254740991,
      "description": "Tag End Byte Exclusive"
    }
  },
  "required": [
    "charset",
    "tagEndByteExclusive"
  ]
} as const satisfies ToolJsonSchema;
export const charsetMetaFirst1024BytesCheckerOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "utf8": {
      "type": "boolean",
      "description": "Utf8"
    },
    "withinFirst1024": {
      "type": "boolean",
      "description": "Within First1024"
    },
    "passes": {
      "type": "boolean",
      "description": "Passes"
    }
  },
  "required": [
    "utf8",
    "withinFirst1024",
    "passes"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://html.spec.whatwg.org/multipage/semantics.html#charset
export const calculateCharsetMetaFirst1024BytesChecker = (rawInput: unknown): ToolResult<CharsetMetaFirst1024BytesCheckerOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly charset?: unknown; readonly tagEndByteExclusive?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "charset",
  "tagEndByteExclusive"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const charsetValue = candidate.charset;
if (typeof charsetValue !== "string") return issue("charset", "invalid_type", "Enter a string value.");
if (charsetValue.length > 100) return issue("charset", "resource_limit", "Text exceeds the 100-character resource limit.");
const tagEndByteExclusiveValue = candidate.tagEndByteExclusive;
if (typeof tagEndByteExclusiveValue !== "number" || !Number.isSafeInteger(tagEndByteExclusiveValue)) return issue("tagEndByteExclusive", "invalid_type", "Enter a finite safe integer.");
if (tagEndByteExclusiveValue < 0) return issue("tagEndByteExclusive", "out_of_range", "Value is outside the accepted range.");
if (tagEndByteExclusiveValue > 9007199254740991) return issue("tagEndByteExclusive", "out_of_range", "Value is outside the accepted range.");
  const input: CharsetMetaFirst1024BytesCheckerInput = { charset: charsetValue, tagEndByteExclusive: tagEndByteExclusiveValue };
 const utf8 = asciiLower(input.charset) === "utf-8";
 const withinFirst1024 = input.tagEndByteExclusive <= 1024;
 return toolSuccess({ utf8, withinFirst1024, passes: utf8 && withinFirst1024 });
};
export const example = {
  "input": {
    "charset": "UTF-8",
    "tagEndByteExclusive": 128
  },
  "output": {
    "utf8": true,
    "withinFirst1024": true,
    "passes": true
  }
} satisfies ToolExample<CharsetMetaFirst1024BytesCheckerInput, CharsetMetaFirst1024BytesCheckerOutput>;
export const charsetMetaFirst1024BytesCheckerTool = defineTool<CharsetMetaFirst1024BytesCheckerInput, CharsetMetaFirst1024BytesCheckerOutput>({
  id: "html/charset-meta-first-1024-bytes-checker",
  title: "Meta Charset First-1024-Bytes Check",
  description: "Checks a supplied meta charset declaration and its exclusive ending byte offset against the first 1024 bytes rule. Byte positions must come from the original encoded HTML, not UTF-16 character offsets.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: charsetMetaFirst1024BytesCheckerInputSchema,
  outputSchema: charsetMetaFirst1024BytesCheckerOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "charset",
        "label": "Charset",
        "required": true,
        "valueType": {
          "type": "string"
        }
      },
      {
        "id": "tagEndByteExclusive",
        "label": "Tag End Byte Exclusive",
        "required": true,
        "valueType": {
          "type": "integer",
          "unit": "byte"
        }
      }
    ],
    "outputs": [
      {
        "id": "utf8",
        "label": "Utf8",
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "withinFirst1024",
        "label": "Within First1024",
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "passes",
        "label": "Passes",
        "valueType": {
          "type": "boolean"
        }
      }
    ]
  },
  execute: calculateCharsetMetaFirst1024BytesChecker,
});
export const runCharsetMetaFirst1024BytesChecker = charsetMetaFirst1024BytesCheckerTool.execute;
export default charsetMetaFirst1024BytesCheckerTool;
