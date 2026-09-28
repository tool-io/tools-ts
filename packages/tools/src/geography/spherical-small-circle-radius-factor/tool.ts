import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly angularRadius: number;
  readonly sphereRadius: number;
};
export type Output = {
  readonly circleRadius: number;
  readonly planeOffset: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    angularRadius: { type: "number", minimum: 0 },
    sphereRadius: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["angularRadius", "sphereRadius"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    circleRadius: { type: "number" },
    planeOffset: { type: "number" },
  },
  required: ["circleRadius", "planeOffset"],
} as const;
/** Calculate spherical small circle radius factor from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { angularRadius, sphereRadius } = input;
  const compute = (): Output => {
    H.domain(angularRadius >= 0 && angularRadius <= Math.PI);
    H.positive(sphereRadius);
    return {
      circleRadius: sphereRadius * Math.sin(angularRadius),
      planeOffset: sphereRadius * Math.cos(angularRadius),
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { angularRadius: 1.5707963267948966, sphereRadius: 4 },
  output: { circleRadius: 4, planeOffset: 2.4492935982947064e-16 },
} satisfies ToolExample<Input, Output>;
export const sphericalSmallCircleRadiusFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geography/spherical-small-circle-radius-factor",
    title: "Spherical Small Circle Radius Factor Tool",
    description:
      "Calculate spherical small circle radius factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        angularRadius: { type: "number", minimum: 0 },
        sphereRadius: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["angularRadius", "sphereRadius"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        circleRadius: { type: "number" },
        planeOffset: { type: "number" },
      },
      required: ["circleRadius", "planeOffset"],
    },
    ports: {
      inputs: [
        {
          id: "angularRadius",
          label: "Angular Radius",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sphereRadius",
          label: "Sphere Radius",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "circleRadius",
          label: "Circle Radius",
          valueType: { type: "number" },
        },
        {
          id: "planeOffset",
          label: "Plane Offset",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = sphericalSmallCircleRadiusFactorTool.execute;
export default sphericalSmallCircleRadiusFactorTool;
