import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type PictureSourceArtDirectionOrderInput = {
  readonly mediaMatches: ReadonlyArray<boolean>;
  readonly formatSupported: ReadonlyArray<boolean>;
  readonly hasFallbackImg: boolean;
};
export type PictureSourceArtDirectionOrderOutput = {
  readonly sourceIndex: number;
  readonly usesFallback: boolean;
  readonly hasSelectedElement: boolean;
};
export const pictureSourceArtDirectionOrderInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "mediaMatches": {
      "type": "array",
      "items": {
        "type": "boolean"
      },
      "minItems": 0,
      "maxItems": 10000,
      "description": "Media Matches"
    },
    "formatSupported": {
      "type": "array",
      "items": {
        "type": "boolean"
      },
      "minItems": 0,
      "maxItems": 10000,
      "description": "Format Supported"
    },
    "hasFallbackImg": {
      "type": "boolean",
      "description": "Has Fallback Img"
    }
  },
  "required": [
    "mediaMatches",
    "formatSupported",
    "hasFallbackImg"
  ]
} as const satisfies ToolJsonSchema;
export const pictureSourceArtDirectionOrderOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "sourceIndex": {
      "type": "integer",
      "minimum": -1,
      "maximum": 9007199254740991,
      "description": "Source Index"
    },
    "usesFallback": {
      "type": "boolean",
      "description": "Uses Fallback"
    },
    "hasSelectedElement": {
      "type": "boolean",
      "description": "Has Selected Element"
    }
  },
  "required": [
    "sourceIndex",
    "usesFallback",
    "hasSelectedElement"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://html.spec.whatwg.org/multipage/images.html#updating-the-source-set
export const calculatePictureSourceArtDirectionOrder = (rawInput: unknown): ToolResult<PictureSourceArtDirectionOrderOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly mediaMatches?: unknown; readonly formatSupported?: unknown; readonly hasFallbackImg?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "mediaMatches",
  "formatSupported",
  "hasFallbackImg"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const mediaMatchesValue = candidate.mediaMatches;
if (!Array.isArray(mediaMatchesValue)) return issue("mediaMatches", "invalid_type", "Enter a dense array.");
if (mediaMatchesValue.length < 0) return issue("mediaMatches", "out_of_range", "Too few entries.");
if (mediaMatchesValue.length > 10000) return issue("mediaMatches", "resource_limit", "Array exceeds the 10000-entry resource limit.");
const validatedMediamatches: boolean[] = [];
for (let index = 0; index < mediaMatchesValue.length; index++) {
if (!Object.prototype.hasOwnProperty.call(mediaMatchesValue, index)) return issue(`mediaMatches.${index}`, "invalid_type", "Sparse arrays are not supported.");
const item: unknown = mediaMatchesValue[index];
if (typeof item !== "boolean") return issue(`mediaMatches.${index}`, "invalid_type", "Enter a boolean value.");
validatedMediamatches.push(item);
}
const formatSupportedValue = candidate.formatSupported;
if (!Array.isArray(formatSupportedValue)) return issue("formatSupported", "invalid_type", "Enter a dense array.");
if (formatSupportedValue.length < 0) return issue("formatSupported", "out_of_range", "Too few entries.");
if (formatSupportedValue.length > 10000) return issue("formatSupported", "resource_limit", "Array exceeds the 10000-entry resource limit.");
const validatedFormatsupported: boolean[] = [];
for (let index = 0; index < formatSupportedValue.length; index++) {
if (!Object.prototype.hasOwnProperty.call(formatSupportedValue, index)) return issue(`formatSupported.${index}`, "invalid_type", "Sparse arrays are not supported.");
const item: unknown = formatSupportedValue[index];
if (typeof item !== "boolean") return issue(`formatSupported.${index}`, "invalid_type", "Enter a boolean value.");
validatedFormatsupported.push(item);
}
const hasFallbackImgValue = candidate.hasFallbackImg;
if (typeof hasFallbackImgValue !== "boolean") return issue("hasFallbackImg", "invalid_type", "Enter a boolean value.");
  const input: PictureSourceArtDirectionOrderInput = { mediaMatches: validatedMediamatches, formatSupported: validatedFormatsupported, hasFallbackImg: hasFallbackImgValue };
 if (input.mediaMatches.length !== input.formatSupported.length) return issue("formatSupported", "length_mismatch", "Source flags must have equal lengths.");
 const sourceIndex = input.mediaMatches.findIndex((matches, index) => matches && input.formatSupported[index] === true);
 return toolSuccess({ sourceIndex, usesFallback: sourceIndex < 0 && input.hasFallbackImg, hasSelectedElement: sourceIndex >= 0 || input.hasFallbackImg });
};
export const example = {
  "input": {
    "mediaMatches": [
      true,
      true,
      true
    ],
    "formatSupported": [
      false,
      true,
      true
    ],
    "hasFallbackImg": true
  },
  "output": {
    "sourceIndex": 1,
    "usesFallback": false,
    "hasSelectedElement": true
  }
} satisfies ToolExample<PictureSourceArtDirectionOrderInput, PictureSourceArtDirectionOrderOutput>;
export const pictureSourceArtDirectionOrderTool = defineTool<PictureSourceArtDirectionOrderInput, PictureSourceArtDirectionOrderOutput>({
  id: "html/picture-source-art-direction-order",
  title: "picture/source Art Direction Order",
  description: "Chooses the first eligible picture source in document order from supplied media-match and format-support flags. Supply only source elements before the fallback img that have usable source sets. Reports selected element presence without fetching or selecting image candidates.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: pictureSourceArtDirectionOrderInputSchema,
  outputSchema: pictureSourceArtDirectionOrderOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "mediaMatches",
        "label": "Media Matches",
        "required": true,
        "valueType": {
          "type": "list",
          "items": {
            "type": "boolean"
          }
        }
      },
      {
        "id": "formatSupported",
        "label": "Format Supported",
        "required": true,
        "valueType": {
          "type": "list",
          "items": {
            "type": "boolean"
          }
        }
      },
      {
        "id": "hasFallbackImg",
        "label": "Has Fallback Img",
        "required": true,
        "valueType": {
          "type": "boolean"
        }
      }
    ],
    "outputs": [
      {
        "id": "sourceIndex",
        "label": "Source Index",
        "valueType": {
          "type": "integer"
        }
      },
      {
        "id": "usesFallback",
        "label": "Uses Fallback",
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "hasSelectedElement",
        "label": "Has Selected Element",
        "valueType": {
          "type": "boolean"
        }
      }
    ]
  },
  execute: calculatePictureSourceArtDirectionOrder,
});
export const runPictureSourceArtDirectionOrder = pictureSourceArtDirectionOrderTool.execute;
export default pictureSourceArtDirectionOrderTool;
