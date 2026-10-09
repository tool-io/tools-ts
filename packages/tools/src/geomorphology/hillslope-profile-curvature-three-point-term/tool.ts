import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly leftElevation: number;
  readonly centerElevation: number;
  readonly rightElevation: number;
  readonly equalHorizontalSpacing: number;
};
export type Output = { readonly secondDerivative: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leftElevation: { type: "number" },
    centerElevation: { type: "number" },
    rightElevation: { type: "number" },
    equalHorizontalSpacing: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "leftElevation",
    "centerElevation",
    "rightElevation",
    "equalHorizontalSpacing",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { secondDerivative: { type: "number" } },
  required: ["secondDerivative"],
} as const;
/** Calculate an equal-spacing three-point elevation second derivative, distinct from slope-normalized geometric curvature. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    leftElevation,
    centerElevation,
    rightElevation,
    equalHorizontalSpacing,
  } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isFinite(equalHorizontalSpacing) && equalHorizontalSpacing > 0,
      "equalHorizontalSpacing",
    ),
      equalHorizontalSpacing);
    return {
      secondDerivative:
        (leftElevation - 2 * centerElevation + rightElevation) /
        equalHorizontalSpacing /
        equalHorizontalSpacing,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    leftElevation: 1,
    centerElevation: 0,
    rightElevation: 1,
    equalHorizontalSpacing: 2,
  },
  output: { secondDerivative: 0.5 },
} satisfies ToolExample<Input, Output>;
export const hillslopeProfileCurvatureThreePointTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "geomorphology/hillslope-profile-curvature-three-point-term",
      title: "Hillslope Profile Curvature Three Point Term Tool",
      description:
        "Calculate an equal-spacing three-point elevation second derivative, distinct from slope-normalized geometric curvature.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          leftElevation: { type: "number" },
          centerElevation: { type: "number" },
          rightElevation: { type: "number" },
          equalHorizontalSpacing: { type: "number", exclusiveMinimum: 0 },
        },
        required: [
          "leftElevation",
          "centerElevation",
          "rightElevation",
          "equalHorizontalSpacing",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { secondDerivative: { type: "number" } },
        required: ["secondDerivative"],
      },
      ports: {
        inputs: [
          {
            id: "leftElevation",
            label: "Left Elevation",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "centerElevation",
            label: "Center Elevation",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "rightElevation",
            label: "Right Elevation",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "equalHorizontalSpacing",
            label: "Equal Horizontal Spacing",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "secondDerivative",
            label: "Second Derivative",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = hillslopeProfileCurvatureThreePointTermTool.execute;
export default hillslopeProfileCurvatureThreePointTermTool;
