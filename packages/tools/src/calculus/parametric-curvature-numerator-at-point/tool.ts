import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly dx: number;
  readonly dy: number;
  readonly ddx: number;
  readonly ddy: number;
};
export type Output = {
  readonly signedNumerator: number;
  readonly absoluteNumerator: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dx: { type: "number" },
    dy: { type: "number" },
    ddx: { type: "number" },
    ddy: { type: "number" },
  },
  required: ["dx", "dy", "ddx", "ddy"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedNumerator: { type: "number" },
    absoluteNumerator: { type: "number" },
  },
  required: ["signedNumerator", "absoluteNumerator"],
} as const;
/** Calculate parametric curvature numerator at point from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { dx, dy, ddx, ddy } = request;
  const compute = (): Output => {
    const signedNumerator = dx * ddy - dy * ddx;
    return { signedNumerator, absoluteNumerator: Math.abs(signedNumerator) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { dx: 3, dy: 4, ddx: 2, ddy: 5 },
  output: { signedNumerator: 7, absoluteNumerator: 7 },
} satisfies ToolExample<Input, Output>;
export const parametricCurvatureNumeratorAtPointTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "calculus/parametric-curvature-numerator-at-point",
      title: "Parametric Curvature Numerator At Point Tool",
      description:
        "Calculate parametric curvature numerator at point from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          dx: { type: "number" },
          dy: { type: "number" },
          ddx: { type: "number" },
          ddy: { type: "number" },
        },
        required: ["dx", "dy", "ddx", "ddy"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          signedNumerator: { type: "number" },
          absoluteNumerator: { type: "number" },
        },
        required: ["signedNumerator", "absoluteNumerator"],
      },
      ports: {
        inputs: [
          {
            id: "dx",
            label: "Dx",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "dy",
            label: "Dy",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "ddx",
            label: "Ddx",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "ddy",
            label: "Ddy",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "signedNumerator",
            label: "Signed Numerator",
            valueType: { type: "number" },
          },
          {
            id: "absoluteNumerator",
            label: "Absolute Numerator",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = parametricCurvatureNumeratorAtPointTool.execute;
export default parametricCurvatureNumeratorAtPointTool;
