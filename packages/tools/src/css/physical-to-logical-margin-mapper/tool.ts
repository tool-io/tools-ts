import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { logicalSides } from "../logical-property-mapping-inline-start/tool.js";
export type PhysicalToLogicalMarginMapperInput = {
  readonly writingMode: "horizontal-tb" | "vertical-rl" | "vertical-lr";
  readonly direction: "ltr" | "rtl";
  readonly top: number;
  readonly right: number;
  readonly bottom: number;
  readonly left: number;
};
export type PhysicalToLogicalMarginMapperOutput = {
  readonly inlineStart: number;
  readonly inlineEnd: number;
  readonly blockStart: number;
  readonly blockEnd: number;
};
export const physicalToLogicalMarginMapperInputSchema = {
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
    },
    "top": {
      "type": "number",
      "description": "Top margin"
    },
    "right": {
      "type": "number",
      "description": "Right margin"
    },
    "bottom": {
      "type": "number",
      "description": "Bottom margin"
    },
    "left": {
      "type": "number",
      "description": "Left margin"
    }
  },
  "required": [
    "writingMode",
    "direction",
    "top",
    "right",
    "bottom",
    "left"
  ]
} as const satisfies ToolJsonSchema;
export const physicalToLogicalMarginMapperOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "inlineStart": {
      "type": "number",
      "description": "Inline start margin"
    },
    "inlineEnd": {
      "type": "number",
      "description": "Inline end margin"
    },
    "blockStart": {
      "type": "number",
      "description": "Block start margin"
    },
    "blockEnd": {
      "type": "number",
      "description": "Block end margin"
    }
  },
  "required": [
    "inlineStart",
    "inlineEnd",
    "blockStart",
    "blockEnd"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.w3.org/TR/css-writing-modes-3/#logical-to-physical
export const calculatePhysicalToLogicalMarginMapper = (rawInput: unknown): ToolResult<PhysicalToLogicalMarginMapperOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly writingMode?: unknown; readonly direction?: unknown; readonly top?: unknown; readonly right?: unknown; readonly bottom?: unknown; readonly left?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "writingMode",
  "direction",
  "top",
  "right",
  "bottom",
  "left"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const writingModeValue = candidate.writingMode;
  if (typeof writingModeValue !== "string") return issue("writingMode", "invalid_type", "Enter a string value.");
  if (writingModeValue !== "horizontal-tb" && writingModeValue !== "vertical-rl" && writingModeValue !== "vertical-lr") return issue("writingMode", "invalid_value", "Choose a supported value.");
  const directionValue = candidate.direction;
  if (typeof directionValue !== "string") return issue("direction", "invalid_type", "Enter a string value.");
  if (directionValue !== "ltr" && directionValue !== "rtl") return issue("direction", "invalid_value", "Choose a supported value.");
  const topValue = candidate.top;
  if (typeof topValue !== "number" || !Number.isFinite(topValue)) return issue("top", "invalid_type", "Enter a finite number.");
  const rightValue = candidate.right;
  if (typeof rightValue !== "number" || !Number.isFinite(rightValue)) return issue("right", "invalid_type", "Enter a finite number.");
  const bottomValue = candidate.bottom;
  if (typeof bottomValue !== "number" || !Number.isFinite(bottomValue)) return issue("bottom", "invalid_type", "Enter a finite number.");
  const leftValue = candidate.left;
  if (typeof leftValue !== "number" || !Number.isFinite(leftValue)) return issue("left", "invalid_type", "Enter a finite number.");

  const input: PhysicalToLogicalMarginMapperInput = { writingMode: writingModeValue, direction: directionValue, top: topValue, right: rightValue, bottom: bottomValue, left: leftValue };
  const sides = logicalSides(input.writingMode, input.direction);
  return toolSuccess({ inlineStart: input[sides.inlineStart], inlineEnd: input[sides.inlineEnd], blockStart: input[sides.blockStart], blockEnd: input[sides.blockEnd] });
};
export const example = {
  input: {
    "writingMode": "vertical-rl",
    "direction": "ltr",
    "top": 1,
    "right": 2,
    "bottom": 3,
    "left": 4
  },
  output: {
    "inlineStart": 1,
    "inlineEnd": 3,
    "blockStart": 2,
    "blockEnd": 4
  },
} satisfies ToolExample<PhysicalToLogicalMarginMapperInput, PhysicalToLogicalMarginMapperOutput>;
export const physicalToLogicalMarginMapperTool = defineTool<PhysicalToLogicalMarginMapperInput, PhysicalToLogicalMarginMapperOutput>({
  id: "css/physical-to-logical-margin-mapper",
  title: "Physical\u2192Logical Margin Mapper",
  description: "Map four finite physical pixel margins to inline and block sides using writing mode and text direction.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: physicalToLogicalMarginMapperInputSchema,
  outputSchema: physicalToLogicalMarginMapperOutputSchema,
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
      },
      {
        "id": "top",
        "label": "Top margin",
        "required": true,
        "valueType": {
          "type": "number",
          "unit": "px"
        }
      },
      {
        "id": "right",
        "label": "Right margin",
        "required": true,
        "valueType": {
          "type": "number",
          "unit": "px"
        }
      },
      {
        "id": "bottom",
        "label": "Bottom margin",
        "required": true,
        "valueType": {
          "type": "number",
          "unit": "px"
        }
      },
      {
        "id": "left",
        "label": "Left margin",
        "required": true,
        "valueType": {
          "type": "number",
          "unit": "px"
        }
      }
    ],
    "outputs": [
      {
        "id": "inlineStart",
        "label": "Inline start margin",
        "valueType": {
          "type": "number",
          "unit": "px"
        }
      },
      {
        "id": "inlineEnd",
        "label": "Inline end margin",
        "valueType": {
          "type": "number",
          "unit": "px"
        }
      },
      {
        "id": "blockStart",
        "label": "Block start margin",
        "valueType": {
          "type": "number",
          "unit": "px"
        }
      },
      {
        "id": "blockEnd",
        "label": "Block end margin",
        "valueType": {
          "type": "number",
          "unit": "px"
        }
      }
    ]
  },
  execute: calculatePhysicalToLogicalMarginMapper,
});
export const runPhysicalToLogicalMarginMapper = physicalToLogicalMarginMapperTool.execute;
export default physicalToLogicalMarginMapperTool;
