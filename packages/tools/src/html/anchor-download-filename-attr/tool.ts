import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { escapeAttribute } from "../void-elements-list-checker/tool.js";
export type AnchorDownloadFilenameAttrInput = {
  readonly filename: string;
};
export type AnchorDownloadFilenameAttrOutput = {
  readonly attribute: string;
  readonly hasSuggestedFilename: boolean;
};
export const anchorDownloadFilenameAttrInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "filename": {
      "type": "string",
      "maxLength": 100000,
      "description": "Filename"
    }
  },
  "required": [
    "filename"
  ]
} as const satisfies ToolJsonSchema;
export const anchorDownloadFilenameAttrOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "attribute": {
      "type": "string",
      "description": "Attribute"
    },
    "hasSuggestedFilename": {
      "type": "boolean",
      "description": "Has Suggested Filename"
    }
  },
  "required": [
    "attribute",
    "hasSuggestedFilename"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://html.spec.whatwg.org/multipage/links.html#attr-hyperlink-download
export const calculateAnchorDownloadFilenameAttr = (rawInput: unknown): ToolResult<AnchorDownloadFilenameAttrOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly filename?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "filename"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const filenameValue = candidate.filename;
if (typeof filenameValue !== "string") return issue("filename", "invalid_type", "Enter a string value.");
if (filenameValue.length > 100000) return issue("filename", "resource_limit", "Text exceeds the 100000-character resource limit.");
  const input: AnchorDownloadFilenameAttrInput = { filename: filenameValue };
 if (/[\u0000\r\n]/.test(input.filename)) return issue("filename", "invalid_format", "Filename must not contain null or line breaks.");
 return toolSuccess({ attribute: `download="${escapeAttribute(input.filename)}"`, hasSuggestedFilename: input.filename.length > 0 });
};
export const example = {
  "input": {
    "filename": "report & \"notes\".csv"
  },
  "output": {
    "attribute": "download=\"report &amp; &quot;notes&quot;.csv\"",
    "hasSuggestedFilename": true
  }
} satisfies ToolExample<AnchorDownloadFilenameAttrInput, AnchorDownloadFilenameAttrOutput>;
export const anchorDownloadFilenameAttrTool = defineTool<AnchorDownloadFilenameAttrInput, AnchorDownloadFilenameAttrOutput>({
  id: "html/anchor-download-filename-attr",
  title: "Anchor download Filename Attr",
  description: "Serializes a suggested filename into a double-quoted anchor download attribute. Empty filename requests downloading without a suggested name. Browser origin policy and filesystem filename sanitization are separate.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: anchorDownloadFilenameAttrInputSchema,
  outputSchema: anchorDownloadFilenameAttrOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "filename",
        "label": "Filename",
        "required": true,
        "valueType": {
          "type": "string"
        }
      }
    ],
    "outputs": [
      {
        "id": "attribute",
        "label": "Attribute",
        "valueType": {
          "type": "string"
        }
      },
      {
        "id": "hasSuggestedFilename",
        "label": "Has Suggested Filename",
        "valueType": {
          "type": "boolean"
        }
      }
    ]
  },
  execute: calculateAnchorDownloadFilenameAttr,
});
export const runAnchorDownloadFilenameAttr = anchorDownloadFilenameAttrTool.execute;
export default anchorDownloadFilenameAttrTool;
