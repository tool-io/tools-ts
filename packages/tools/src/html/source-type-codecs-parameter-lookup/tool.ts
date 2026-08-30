import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { asciiLower, escapeAttribute } from "../void-elements-list-checker/tool.js";
export type SourceTypeCodecsParameterLookupInput = {
  readonly mediaType: string;
  readonly codecs: ReadonlyArray<string>;
};
export type SourceTypeCodecsParameterLookupOutput = {
  readonly typeValue: string;
  readonly attribute: string;
};
export const sourceTypeCodecsParameterLookupInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "mediaType": {
      "type": "string",
      "maxLength": 200,
      "description": "Media Type"
    },
    "codecs": {
      "type": "array",
      "items": {
        "type": "string",
        "maxLength": 200
      },
      "minItems": 1,
      "maxItems": 100,
      "description": "Codecs"
    }
  },
  "required": [
    "mediaType",
    "codecs"
  ]
} as const satisfies ToolJsonSchema;
export const sourceTypeCodecsParameterLookupOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "typeValue": {
      "type": "string",
      "description": "Type Value"
    },
    "attribute": {
      "type": "string",
      "description": "Attribute"
    }
  },
  "required": [
    "typeValue",
    "attribute"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.rfc-editor.org/rfc/rfc6381; https://html.spec.whatwg.org/multipage/embedded-content.html#attr-source-type
export const calculateSourceTypeCodecsParameterLookup = (rawInput: unknown): ToolResult<SourceTypeCodecsParameterLookupOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly mediaType?: unknown; readonly codecs?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "mediaType",
  "codecs"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const mediaTypeValue = candidate.mediaType;
if (typeof mediaTypeValue !== "string") return issue("mediaType", "invalid_type", "Enter a string value.");
if (mediaTypeValue.length > 200) return issue("mediaType", "resource_limit", "Text exceeds the 200-character resource limit.");
const codecsValue = candidate.codecs;
if (!Array.isArray(codecsValue)) return issue("codecs", "invalid_type", "Enter a dense array.");
if (codecsValue.length < 1) return issue("codecs", "out_of_range", "Too few entries.");
if (codecsValue.length > 100) return issue("codecs", "resource_limit", "Array exceeds the 100-entry resource limit.");
const validatedCodecs: string[] = [];
for (let index = 0; index < codecsValue.length; index++) {
if (!Object.prototype.hasOwnProperty.call(codecsValue, index)) return issue(`codecs.${index}`, "invalid_type", "Sparse arrays are not supported.");
const item: unknown = codecsValue[index];
if (typeof item !== "string") return issue(`codecs.${index}`, "invalid_type", "Enter a string value.");
if (item.length > 200) return issue(`codecs.${index}`, "resource_limit", "Text exceeds the 200-character resource limit.");
validatedCodecs.push(item);
}
if (validatedCodecs.reduce((total, cell) => total + cell.length, 0) > 100000) return issue("codecs", "resource_limit", "Combined cell text exceeds 100,000 UTF-16 code units.");
  const input: SourceTypeCodecsParameterLookupInput = { mediaType: mediaTypeValue, codecs: validatedCodecs };
 if (!/^[A-Za-z0-9!#$%&'*+.^_`|~-]+\/[A-Za-z0-9!#$%&'*+.^_`|~-]+$(?![\s\S])/.test(input.mediaType)) return issue("mediaType", "invalid_format", "Enter a MIME type without parameters.");
 for (let index = 0; index < input.codecs.length; index++) if (!/^[A-Za-z0-9][A-Za-z0-9._-]*$(?![\s\S])/.test(input.codecs[index] ?? "")) return issue(`codecs.${index}`, "invalid_format", "Enter a codec identifier in the supported profile.");
 const typeValue = `${asciiLower(input.mediaType)}; codecs="${input.codecs.join(",")}"`;
 return toolSuccess({ typeValue, attribute: `type="${escapeAttribute(typeValue)}"` });
};
export const example = {
  "input": {
    "mediaType": "video/mp4",
    "codecs": [
      "avc1.42E01E",
      "mp4a.40.2"
    ]
  },
  "output": {
    "typeValue": "video/mp4; codecs=\"avc1.42E01E,mp4a.40.2\"",
    "attribute": "type=\"video/mp4; codecs=&quot;avc1.42E01E,mp4a.40.2&quot;\""
  }
} satisfies ToolExample<SourceTypeCodecsParameterLookupInput, SourceTypeCodecsParameterLookupOutput>;
export const sourceTypeCodecsParameterLookupTool = defineTool<SourceTypeCodecsParameterLookupInput, SourceTypeCodecsParameterLookupOutput>({
  id: "html/source-type-codecs-parameter-lookup",
  title: "source type codecs Parameter Lookup",
  description: "Builds a source MIME type with a quoted codecs parameter from a restricted codec-identifier profile (ASCII letters, digits, dot, underscore and hyphen). It does not identify or guarantee browser codec support.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: sourceTypeCodecsParameterLookupInputSchema,
  outputSchema: sourceTypeCodecsParameterLookupOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "mediaType",
        "label": "Media Type",
        "required": true,
        "valueType": {
          "type": "string"
        }
      },
      {
        "id": "codecs",
        "label": "Codecs",
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
        "id": "typeValue",
        "label": "Type Value",
        "valueType": {
          "type": "string"
        }
      },
      {
        "id": "attribute",
        "label": "Attribute",
        "valueType": {
          "type": "string"
        }
      }
    ]
  },
  execute: calculateSourceTypeCodecsParameterLookup,
});
export const runSourceTypeCodecsParameterLookup = sourceTypeCodecsParameterLookupTool.execute;
export default sourceTypeCodecsParameterLookupTool;
