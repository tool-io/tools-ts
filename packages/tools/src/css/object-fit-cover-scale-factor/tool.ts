import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type ObjectFitCoverScaleFactorInput = {
  readonly imageWidth: number;
  readonly imageHeight: number;
  readonly boxWidth: number;
  readonly boxHeight: number;
};
export type ObjectFitCoverScaleFactorOutput = {
  readonly scale: number;
  readonly renderedWidth: number;
  readonly renderedHeight: number;
  readonly cropWidth: number;
  readonly cropHeight: number;
};
export const objectFitCoverScaleFactorInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "imageWidth": {
      "type": "number",
      "exclusiveMinimum": 0,
      "description": "Intrinsic image width"
    },
    "imageHeight": {
      "type": "number",
      "exclusiveMinimum": 0,
      "description": "Intrinsic image height"
    },
    "boxWidth": {
      "type": "number",
      "description": "Content box width",
      "minimum": 0
    },
    "boxHeight": {
      "type": "number",
      "description": "Content box height",
      "minimum": 0
    }
  },
  "required": [
    "imageWidth",
    "imageHeight",
    "boxWidth",
    "boxHeight"
  ]
} as const satisfies ToolJsonSchema;
export const objectFitCoverScaleFactorOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "scale": {
      "type": "number",
      "minimum": 0,
      "description": "Cover scale"
    },
    "renderedWidth": {
      "type": "number",
      "minimum": 0,
      "description": "Rendered width"
    },
    "renderedHeight": {
      "type": "number",
      "minimum": 0,
      "description": "Rendered height"
    },
    "cropWidth": {
      "type": "number",
      "minimum": 0,
      "description": "Horizontal crop overflow"
    },
    "cropHeight": {
      "type": "number",
      "minimum": 0,
      "description": "Vertical crop overflow"
    }
  },
  "required": [
    "scale",
    "renderedWidth",
    "renderedHeight",
    "cropWidth",
    "cropHeight"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);
