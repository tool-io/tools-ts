import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { asciiLower, htmlTokens } from "../void-elements-list-checker/tool.js";
export type CanonicalLinkRelCheckerInput = {
  readonly rel: string;
  readonly href: string;
};
export type CanonicalLinkRelCheckerOutput = {
  readonly canonicalRelation: boolean;
  readonly nonemptyHref: boolean;
  readonly passes: boolean;
};
export const canonicalLinkRelCheckerInputSchema = {
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
export const canonicalLinkRelCheckerOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "canonicalRelation": {
      "type": "boolean",
      "description": "Canonical Relation"
    },
    "nonemptyHref": {
      "type": "boolean",
      "description": "Nonempty Href"
    },
    "passes": {
      "type": "boolean",
      "description": "Passes"
    }
  },
  "required": [
    "canonicalRelation",
    "nonemptyHref",
    "passes"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://html.spec.whatwg.org/multipage/links.html#link-type-canonical; https://www.rfc-editor.org/rfc/rfc6596
export const calculateCanonicalLinkRelChecker = (rawInput: unknown): ToolResult<CanonicalLinkRelCheckerOutput> => {
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
  const input: CanonicalLinkRelCheckerInput = { rel: relValue, href: hrefValue };
 const canonicalRelation = htmlTokens(input.rel).map(asciiLower).includes("canonical");
 const nonemptyHref = htmlTokens(input.href).length > 0;
 return toolSuccess({ canonicalRelation, nonemptyHref, passes: canonicalRelation && nonemptyHref });
};
export const example = {
  "input": {
    "rel": "canonical",
    "href": "/articles/main"
  },
  "output": {
    "canonicalRelation": true,
    "nonemptyHref": true,
    "passes": true
  }
} satisfies ToolExample<CanonicalLinkRelCheckerInput, CanonicalLinkRelCheckerOutput>;
export const canonicalLinkRelCheckerTool = defineTool<CanonicalLinkRelCheckerInput, CanonicalLinkRelCheckerOutput>({
  id: "html/canonical-link-rel-checker",
  title: "Canonical link rel Check",
  description: "Checks the canonical relation and a nonempty parsed href. Relative href values are accepted; this does not establish URL validity or canonical selection by search engines.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: canonicalLinkRelCheckerInputSchema,
  outputSchema: canonicalLinkRelCheckerOutputSchema,
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
        "id": "canonicalRelation",
        "label": "Canonical Relation",
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
        "id": "passes",
        "label": "Passes",
        "valueType": {
          "type": "boolean"
        }
      }
    ]
  },
  execute: calculateCanonicalLinkRelChecker,
});
export const runCanonicalLinkRelChecker = canonicalLinkRelCheckerTool.execute;
export default canonicalLinkRelCheckerTool;
