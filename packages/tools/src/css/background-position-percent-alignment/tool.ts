import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { percentagePixels } from "../translate-percent-self-box-width/tool.js";
export type BackgroundPositionPercentAlignmentInput = {
  readonly areaSize: number;
  readonly imageSize: number;
  readonly percent: number;
};
export type BackgroundPositionPercentAlignmentOutput = {
  readonly offset: number;
};
export const backgroundPositionPercentAlignmentInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "areaSize": {
      "type": "number",
      "minimum": 0,
      "description": "Area size"
    },
    "imageSize": {
      "type": "number",
      "minimum": 0,
      "description": "Image size"
    },
    "percent": {
      "type": "number",
      "description": "Percent"
    }
  },
  "required": [
    "areaSize",
    "imageSize",
    "percent"
  ]
} as const satisfies ToolJsonSchema;
export const backgroundPositionPercentAlignmentOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "offset": {
      "type": "number",
      "description": "Offset"
    }
  },
  "required": [
    "offset"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.w3.org/TR/css-backgrounds-3/#the-background-position
export const calculateBackgroundPositionPercentAlignment = (rawInput: unknown): ToolResult<BackgroundPositionPercentAlignmentOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly areaSize?: unknown; readonly imageSize?: unknown; readonly percent?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "areaSize",
  "imageSize",
  "percent"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const areaSizeValue = candidate.areaSize;
  if (typeof areaSizeValue !== "number" || !Number.isFinite(areaSizeValue)) return issue("areaSize", "invalid_type", "Enter a finite number.");
  if (areaSizeValue < 0) return issue("areaSize", "out_of_range", "Value is outside the accepted range.");
  const imageSizeValue = candidate.imageSize;
  if (typeof imageSizeValue !== "number" || !Number.isFinite(imageSizeValue)) return issue("imageSize", "invalid_type", "Enter a finite number.");
  if (imageSizeValue < 0) return issue("imageSize", "out_of_range", "Value is outside the accepted range.");
  const percentValue = candidate.percent;
  if (typeof percentValue !== "number" || !Number.isFinite(percentValue)) return issue("percent", "invalid_type", "Enter a finite number.");
  const input: BackgroundPositionPercentAlignmentInput = { areaSize: areaSizeValue, imageSize: imageSizeValue, percent: percentValue };
  const difference = input.areaSize - input.imageSize;
  const offset = percentagePixels(difference, input.percent);
  if (!Number.isFinite(offset) || (offset === 0 && difference !== 0 && input.percent !== 0)) return issue("percent", "numeric_range", "Pixel offset is outside representable number range.");
  return toolSuccess({ offset });
};
export const example = {
  input: {
    "areaSize": 300,
    "imageSize": 100,
    "percent": 50
  },
  output: {
    "offset": 100
  },
} satisfies ToolExample<BackgroundPositionPercentAlignmentInput, BackgroundPositionPercentAlignmentOutput>;
export const backgroundPositionPercentAlignmentTool = defineTool<BackgroundPositionPercentAlignmentInput, BackgroundPositionPercentAlignmentOutput>({
  id: "css/background-position-percent-alignment",
  title: "background-position Percent Alignment Formula",
  description: "Resolve one background-position percentage as a pixel offset from the near edge using positioning-area size minus rendered-image size; oversized images and out-of-range percentages are allowed.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: backgroundPositionPercentAlignmentInputSchema,
  outputSchema: backgroundPositionPercentAlignmentOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "areaSize",
        "label": "Area size",
        "required": true,
        "valueType": {
          "type": "number",
          "unit": "px"
        }
      },
      {
        "id": "imageSize",
        "label": "Image size",
        "required": true,
        "valueType": {
          "type": "number",
          "unit": "px"
        }
      },
      {
        "id": "percent",
        "label": "Percent",
        "required": true,
        "valueType": {
          "type": "number",
          "unit": "percent"
        }
      }
    ],
    "outputs": [
      {
        "id": "offset",
        "label": "Offset",
        "valueType": {
          "type": "number",
          "unit": "px"
        }
      }
    ]
  },
  execute: calculateBackgroundPositionPercentAlignment,
});
export const runBackgroundPositionPercentAlignment = backgroundPositionPercentAlignmentTool.execute;
export default backgroundPositionPercentAlignmentTool;
