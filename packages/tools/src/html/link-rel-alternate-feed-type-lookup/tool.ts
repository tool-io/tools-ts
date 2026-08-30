import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { htmlTokens, escapeAttribute } from "../void-elements-list-checker/tool.js";
export type LinkRelAlternateFeedTypeLookupInput = {
  readonly format: "rss" | "atom";
  readonly href: string;
};
export type LinkRelAlternateFeedTypeLookupOutput = {
  readonly mediaType: string;
  readonly element: string;
};
export const linkRelAlternateFeedTypeLookupInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "format": {
      "type": "string",
      "enum": [
        "rss",
        "atom"
      ],
      "description": "Format"
    },
    "href": {
      "type": "string",
      "maxLength": 10000,
      "description": "Href"
    }
  },
  "required": [
    "format",
    "href"
  ]
} as const satisfies ToolJsonSchema;
export const linkRelAlternateFeedTypeLookupOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "mediaType": {
      "type": "string",
      "description": "Media Type"
    },
    "element": {
      "type": "string",
      "description": "Element"
    }
  },
  "required": [
    "mediaType",
    "element"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://html.spec.whatwg.org/multipage/links.html#link-type-alternate
export const calculateLinkRelAlternateFeedTypeLookup = (rawInput: unknown): ToolResult<LinkRelAlternateFeedTypeLookupOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly format?: unknown; readonly href?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "format",
  "href"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const formatValue = candidate.format;
if (typeof formatValue !== "string") return issue("format", "invalid_type", "Enter a string value.");
if (formatValue !== "rss" && formatValue !== "atom") return issue("format", "invalid_value", "Choose a supported value.");
const hrefValue = candidate.href;
if (typeof hrefValue !== "string") return issue("href", "invalid_type", "Enter a string value.");
if (hrefValue.length > 10000) return issue("href", "resource_limit", "Text exceeds the 10000-character resource limit.");
  const input: LinkRelAlternateFeedTypeLookupInput = { format: formatValue, href: hrefValue };
 if (htmlTokens(input.href).length === 0 || /[\u0000\r\n]/.test(input.href)) return issue("href", "invalid_format", "Enter a nonempty href without null or line breaks.");
 const mediaType = input.format === "rss" ? "application/rss+xml" : "application/atom+xml";
 return toolSuccess({ mediaType, element: `<link rel="alternate" type="${mediaType}" href="${escapeAttribute(input.href)}">` });
};
export const example = {
  "input": {
    "format": "atom",
    "href": "/feed.xml?a=1&b=2"
  },
  "output": {
    "mediaType": "application/atom+xml",
    "element": "<link rel=\"alternate\" type=\"application/atom+xml\" href=\"/feed.xml?a=1&amp;b=2\">"
  }
} satisfies ToolExample<LinkRelAlternateFeedTypeLookupInput, LinkRelAlternateFeedTypeLookupOutput>;
export const linkRelAlternateFeedTypeLookupTool = defineTool<LinkRelAlternateFeedTypeLookupInput, LinkRelAlternateFeedTypeLookupOutput>({
  id: "html/link-rel-alternate-feed-type-lookup",
  title: "link rel=alternate Feed Type Lookup",
  description: "Builds link rel=alternate feed metadata for RSS or Atom with the standard media type and an escaped caller-supplied href. URL fetching and feed document validation are separate.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: linkRelAlternateFeedTypeLookupInputSchema,
  outputSchema: linkRelAlternateFeedTypeLookupOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "format",
        "label": "Format",
        "required": true,
        "valueType": {
          "type": "string"
        }
      },
      {
        "id": "href",
        "label": "Href",
        "required": true,
        "valueType": {
          "type": "string"
        }
      }
    ],
    "outputs": [
      {
        "id": "mediaType",
        "label": "Media Type",
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
  execute: calculateLinkRelAlternateFeedTypeLookup,
});
export const runLinkRelAlternateFeedTypeLookup = linkRelAlternateFeedTypeLookupTool.execute;
export default linkRelAlternateFeedTypeLookupTool;
