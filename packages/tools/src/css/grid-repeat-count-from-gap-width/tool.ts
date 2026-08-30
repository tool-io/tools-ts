import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type GridRepeatCountFromGapWidthInput = {
  readonly containerWidth: number;
  readonly trackWidth: number;
  readonly gap: number;
};
export type GridRepeatCountFromGapWidthOutput = {
  readonly fitCount: number;
  readonly repeatCount: number;
  readonly oneTrackOverflows: boolean;
};
export const gridRepeatCountFromGapWidthInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "containerWidth": {
      "type": "number",
      "minimum": 0,
      "description": "Container width"
    },
    "trackWidth": {
      "type": "number",
      "exclusiveMinimum": 0,
      "description": "Fixed track width"
    },
    "gap": {
      "type": "number",
      "minimum": 0,
      "description": "Track gap"
    }
  },
  "required": [
    "containerWidth",
    "trackWidth",
    "gap"
  ]
} as const satisfies ToolJsonSchema;
export const gridRepeatCountFromGapWidthOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "fitCount": {
      "type": "integer",
      "minimum": 0,
      "maximum": 9007199254740991,
      "description": "Fit count"
    },
    "repeatCount": {
      "type": "integer",
      "minimum": 1,
      "maximum": 9007199254740991,
      "description": "Repeat count"
    },
    "oneTrackOverflows": {
      "type": "boolean",
      "description": "One track overflows"
    }
  },
  "required": [
    "fitCount",
    "repeatCount",
    "oneTrackOverflows"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.w3.org/TR/css-grid-1/#auto-repeat
export const calculateGridRepeatCountFromGapWidth = (rawInput: unknown): ToolResult<GridRepeatCountFromGapWidthOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly containerWidth?: unknown; readonly trackWidth?: unknown; readonly gap?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "containerWidth",
  "trackWidth",
  "gap"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const containerWidthValue = candidate.containerWidth;
  if (typeof containerWidthValue !== "number" || !Number.isFinite(containerWidthValue)) return issue("containerWidth", "invalid_type", "Enter a finite number.");
  if (containerWidthValue < 0) return issue("containerWidth", "out_of_range", "Value is outside the accepted range.");
  const trackWidthValue = candidate.trackWidth;
  if (typeof trackWidthValue !== "number" || !Number.isFinite(trackWidthValue)) return issue("trackWidth", "invalid_type", "Enter a finite number.");
  const gapValue = candidate.gap;
  if (typeof gapValue !== "number" || !Number.isFinite(gapValue)) return issue("gap", "invalid_type", "Enter a finite number.");
  if (gapValue < 0) return issue("gap", "out_of_range", "Value is outside the accepted range.");
  const input: GridRepeatCountFromGapWidthInput = { containerWidth: containerWidthValue, trackWidth: trackWidthValue, gap: gapValue };
  if (input.trackWidth <= 0) return issue("trackWidth", "positive_width", "Track width must be positive.");
  const scale = Math.max(input.containerWidth, input.trackWidth, input.gap);
  const quotient = (input.containerWidth / scale + input.gap / scale) / (input.trackWidth / scale + input.gap / scale);
  let fitCount = Math.floor(quotient);
  if (!Number.isSafeInteger(fitCount)) return issue("trackWidth", "count_range", "Track count exceeds safe integer precision.");
  if (fitCount > 0 && fitCount * input.trackWidth + (fitCount - 1) * input.gap > input.containerWidth) fitCount--;
  return toolSuccess({ fitCount, repeatCount: Math.max(1, fitCount), oneTrackOverflows: input.trackWidth > input.containerWidth });
};
export const example = {
  input: {
    "containerWidth": 1000,
    "trackWidth": 200,
    "gap": 20
  },
  output: {
    "fitCount": 4,
    "repeatCount": 4,
    "oneTrackOverflows": false
  },
} satisfies ToolExample<GridRepeatCountFromGapWidthInput, GridRepeatCountFromGapWidthOutput>;
export const gridRepeatCountFromGapWidthTool = defineTool<GridRepeatCountFromGapWidthInput, GridRepeatCountFromGapWidthOutput>({
  id: "css/grid-repeat-count-from-gap-width",
  title: "Grid repeat() Count From Gap & Width",
  description: "Calculate how many fixed-width grid tracks fit a definite container including gaps, and the CSS auto-repeat count of at least one; intrinsic sizing and flexible tracks are excluded.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: gridRepeatCountFromGapWidthInputSchema,
  outputSchema: gridRepeatCountFromGapWidthOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "containerWidth",
        "label": "Container width",
        "required": true,
        "valueType": {
          "type": "number",
          "unit": "px"
        }
      },
      {
        "id": "trackWidth",
        "label": "Fixed track width",
        "required": true,
        "valueType": {
          "type": "number",
          "unit": "px"
        }
      },
      {
        "id": "gap",
        "label": "Track gap",
        "required": true,
        "valueType": {
          "type": "number",
          "unit": "px"
        }
      }
    ],
    "outputs": [
      {
        "id": "fitCount",
        "label": "Fit count",
        "valueType": {
          "type": "integer"
        }
      },
      {
        "id": "repeatCount",
        "label": "Repeat count",
        "valueType": {
          "type": "integer"
        }
      },
      {
        "id": "oneTrackOverflows",
        "label": "One track overflows",
        "valueType": {
          "type": "boolean"
        }
      }
    ]
  },
  execute: calculateGridRepeatCountFromGapWidth,
});
export const runGridRepeatCountFromGapWidth = gridRepeatCountFromGapWidthTool.execute;
export default gridRepeatCountFromGapWidthTool;
