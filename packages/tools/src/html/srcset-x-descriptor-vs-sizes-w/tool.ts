import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type SrcsetXDescriptorVsSizesWInput = {
  readonly descriptor: string;
};
export type SrcsetXDescriptorVsSizesWOutput = {
  readonly kind: "width" | "density" | "invalid";
  readonly value: number;
  readonly usesSizes: boolean;
  readonly valid: boolean;
};
export const srcsetXDescriptorVsSizesWInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "descriptor": {
      "type": "string",
      "maxLength": 1000,
      "description": "Descriptor"
    }
  },
  "required": [
    "descriptor"
  ]
} as const satisfies ToolJsonSchema;
export const srcsetXDescriptorVsSizesWOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "kind": {
      "type": "string",
      "enum": [
        "width",
        "density",
        "invalid"
      ],
      "description": "Kind"
    },
    "value": {
      "type": "number",
      "minimum": 0,
      "description": "Value"
    },
    "usesSizes": {
      "type": "boolean",
      "description": "Uses Sizes"
    },
    "valid": {
      "type": "boolean",
      "description": "Valid"
    }
  },
  "required": [
    "kind",
    "value",
    "usesSizes",
    "valid"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://html.spec.whatwg.org/multipage/images.html#srcset-attributes
export const calculateSrcsetXDescriptorVsSizesW = (rawInput: unknown): ToolResult<SrcsetXDescriptorVsSizesWOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly descriptor?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "descriptor"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const descriptorValue = candidate.descriptor;
if (typeof descriptorValue !== "string") return issue("descriptor", "invalid_type", "Enter a string value.");
if (descriptorValue.length > 1000) return issue("descriptor", "resource_limit", "Text exceeds the 1000-character resource limit.");
  const input: SrcsetXDescriptorVsSizesWInput = { descriptor: descriptorValue };
 const descriptor = input.descriptor;
 if (descriptor === "") return toolSuccess({ kind: "density", value: 1, usesSizes: false, valid: true });
 const width = /^[0-9]+w$(?![\s\S])/.test(descriptor);
 const density = /^(?:[0-9]+(?:\.[0-9]+)?|\.[0-9]+)(?:[eE][+-]?[0-9]+)?x$(?![\s\S])/.test(descriptor);
 const value = width || density ? Number(descriptor.slice(0, -1)) : 0;
 const valid = value > 0 && Number.isFinite(value) && (!width || Number.isSafeInteger(value));
 return toolSuccess({ kind: valid ? width ? "width" : "density" : "invalid", value: valid ? value : 0, usesSizes: valid && width, valid });
};
export const example = {
  "input": {
    "descriptor": "640w"
  },
  "output": {
    "kind": "width",
    "value": 640,
    "usesSizes": true,
    "valid": true
  }
} satisfies ToolExample<SrcsetXDescriptorVsSizesWInput, SrcsetXDescriptorVsSizesWOutput>;
export const srcsetXDescriptorVsSizesWTool = defineTool<SrcsetXDescriptorVsSizesWInput, SrcsetXDescriptorVsSizesWOutput>({
  id: "html/srcset-x-descriptor-vs-sizes-w",
  title: "srcset x-Descriptor vs sizes w",
  description: "Classifies a single srcset descriptor using conforming author syntax. Empty descriptor means 1x; width is a positive safe integer and density a positive finite float. Width descriptors use sizes, while density descriptors do not.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: srcsetXDescriptorVsSizesWInputSchema,
  outputSchema: srcsetXDescriptorVsSizesWOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "descriptor",
        "label": "Descriptor",
        "required": true,
        "valueType": {
          "type": "string"
        }
      }
    ],
    "outputs": [
      {
        "id": "kind",
        "label": "Kind",
        "valueType": {
          "type": "string"
        }
      },
      {
        "id": "value",
        "label": "Value",
        "valueType": {
          "type": "number"
        }
      },
      {
        "id": "usesSizes",
        "label": "Uses Sizes",
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "valid",
        "label": "Valid",
        "valueType": {
          "type": "boolean"
        }
      }
    ]
  },
  execute: calculateSrcsetXDescriptorVsSizesW,
});
export const runSrcsetXDescriptorVsSizesW = srcsetXDescriptorVsSizesWTool.execute;
export default srcsetXDescriptorVsSizesWTool;
