import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly wingLandmarkLength: number;
  readonly wingLandmarkWidth: number;
};
export type Output = { readonly landmarkAspectRatio: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wingLandmarkLength: { type: "number", minimum: 0 },
    wingLandmarkWidth: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["wingLandmarkLength", "wingLandmarkWidth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { landmarkAspectRatio: { type: "number" } },
  required: ["landmarkAspectRatio"],
} as const;
/** Divide explicit wing landmark length by positive landmark width, distinct from the aerodynamic span-squared-over-area definition. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { wingLandmarkLength, wingLandmarkWidth } = request;
  const compute = (): Output => {
    H.domain(wingLandmarkLength >= 0, "wingLandmarkLength");
    (H.domain(
      Number.isFinite(wingLandmarkWidth) && wingLandmarkWidth > 0,
      "wingLandmarkWidth",
    ),
      wingLandmarkWidth);
    return { landmarkAspectRatio: wingLandmarkLength / wingLandmarkWidth };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { wingLandmarkLength: 12, wingLandmarkWidth: 4 },
  output: { landmarkAspectRatio: 3 },
} satisfies ToolExample<Input, Output>;
export const insectWingAspectLandmarkRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "entomology/insect-wing-aspect-landmark-ratio",
    title: "Insect Wing Aspect Landmark Ratio Tool",
    description:
      "Divide explicit wing landmark length by positive landmark width, distinct from the aerodynamic span-squared-over-area definition.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        wingLandmarkLength: { type: "number", minimum: 0 },
        wingLandmarkWidth: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["wingLandmarkLength", "wingLandmarkWidth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { landmarkAspectRatio: { type: "number" } },
      required: ["landmarkAspectRatio"],
    },
    ports: {
      inputs: [
        {
          id: "wingLandmarkLength",
          label: "Wing Landmark Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "wingLandmarkWidth",
          label: "Wing Landmark Width",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "landmarkAspectRatio",
          label: "Landmark Aspect Ratio",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = insectWingAspectLandmarkRatioTool.execute;
export default insectWingAspectLandmarkRatioTool;
