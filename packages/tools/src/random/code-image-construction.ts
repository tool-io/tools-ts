import {
  CodeImageError,
  type CodeImageOutput,
} from "../code-image/generate.js";
import { simpleError } from "../core/simple.js";
export const generatedCodeImageSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bcid: { type: "string", minLength: 1, maxLength: 64 },
    symbology: { type: "string", minLength: 1, maxLength: 128 },
    svg: {
      type: "string",
      minLength: 1,
      maxLength: 1000000,
      format: "image/svg+xml",
    },
    width: { type: "number", exclusiveMinimum: 0 },
    height: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["bcid", "symbology", "svg", "width", "height"],
} as const;
export const generatedCodeImage = (
  render: () => CodeImageOutput,
  field: string,
): CodeImageOutput => {
  try {
    return render();
  } catch (error) {
    if (error instanceof CodeImageError)
      return simpleError(field, error.message, error.code);
    throw error;
  }
};
export const checkGeneratedImageBudget = (
  images: readonly CodeImageOutput[],
  field: string,
): void => {
  if (images.reduce((sum, image) => sum + image.svg.length, 0) > 1000000)
    simpleError(
      field,
      "The combined symbol SVG corpus exceeds one million characters.",
      "resource_limit",
    );
};
