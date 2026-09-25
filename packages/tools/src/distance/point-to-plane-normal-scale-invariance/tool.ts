import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly signedNumerator: number;
  readonly normalNorm: number;
  readonly normalScale: number;
};
export type Output = {
  readonly distance: number;
  readonly scaledDistance: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedNumerator: { type: "number" },
    normalNorm: { type: "number", exclusiveMinimum: 0 },
    normalScale: { type: "number" },
  },
  required: ["signedNumerator", "normalNorm", "normalScale"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    distance: { type: "number" },
    scaledDistance: { type: "number" },
  },
  required: ["distance", "scaledDistance"],
} as const;
/** Calculate point to plane normal scale invariance from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { signedNumerator, normalNorm, normalScale } = request;
  const compute = (): Output => {
    H.positive(normalNorm);
    H.domain(normalScale !== 0);
    const distance = Math.abs(signedNumerator) / normalNorm;
    return {
      distance,
      scaledDistance:
        Math.abs(normalScale * signedNumerator) /
        (Math.abs(normalScale) * normalNorm),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { signedNumerator: 10, normalNorm: 5, normalScale: -3 },
  output: { distance: 2, scaledDistance: 2 },
} satisfies ToolExample<Input, Output>;
export const pointToPlaneNormalScaleInvarianceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "distance/point-to-plane-normal-scale-invariance",
    title: "Point To Plane Normal Scale Invariance Tool",
    description:
      "Calculate point to plane normal scale invariance from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signedNumerator: { type: "number" },
        normalNorm: { type: "number", exclusiveMinimum: 0 },
        normalScale: { type: "number" },
      },
      required: ["signedNumerator", "normalNorm", "normalScale"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        distance: { type: "number" },
        scaledDistance: { type: "number" },
      },
      required: ["distance", "scaledDistance"],
    },
    ports: {
      inputs: [
        {
          id: "signedNumerator",
          label: "Signed Numerator",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "normalNorm",
          label: "Normal Norm",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "normalScale",
          label: "Normal Scale",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "distance", label: "Distance", valueType: { type: "number" } },
        {
          id: "scaledDistance",
          label: "Scaled Distance",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = pointToPlaneNormalScaleInvarianceTool.execute;
export default pointToPlaneNormalScaleInvarianceTool;
