import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type RubyRtRpStructureLookupInput = {
  readonly tag: "ruby" | "rt" | "rp";
};
export type RubyRtRpStructureLookupOutput = {
  readonly role: "container" | "annotation" | "fallback-parentheses";
  readonly directRubyContext: boolean;
};
export const rubyRtRpStructureLookupInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "tag": {
      "type": "string",
      "enum": [
        "ruby",
        "rt",
        "rp"
      ],
      "description": "Tag"
    }
  },
  "required": [
    "tag"
  ]
} as const satisfies ToolJsonSchema;
export const rubyRtRpStructureLookupOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "role": {
      "type": "string",
      "enum": [
        "container",
        "annotation",
        "fallback-parentheses"
      ],
      "description": "Role"
    },
    "directRubyContext": {
      "type": "boolean",
      "description": "Direct Ruby Context"
    }
  },
  "required": [
    "role",
    "directRubyContext"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-ruby-element
export const calculateRubyRtRpStructureLookup = (rawInput: unknown): ToolResult<RubyRtRpStructureLookupOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly tag?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "tag"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const tagValue = candidate.tag;
if (typeof tagValue !== "string") return issue("tag", "invalid_type", "Enter a string value.");
if (tagValue !== "ruby" && tagValue !== "rt" && tagValue !== "rp") return issue("tag", "invalid_value", "Choose a supported value.");
  const input: RubyRtRpStructureLookupInput = { tag: tagValue };
 return toolSuccess({ role: input.tag === "ruby" ? "container" : input.tag === "rt" ? "annotation" : "fallback-parentheses", directRubyContext: input.tag !== "ruby" });
};
export const example = {
  "input": {
    "tag": "rt"
  },
  "output": {
    "role": "annotation",
    "directRubyContext": true
  }
} satisfies ToolExample<RubyRtRpStructureLookupInput, RubyRtRpStructureLookupOutput>;
export const rubyRtRpStructureLookupTool = defineTool<RubyRtRpStructureLookupInput, RubyRtRpStructureLookupOutput>({
  id: "html/ruby-rt-rp-structure-lookup",
  title: "ruby/rt/rp Structure Lookup",
  description: "Classifies ruby as the annotation container, rt as annotation text and rp as fallback parentheses. This vocabulary lookup does not validate a complete ruby content model.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: rubyRtRpStructureLookupInputSchema,
  outputSchema: rubyRtRpStructureLookupOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "tag",
        "label": "Tag",
        "required": true,
        "valueType": {
          "type": "string"
        }
      }
    ],
    "outputs": [
      {
        "id": "role",
        "label": "Role",
        "valueType": {
          "type": "string"
        }
      },
      {
        "id": "directRubyContext",
        "label": "Direct Ruby Context",
        "valueType": {
          "type": "boolean"
        }
      }
    ]
  },
  execute: calculateRubyRtRpStructureLookup,
});
export const runRubyRtRpStructureLookup = rubyRtRpStructureLookupTool.execute;
export default rubyRtRpStructureLookupTool;
