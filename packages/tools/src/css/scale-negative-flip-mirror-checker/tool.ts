import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type ScaleNegativeFlipMirrorCheckerInput = {
  readonly scaleX: number;
  readonly scaleY: number;
};
export type ScaleNegativeFlipMirrorCheckerOutput = {
  readonly horizontalFlip: boolean;
  readonly verticalFlip: boolean;
  readonly reversesOrientation: boolean;
  readonly degenerate: boolean;
};
export const scaleNegativeFlipMirrorCheckerInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "scaleX": {
      "type": "number",
      "description": "Horizontal scale"
    },
    "scaleY": {
      "type": "number",
      "description": "Vertical scale"
    }
  },
  "required": [
    "scaleX",
    "scaleY"
  ]
} as const satisfies ToolJsonSchema;
export const scaleNegativeFlipMirrorCheckerOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "horizontalFlip": {
      "type": "boolean",
      "description": "Horizontal reflection"
    },
    "verticalFlip": {
      "type": "boolean",
      "description": "Vertical reflection"
    },
    "reversesOrientation": {
      "type": "boolean",
      "description": "Orientation reversal"
    },
    "degenerate": {
      "type": "boolean",
      "description": "Collapsed axis"
    }
  },
  "required": [
    "horizontalFlip",
    "verticalFlip",
    "reversesOrientation",
    "degenerate"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.w3.org/TR/css-transforms-1/#funcdef-transform-scale
export const calculateScaleNegativeFlipMirrorChecker = (rawInput: unknown): ToolResult<ScaleNegativeFlipMirrorCheckerOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly scaleX?: unknown; readonly scaleY?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "scaleX",
  "scaleY"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const scaleXValue = candidate.scaleX;
  if (typeof scaleXValue !== "number" || !Number.isFinite(scaleXValue)) return issue("scaleX", "invalid_type", "Enter a finite number.");
  const scaleYValue = candidate.scaleY;
  if (typeof scaleYValue !== "number" || !Number.isFinite(scaleYValue)) return issue("scaleY", "invalid_type", "Enter a finite number.");

  const input: ScaleNegativeFlipMirrorCheckerInput = { scaleX: scaleXValue, scaleY: scaleYValue };
  const degenerate = input.scaleX === 0 || input.scaleY === 0;
  return toolSuccess({ horizontalFlip: input.scaleX < 0, verticalFlip: input.scaleY < 0, reversesOrientation: !degenerate && (input.scaleX < 0) !== (input.scaleY < 0), degenerate });
};
export const example = {
  input: {
    "scaleX": -1,
    "scaleY": 1
  },
  output: {
    "horizontalFlip": true,
    "verticalFlip": false,
    "reversesOrientation": true,
    "degenerate": false
  },
} satisfies ToolExample<ScaleNegativeFlipMirrorCheckerInput, ScaleNegativeFlipMirrorCheckerOutput>;
export const scaleNegativeFlipMirrorCheckerTool = defineTool<ScaleNegativeFlipMirrorCheckerInput, ScaleNegativeFlipMirrorCheckerOutput>({
  id: "css/scale-negative-flip-mirror-checker",
  title: "Negative scale Flip Mirror Check",
  description: "Classify axis reflections, orientation reversal, and collapsed axes of a two-dimensional CSS scale.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: scaleNegativeFlipMirrorCheckerInputSchema,
  outputSchema: scaleNegativeFlipMirrorCheckerOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "scaleX",
        "label": "Horizontal scale",
        "required": true,
        "valueType": {
          "type": "number"
        }
      },
      {
        "id": "scaleY",
        "label": "Vertical scale",
        "required": true,
        "valueType": {
          "type": "number"
        }
      }
    ],
    "outputs": [
      {
        "id": "horizontalFlip",
        "label": "Horizontal reflection",
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "verticalFlip",
        "label": "Vertical reflection",
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "reversesOrientation",
        "label": "Orientation reversal",
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "degenerate",
        "label": "Collapsed axis",
        "valueType": {
          "type": "boolean"
        }
      }
    ]
  },
  execute: calculateScaleNegativeFlipMirrorChecker,
});
export const runScaleNegativeFlipMirrorChecker = scaleNegativeFlipMirrorCheckerTool.execute;
export default scaleNegativeFlipMirrorCheckerTool;
