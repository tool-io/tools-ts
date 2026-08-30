import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { fitDimensions } from "../object-fit-cover-scale-factor/tool.js";
export type ObjectFitContainLetterboxDimsInput = {
  readonly imageWidth: number;
  readonly imageHeight: number;
  readonly boxWidth: number;
  readonly boxHeight: number;
};
export type ObjectFitContainLetterboxDimsOutput = {
  readonly scale: number;
  readonly renderedWidth: number;
  readonly renderedHeight: number;
  readonly unusedWidth: number;
  readonly unusedHeight: number;
};
export const objectFitContainLetterboxDimsInputSchema = {
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
export const objectFitContainLetterboxDimsOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "scale": {
      "type": "number",
      "minimum": 0,
      "description": "Contain scale"
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
    "unusedWidth": {
      "type": "number",
      "minimum": 0,
      "description": "Unused horizontal space"
    },
    "unusedHeight": {
      "type": "number",
      "minimum": 0,
      "description": "Unused vertical space"
    }
  },
  "required": [
    "scale",
    "renderedWidth",
    "renderedHeight",
    "unusedWidth",
    "unusedHeight"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.w3.org/TR/css-images-3/
export const calculateObjectFitContainLetterboxDims = (rawInput: unknown): ToolResult<ObjectFitContainLetterboxDimsOutput> => {
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

  const input: ObjectFitContainLetterboxDimsInput = { imageWidth: imageWidthValue, imageHeight: imageHeightValue, boxWidth: boxWidthValue, boxHeight: boxHeightValue };
  const fitted = fitDimensions(input.imageWidth, input.imageHeight, input.boxWidth, input.boxHeight, false);
  if (!fitted) return issue("imageWidth", "numeric_range", "The fitted dimensions cannot be represented as finite numbers.");
  return toolSuccess({ scale: fitted.scale, renderedWidth: fitted.width, renderedHeight: fitted.height, unusedWidth: Math.max(0, input.boxWidth - fitted.width), unusedHeight: Math.max(0, input.boxHeight - fitted.height) });
};
export const example = {
  input: {
    "imageWidth": 400,
    "imageHeight": 200,
    "boxWidth": 100,
    "boxHeight": 100
  },
  output: {
    "scale": 0.25,
    "renderedWidth": 100,
    "renderedHeight": 50,
    "unusedWidth": 0,
    "unusedHeight": 50
  },
} satisfies ToolExample<ObjectFitContainLetterboxDimsInput, ObjectFitContainLetterboxDimsOutput>;
export const objectFitContainLetterboxDimsTool = defineTool<ObjectFitContainLetterboxDimsInput, ObjectFitContainLetterboxDimsOutput>({
  id: "css/object-fit-contain-letterbox-dims",
  title: "object-fit:contain Letterbox Dimensions",
  description: "Compute contain scale, rendered dimensions, and total unused space for positive intrinsic dimensions and a nonnegative content box.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: objectFitContainLetterboxDimsInputSchema,
  outputSchema: objectFitContainLetterboxDimsOutputSchema,
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
        "label": "Contain scale",
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
        "id": "unusedWidth",
        "label": "Unused horizontal space",
        "valueType": {
          "type": "number",
          "unit": "px"
        }
      },
      {
        "id": "unusedHeight",
        "label": "Unused vertical space",
        "valueType": {
          "type": "number",
          "unit": "px"
        }
      }
    ]
  },
  execute: calculateObjectFitContainLetterboxDims,
});
export const runObjectFitContainLetterboxDims = objectFitContainLetterboxDimsTool.execute;
export default objectFitContainLetterboxDimsTool;
