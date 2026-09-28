import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sphereRadius: number;
  readonly capHeight: number;
};
export type Output = {
  readonly baseRadius: number;
  readonly radiusRatio: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sphereRadius: { type: "number", exclusiveMinimum: 0 },
    capHeight: { type: "number", minimum: 0 },
  },
  required: ["sphereRadius", "capHeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    baseRadius: { type: "number" },
    radiusRatio: { type: "number" },
  },
  required: ["baseRadius", "radiusRatio"],
} as const;
/** Calculate sphere cap base radius ratio from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sphereRadius, capHeight } = request;
  const compute = (): Output => {
    H.positive(sphereRadius);
    H.domain(capHeight >= 0 && capHeight <= 2 * sphereRadius);
    const product = capHeight * (2 * sphereRadius - capHeight),
      r = capHeight / sphereRadius,
      baseRadius =
        capHeight === 0
          ? 0
          : Number.isFinite(product) && product > 0
            ? Math.sqrt(product)
            : r <= 1
              ? Math.sqrt(capHeight) *
                Math.sqrt(sphereRadius) *
                Math.sqrt(2 - r)
              : sphereRadius * Math.sqrt(r * (2 - r));
    return { baseRadius, radiusRatio: baseRadius / sphereRadius };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sphereRadius: 5, capHeight: 1 },
  output: { baseRadius: 3, radiusRatio: 0.6 },
} satisfies ToolExample<Input, Output>;
export const sphereCapBaseRadiusRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geometry/sphere-cap-base-radius-ratio",
    title: "Sphere Cap Base Radius Ratio Tool",
    description:
      "Calculate sphere cap base radius ratio from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sphereRadius: { type: "number", exclusiveMinimum: 0 },
        capHeight: { type: "number", minimum: 0 },
      },
      required: ["sphereRadius", "capHeight"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        baseRadius: { type: "number" },
        radiusRatio: { type: "number" },
      },
      required: ["baseRadius", "radiusRatio"],
    },
    ports: {
      inputs: [
        {
          id: "sphereRadius",
          label: "Sphere Radius",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "capHeight",
          label: "Cap Height",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "baseRadius",
          label: "Base Radius",
          valueType: { type: "number" },
        },
        {
          id: "radiusRatio",
          label: "Radius Ratio",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = sphereCapBaseRadiusRatioTool.execute;
export default sphereCapBaseRadiusRatioTool;
