import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { asciiLower, htmlTokens } from "../void-elements-list-checker/tool.js";
export type DnsPrefetchRelUsageLookupInput = {
  readonly rel: string;
  readonly href: string;
};
export type DnsPrefetchRelUsageLookupOutput = {
  readonly dnsPrefetchRelation: boolean;
  readonly nonemptyHref: boolean;
  readonly hintPresent: boolean;
};
export const dnsPrefetchRelUsageLookupInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "rel": {
      "type": "string",
      "maxLength": 100000,
      "description": "Rel"
    },
    "href": {
      "type": "string",
      "maxLength": 100000,
      "description": "Href"
    }
  },
  "required": [
    "rel",
    "href"
  ]
} as const satisfies ToolJsonSchema;
export const dnsPrefetchRelUsageLookupOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "dnsPrefetchRelation": {
      "type": "boolean",
      "description": "Dns Prefetch Relation"
    },
    "nonemptyHref": {
      "type": "boolean",
      "description": "Nonempty Href"
    },
    "hintPresent": {
      "type": "boolean",
      "description": "Hint Present"
    }
  },
  "required": [
    "dnsPrefetchRelation",
    "nonemptyHref",
    "hintPresent"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://html.spec.whatwg.org/multipage/links.html#link-type-dns-prefetch
export const calculateDnsPrefetchRelUsageLookup = (rawInput: unknown): ToolResult<DnsPrefetchRelUsageLookupOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly rel?: unknown; readonly href?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "rel",
  "href"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const relValue = candidate.rel;
if (typeof relValue !== "string") return issue("rel", "invalid_type", "Enter a string value.");
if (relValue.length > 100000) return issue("rel", "resource_limit", "Text exceeds the 100000-character resource limit.");
const hrefValue = candidate.href;
if (typeof hrefValue !== "string") return issue("href", "invalid_type", "Enter a string value.");
if (hrefValue.length > 100000) return issue("href", "resource_limit", "Text exceeds the 100000-character resource limit.");
  const input: DnsPrefetchRelUsageLookupInput = { rel: relValue, href: hrefValue };
 const dnsPrefetchRelation = htmlTokens(input.rel).map(asciiLower).includes("dns-prefetch");
 const nonemptyHref = htmlTokens(input.href).length > 0;
 return toolSuccess({ dnsPrefetchRelation, nonemptyHref, hintPresent: dnsPrefetchRelation && nonemptyHref });
};
export const example = {
  "input": {
    "rel": "dns-prefetch",
    "href": "//assets.example.org"
  },
  "output": {
    "dnsPrefetchRelation": true,
    "nonemptyHref": true,
    "hintPresent": true
  }
} satisfies ToolExample<DnsPrefetchRelUsageLookupInput, DnsPrefetchRelUsageLookupOutput>;
export const dnsPrefetchRelUsageLookupTool = defineTool<DnsPrefetchRelUsageLookupInput, DnsPrefetchRelUsageLookupOutput>({
  id: "html/dns-prefetch-rel-usage-lookup",
  title: "dns-prefetch rel Usage Lookup",
  description: "Identifies dns-prefetch in a parsed link relation and a supplied nonempty href. This classifies the hint only and performs no DNS or URL validation.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: dnsPrefetchRelUsageLookupInputSchema,
  outputSchema: dnsPrefetchRelUsageLookupOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "rel",
        "label": "Rel",
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
        "id": "dnsPrefetchRelation",
        "label": "Dns Prefetch Relation",
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "nonemptyHref",
        "label": "Nonempty Href",
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "hintPresent",
        "label": "Hint Present",
        "valueType": {
          "type": "boolean"
        }
      }
    ]
  },
  execute: calculateDnsPrefetchRelUsageLookup,
});
export const runDnsPrefetchRelUsageLookup = dnsPrefetchRelUsageLookupTool.execute;
export default dnsPrefetchRelUsageLookupTool;
