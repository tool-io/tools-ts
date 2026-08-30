import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type LogicalPropertyMappingInlineStartInput = {
  readonly writingMode: "horizontal-tb" | "vertical-rl" | "vertical-lr";
  readonly direction: "ltr" | "rtl";
};
export type LogicalPropertyMappingInlineStartOutput = {
  readonly physicalSide: "top" | "right" | "bottom" | "left";
};
export const logicalPropertyMappingInlineStartInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "writingMode": {
      "type": "string",
      "enum": [
        "horizontal-tb",
        "vertical-rl",
        "vertical-lr"
      ],
      "description": "Writing mode"
    },
    "direction": {
      "type": "string",
      "enum": [
        "ltr",
        "rtl"
      ],
      "description": "Text direction"
    }
  },
  "required": [
    "writingMode",
    "direction"
  ]
} as const satisfies ToolJsonSchema;
export const logicalPropertyMappingInlineStartOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "physicalSide": {
      "type": "string",
      "enum": [
        "top",
        "right",
        "bottom",
        "left"
      ],
      "description": "Physical inline-start side"
    }
  },
  "required": [
    "physicalSide"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);
export const logicalSides = (writingMode: "horizontal-tb" | "vertical-rl" | "vertical-lr", direction: "ltr" | "rtl") => {
  const inlineStart = writingMode === "horizontal-tb" ? (direction === "ltr" ? "left" : "right") : (direction === "ltr" ? "top" : "bottom");
  const inlineEnd = writingMode === "horizontal-tb" ? (direction === "ltr" ? "right" : "left") : (direction === "ltr" ? "bottom" : "top");
  const blockStart = writingMode === "horizontal-tb" ? "top" : writingMode === "vertical-rl" ? "right" : "left";
  const blockEnd = writingMode === "horizontal-tb" ? "bottom" : writingMode === "vertical-rl" ? "left" : "right";
  return { inlineStart, inlineEnd, blockStart, blockEnd } as const;
};
// Reference: https://www.w3.org/TR/css-writing-modes-3/#logical-to-physical
export const calculateLogicalPropertyMappingInlineStart = (rawInput: unknown): ToolResult<LogicalPropertyMappingInlineStartOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly writingMode?: unknown; readonly direction?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "writingMode",
  "direction"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const writingModeValue = candidate.writingMode;
  if (typeof writingModeValue !== "string") return issue("writingMode", "invalid_type", "Enter a string value.");
  if (writingModeValue !== "horizontal-tb" && writingModeValue !== "vertical-rl" && writingModeValue !== "vertical-lr") return issue("writingMode", "invalid_value", "Choose a supported value.");
  const directionValue = candidate.direction;
  if (typeof directionValue !== "string") return issue("direction", "invalid_type", "Enter a string value.");
  if (directionValue !== "ltr" && directionValue !== "rtl") return issue("direction", "invalid_value", "Choose a supported value.");

  const input: LogicalPropertyMappingInlineStartInput = { writingMode: writingModeValue, direction: directionValue };
  return toolSuccess({ physicalSide: logicalSides(input.writingMode, input.direction).inlineStart });
};
export const example = {
  input: {
    "writingMode": "horizontal-tb",
    "direction": "rtl"
  },
  output: {
    "physicalSide": "right"
  },
} satisfies ToolExample<LogicalPropertyMappingInlineStartInput, LogicalPropertyMappingInlineStartOutput>;
export const logicalPropertyMappingInlineStartTool = defineTool<LogicalPropertyMappingInlineStartInput, LogicalPropertyMappingInlineStartOutput>({
  id: "css/logical-property-mapping-inline-start",
  title: "Logical Property inline-start Mapping",
  description: "Map inline-start to a physical side for horizontal or vertical writing modes and text direction.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: logicalPropertyMappingInlineStartInputSchema,
  outputSchema: logicalPropertyMappingInlineStartOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "writingMode",
        "label": "Writing mode",
        "required": true,
        "valueType": {
          "type": "string"
        }
      },
      {
        "id": "direction",
        "label": "Text direction",
        "required": true,
        "valueType": {
          "type": "string"
        }
      }
    ],
    "outputs": [
      {
        "id": "physicalSide",
        "label": "Physical inline-start side",
        "valueType": {
          "type": "string"
        }
      }
    ]
  },
  execute: calculateLogicalPropertyMappingInlineStart,
});
export const runLogicalPropertyMappingInlineStart = logicalPropertyMappingInlineStartTool.execute;
export default logicalPropertyMappingInlineStartTool;
