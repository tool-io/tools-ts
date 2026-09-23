import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly partialX: number; readonly partialY: number };
export type Output = {
  readonly verticalTangent: boolean;
  readonly singular: boolean;
  readonly horizontalTangent: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { partialX: { type: "number" }, partialY: { type: "number" } },
  required: ["partialX", "partialY"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    verticalTangent: { type: "boolean" },
    singular: { type: "boolean" },
    horizontalTangent: { type: "boolean" },
  },
  required: ["verticalTangent", "singular", "horizontalTangent"],
} as const;
/** Exact first-derivative tests for a supplied planar implicit curve gradient. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { partialX, partialY } = request;
  const compute = (): Output => {
    return {
      verticalTangent: partialY === 0 && partialX !== 0,
      singular: partialX === 0 && partialY === 0,
      horizontalTangent: partialX === 0 && partialY !== 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { partialX: 2, partialY: 0 },
  output: { verticalTangent: true, singular: false, horizontalTangent: false },
} satisfies ToolExample<Input, Output>;
export const implicitCurveVerticalTangentFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "calculus/implicit-curve-vertical-tangent-flag",
    title: "Implicit Curve Vertical Tangent Flag Tool",
    description:
      "Exact first-derivative tests for a supplied planar implicit curve gradient.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        partialX: { type: "number" },
        partialY: { type: "number" },
      },
      required: ["partialX", "partialY"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        verticalTangent: { type: "boolean" },
        singular: { type: "boolean" },
        horizontalTangent: { type: "boolean" },
      },
      required: ["verticalTangent", "singular", "horizontalTangent"],
    },
    ports: {
      inputs: [
        {
          id: "partialX",
          label: "Partial X",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "partialY",
          label: "Partial Y",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "verticalTangent",
          label: "Vertical Tangent",
          valueType: { type: "boolean" },
        },
        { id: "singular", label: "Singular", valueType: { type: "boolean" } },
        {
          id: "horizontalTangent",
          label: "Horizontal Tangent",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = implicitCurveVerticalTangentFlagTool.execute;
export default implicitCurveVerticalTangentFlagTool;