export const fitDimensions = (imageWidth: number, imageHeight: number, boxWidth: number, boxHeight: number, cover: boolean) => {
  const widthRatio = boxWidth / imageWidth;
  const heightRatio = boxHeight / imageHeight;
  const scale = cover ? Math.max(widthRatio, heightRatio) : Math.min(widthRatio, heightRatio);
  const width = imageWidth * scale;
  const height = imageHeight * scale;
  if (!Number.isFinite(scale) || !Number.isFinite(width) || !Number.isFinite(height)) return undefined;
  const zeroSizeExpected = cover ? boxWidth === 0 && boxHeight === 0 : boxWidth === 0 || boxHeight === 0;
  if (!zeroSizeExpected && (scale === 0 || width === 0 || height === 0)) return undefined;
  return { scale, width, height };
};
// Reference: https://www.w3.org/TR/css-images-3/
export const calculateObjectFitCoverScaleFactor = (rawInput: unknown): ToolResult<ObjectFitCoverScaleFactorOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly imageWidth?: unknown; readonly imageHeight?: unknown; readonly boxWidth?: unknown; readonly boxHeight?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "imageWidth",
  "imageHeight",
  "boxWidth",
  "boxHeight"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const imageWidthValue = candidate.imageWidth;
  if (typeof imageWidthValue !== "number" || !Number.isFinite(imageWidthValue)) return issue("imageWidth", "invalid_type", "Enter a finite number.");
  if (imageWidthValue <= 0) return issue("imageWidth", "out_of_range", "Value is outside the accepted range.");
  const imageHeightValue = candidate.imageHeight;
  if (typeof imageHeightValue !== "number" || !Number.isFinite(imageHeightValue)) return issue("imageHeight", "invalid_type", "Enter a finite number.");
  if (imageHeightValue <= 0) return issue("imageHeight", "out_of_range", "Value is outside the accepted range.");
  const boxWidthValue = candidate.boxWidth;
  if (typeof boxWidthValue !== "number" || !Number.isFinite(boxWidthValue)) return issue("boxWidth", "invalid_type", "Enter a finite number.");
  if (boxWidthValue < 0) return issue("boxWidth", "out_of_range", "Value is outside the accepted range.");
  const boxHeightValue = candidate.boxHeight;
  if (typeof boxHeightValue !== "number" || !Number.isFinite(boxHeightValue)) return issue("boxHeight", "invalid_type", "Enter a finite number.");
  if (boxHeightValue < 0) return issue("boxHeight", "out_of_range", "Value is outside the accepted range.");

  const input: ObjectFitCoverScaleFactorInput = { imageWidth: imageWidthValue, imageHeight: imageHeightValue, boxWidth: boxWidthValue, boxHeight: boxHeightValue };
  const fitted = fitDimensions(input.imageWidth, input.imageHeight, input.boxWidth, input.boxHeight, true);
  if (!fitted) return issue("imageWidth", "numeric_range", "The fitted dimensions cannot be represented as finite numbers.");
  return toolSuccess({ scale: fitted.scale, renderedWidth: fitted.width, renderedHeight: fitted.height, cropWidth: Math.max(0, fitted.width - input.boxWidth), cropHeight: Math.max(0, fitted.height - input.boxHeight) });
};
export const example = {
  input: {
    "imageWidth": 400,
    "imageHeight": 200,
    "boxWidth": 100,
    "boxHeight": 100
  },
  output: {
    "scale": 0.5,
    "renderedWidth": 200,
    "renderedHeight": 100,
    "cropWidth": 100,
    "cropHeight": 0
  },
} satisfies ToolExample<ObjectFitCoverScaleFactorInput, ObjectFitCoverScaleFactorOutput>;
export const objectFitCoverScaleFactorTool = defineTool<ObjectFitCoverScaleFactorInput, ObjectFitCoverScaleFactorOutput>({
  id: "css/object-fit-cover-scale-factor",
  title: "object-fit:cover Scale Factor Crop",
  description: "Compute cover scale, rendered dimensions, and total crop overflow for positive intrinsic dimensions and a nonnegative content box.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: objectFitCoverScaleFactorInputSchema,
  outputSchema: objectFitCoverScaleFactorOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "imageWidth",
        "label": "Intrinsic image width",
        "required": true,
        "valueType": {
          "type": "number",
          "unit": "px"
        }
      },
      {
        "id": "imageHeight",
        "label": "Intrinsic image height",
        "required": true,
        "valueType": {
          "type": "number",
          "unit": "px"
        }
      },
      {
        "id": "boxWidth",
        "label": "Content box width",
        "required": true,
        "valueType": {
          "type": "number",
          "unit": "px"
        }
      },
      {
        "id": "boxHeight",
        "label": "Content box height",
        "required": true,
        "valueType": {
          "type": "number",
          "unit": "px"
        }
      }
    ],
    "outputs": [
      {
        "id": "scale",
        "label": "Cover scale",
        "valueType": {
          "type": "number"
        }
      },
      {
        "id": "renderedWidth",
        "label": "Rendered width",
        "valueType": {
          "type": "number",
          "unit": "px"
        }
      },
      {
        "id": "renderedHeight",
        "label": "Rendered height",
        "valueType": {
          "type": "number",
          "unit": "px"
        }
      },
      {
        "id": "cropWidth",
        "label": "Horizontal crop overflow",
        "valueType": {
          "type": "number",
          "unit": "px"
        }
      },
      {
        "id": "cropHeight",
        "label": "Vertical crop overflow",
        "valueType": {
          "type": "number",
          "unit": "px"
        }
      }
    ]
  },
  execute: calculateObjectFitCoverScaleFactor,
});
export const runObjectFitCoverScaleFactor = objectFitCoverScaleFactorTool.execute;
export default objectFitCoverScaleFactorTool;
