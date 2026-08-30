import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { asciiLower, htmlTokens } from "../void-elements-list-checker/tool.js";
export type ManifestLinkRelLookupInput = {
  readonly rel: string;
  readonly href: string;
};
export type ManifestLinkRelLookupOutput = {
  readonly manifestRelation: boolean;
  readonly nonemptyHref: boolean;
  readonly passes: boolean;
};
export const manifestLinkRelLookupInputSchema = {
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
export const manifestLinkRelLookupOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "manifestRelation": {
      "type": "boolean",
      "description": "Manifest Relation"
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
    "manifestRelation",
    "nonemptyHref",
    "passes"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://html.spec.whatwg.org/multipage/links.html#link-type-manifest
export const calculateManifestLinkRelLookup = (rawInput: unknown): ToolResult<ManifestLinkRelLookupOutput> => {
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
  const input: ManifestLinkRelLookupInput = { rel: relValue, href: hrefValue };
 const manifestRelation = htmlTokens(input.rel).map(asciiLower).includes("manifest");
 const nonemptyHref = htmlTokens(input.href).length > 0;
 return toolSuccess({ manifestRelation, nonemptyHref, passes: manifestRelation && nonemptyHref });
};
export const example = {
  "input": {
    "rel": "MANIFEST",
    "href": "/app.webmanifest"
  },
  "output": {
    "manifestRelation": true,
    "nonemptyHref": true,
    "passes": true
  }
} satisfies ToolExample<ManifestLinkRelLookupInput, ManifestLinkRelLookupOutput>;
export const manifestLinkRelLookupTool = defineTool<ManifestLinkRelLookupInput, ManifestLinkRelLookupOutput>({
  id: "html/manifest-link-rel-lookup",
  title: "Web App Manifest link rel Lookup",
  description: "Checks a parsed link for the manifest relation and a nonempty href. This local check does not fetch or validate the manifest document.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: manifestLinkRelLookupInputSchema,
  outputSchema: manifestLinkRelLookupOutputSchema,
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
        "id": "manifestRelation",
        "label": "Manifest Relation",
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
  execute: calculateManifestLinkRelLookup,
});
export const runManifestLinkRelLookup = manifestLinkRelLookupTool.execute;
export default manifestLinkRelLookupTool;
