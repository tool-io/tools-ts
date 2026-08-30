import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { escapeAttribute } from "../void-elements-list-checker/tool.js";
import { parseUrl } from "../../core/url.js";
export type MetaRefreshSecondsUrlFormatInput = {
  readonly seconds: number;
  readonly url: string;
};
export type MetaRefreshSecondsUrlFormatOutput = {
  readonly content: string;
  readonly element: string;
};
export const metaRefreshSecondsUrlFormatInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "seconds": {
      "type": "integer",
      "minimum": 0,
      "maximum": 9007199254740991,
      "description": "Seconds"
    },
    "url": {
      "type": "string",
      "maxLength": 10000,
      "description": "Url"
    }
  },
  "required": [
    "seconds",
    "url"
  ]
} as const satisfies ToolJsonSchema;
export const metaRefreshSecondsUrlFormatOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "content": {
      "type": "string",
      "description": "Content"
    },
    "element": {
      "type": "string",
      "description": "Element"
    }
  },
  "required": [
    "content",
    "element"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://html.spec.whatwg.org/multipage/semantics.html#attr-meta-http-equiv-refresh
export const calculateMetaRefreshSecondsUrlFormat = (rawInput: unknown): ToolResult<MetaRefreshSecondsUrlFormatOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly seconds?: unknown; readonly url?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "seconds",
  "url"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const secondsValue = candidate.seconds;
if (typeof secondsValue !== "number" || !Number.isSafeInteger(secondsValue)) return issue("seconds", "invalid_type", "Enter a finite safe integer.");
if (secondsValue < 0) return issue("seconds", "out_of_range", "Value is outside the accepted range.");
if (secondsValue > 9007199254740991) return issue("seconds", "out_of_range", "Value is outside the accepted range.");
const urlValue = candidate.url;
if (typeof urlValue !== "string") return issue("url", "invalid_type", "Enter a string value.");
if (urlValue.length > 10000) return issue("url", "resource_limit", "Text exceeds the 10000-character resource limit.");
  const input: MetaRefreshSecondsUrlFormatInput = { seconds: secondsValue, url: urlValue };
 let href: string;
 try {
   const parsed = parseUrl(input.url);
   if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return issue("url", "invalid_scheme", "Enter an absolute HTTP or HTTPS URL.");
   href = parsed.href;
 } catch { return issue("url", "invalid_url", "Enter a valid absolute HTTP or HTTPS URL."); }
 const content = `${input.seconds};url=${href}`;
 return toolSuccess({ content, element: `<meta http-equiv="refresh" content="${escapeAttribute(content)}">` });
};
export const example = {
  "input": {
    "seconds": 5,
    "url": "https://example.org/next?a=1&b=2"
  },
  "output": {
    "content": "5;url=https://example.org/next?a=1&b=2",
    "element": "<meta http-equiv=\"refresh\" content=\"5;url=https://example.org/next?a=1&amp;b=2\">"
  }
} satisfies ToolExample<MetaRefreshSecondsUrlFormatInput, MetaRefreshSecondsUrlFormatOutput>;
export const metaRefreshSecondsUrlFormatTool = defineTool<MetaRefreshSecondsUrlFormatInput, MetaRefreshSecondsUrlFormatOutput>({
  id: "html/meta-refresh-seconds-url-format",
  title: "Meta Refresh seconds;url Format",
  description: "Builds an escaped meta refresh element from a nonnegative integer delay in seconds and an absolute HTTP(S) URL. The URL is normalized with the portable WHATWG URL helper; relative URLs and fractional-delay parser behavior are outside this builder profile.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: metaRefreshSecondsUrlFormatInputSchema,
  outputSchema: metaRefreshSecondsUrlFormatOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "seconds",
        "label": "Seconds",
        "required": true,
        "valueType": {
          "type": "integer",
          "unit": "s"
        }
      },
      {
        "id": "url",
        "label": "Url",
        "required": true,
        "valueType": {
          "type": "string"
        }
      }
    ],
    "outputs": [
      {
        "id": "content",
        "label": "Content",
        "valueType": {
          "type": "string"
        }
      },
      {
        "id": "element",
        "label": "Element",
        "valueType": {
          "type": "string"
        }
      }
    ]
  },
  execute: calculateMetaRefreshSecondsUrlFormat,
});
export const runMetaRefreshSecondsUrlFormat = metaRefreshSecondsUrlFormatTool.execute;
export default metaRefreshSecondsUrlFormatTool;
