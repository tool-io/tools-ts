import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly horizontalRadians: number;
  readonly verticalRadians: number;
};
export type Output = {
  readonly smallAngleSteradians: number;
  readonly rectangularPyramidSteradians: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    horizontalRadians: { type: "number", minimum: 0 },
    verticalRadians: { type: "number", minimum: 0 },
  },
  required: ["horizontalRadians", "verticalRadians"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    smallAngleSteradians: { type: "number" },
    rectangularPyramidSteradians: { type: "number" },
  },
  required: ["smallAngleSteradians", "rectangularPyramidSteradians"],
} as const;
/** Solid angle of an ideal centered rectangular angular patch versus its small-angle product, without a visual-field test interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { horizontalRadians, verticalRadians } = request;
  const compute = (): Output => {
    H.domain(
      horizontalRadians >= 0 &&
        horizontalRadians <= Math.PI &&
        verticalRadians >= 0 &&
        verticalRadians <= Math.PI,
    );
    return {
      smallAngleSteradians: horizontalRadians * verticalRadians,
      rectangularPyramidSteradians:
        4 *
        Math.asin(
          Math.sin(horizontalRadians / 2) * Math.sin(verticalRadians / 2),
        ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    horizontalRadians: 1.5707963267948966,
    verticalRadians: 1.5707963267948966,
  },
  output: {
    smallAngleSteradians: 2.4674011002723395,
    rectangularPyramidSteradians: 2.094395102393195,
  },
} satisfies ToolExample<Input, Output>;
export const visualFieldSolidAngleSmallAngleTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "ophthalmology/visual-field-solid-angle-small-angle-term",
      title: "Visual Field Solid Angle Small Angle Term Tool",
      description:
        "Solid angle of an ideal centered rectangular angular patch versus its small-angle product, without a visual-field test interpretation.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          horizontalRadians: { type: "number", minimum: 0 },
          verticalRadians: { type: "number", minimum: 0 },
        },
        required: ["horizontalRadians", "verticalRadians"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          smallAngleSteradians: { type: "number" },
          rectangularPyramidSteradians: { type: "number" },
        },
        required: ["smallAngleSteradians", "rectangularPyramidSteradians"],
      },
      ports: {
        inputs: [
          {
            id: "horizontalRadians",
            label: "Horizontal Radians",
            required: true,
            valueType: { type: "number", unit: "rad" },
          },
          {
            id: "verticalRadians",
            label: "Vertical Radians",
            required: true,
            valueType: { type: "number", unit: "rad" },
          },
        ],
        outputs: [
          {
            id: "smallAngleSteradians",
            label: "Small Angle Steradians",
            valueType: { type: "number", unit: "rad" },
          },
          {
            id: "rectangularPyramidSteradians",
            label: "Rectangular Pyramid Steradians",
            valueType: { type: "number", unit: "rad" },
          },
        ],
      },
    },
    calculate,
  });
export const run = visualFieldSolidAngleSmallAngleTermTool.execute;
export default visualFieldSolidAngleSmallAngleTermTool;
