import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type ViewportMetaWidthDeviceCheckerInput = {
  readonly content: string;
};
export type ViewportMetaWidthDeviceCheckerOutput = {
  readonly hasDeviceWidth: boolean;
  readonly widthDirectiveCount: number;
};
export const viewportMetaWidthDeviceCheckerInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "content": {
      "type": "string",
      "maxLength": 100000,
      "description": "Content"
    }
  },
  "required": [
    "content"
  ]
} as const satisfies ToolJsonSchema;
export const viewportMetaWidthDeviceCheckerOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "hasDeviceWidth": {
      "type": "boolean",
      "description": "Has Device Width"
    },
    "widthDirectiveCount": {
      "type": "integer",
      "minimum": 0,
      "maximum": 9007199254740991,
      "description": "Width Directive Count"
    }
  },
  "required": [
    "hasDeviceWidth",
    "widthDirectiveCount"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://drafts.csswg.org/css-viewport/#viewport-meta
export const calculateViewportMetaWidthDeviceChecker = (rawInput: unknown): ToolResult<ViewportMetaWidthDeviceCheckerOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly content?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "content"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const contentValue = candidate.content;
if (typeof contentValue !== "string") return issue("content", "invalid_type", "Enter a string value.");
if (contentValue.length > 100000) return issue("content", "resource_limit", "Text exceeds the 100000-character resource limit.");
  const input: ViewportMetaWidthDeviceCheckerInput = { content: contentValue };
 const widths = input.content.split(/[,;]/).map(part => part.replace(/^[\t\n\f\r ]+|[\t\n\f\r ]+$/g, "")).filter(part => /^width[\t\n\f\r ]*=/i.test(part));
 const hasDeviceWidth = widths.some(part => /^width[\t\n\f\r ]*=[\t\n\f\r ]*device-width$(?![\s\S])/i.test(part));
 return toolSuccess({ hasDeviceWidth, widthDirectiveCount: widths.length });
};
export const example = {
  "input": {
    "content": "width=device-width, initial-scale=1"
  },
  "output": {
    "hasDeviceWidth": true,
    "widthDirectiveCount": 1
  }
} satisfies ToolExample<ViewportMetaWidthDeviceCheckerInput, ViewportMetaWidthDeviceCheckerOutput>;
export const viewportMetaWidthDeviceCheckerTool = defineTool<ViewportMetaWidthDeviceCheckerInput, ViewportMetaWidthDeviceCheckerOutput>({
  id: "html/viewport-meta-width-device-checker",
  title: "Viewport Meta width=device-width Check",
  description: "Detects an explicit width=device-width directive in viewport content split on commas or semicolons. Reports duplicate width directives rather than simulating browser viewport resolution.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: viewportMetaWidthDeviceCheckerInputSchema,
  outputSchema: viewportMetaWidthDeviceCheckerOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "content",
        "label": "Content",
        "required": true,
        "valueType": {
          "type": "string"
        }
      }
    ],
    "outputs": [
      {
        "id": "hasDeviceWidth",
        "label": "Has Device Width",
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "widthDirectiveCount",
        "label": "Width Directive Count",
        "valueType": {
          "type": "integer"
        }
      }
    ]
  },
  execute: calculateViewportMetaWidthDeviceChecker,
});
export const runViewportMetaWidthDeviceChecker = viewportMetaWidthDeviceCheckerTool.execute;
export default viewportMetaWidthDeviceCheckerTool;
