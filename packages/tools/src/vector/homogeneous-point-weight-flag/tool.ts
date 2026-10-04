import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly weight: number };
export type Output = {
  readonly finitePoint: boolean;
  readonly pointAtInfinity: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { weight: { type: "number" } },
  required: ["weight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    finitePoint: { type: "boolean" },
    pointAtInfinity: { type: "boolean" },
  },
  required: ["finitePoint", "pointAtInfinity"],
} as const;
/** Classify a supplied homogeneous weight; other coordinates must separately define a nonzero projective tuple. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { weight } = request;
  const compute = (): Output => {
    return { finitePoint: weight !== 0, pointAtInfinity: weight === 0 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { weight: 2 },
  output: { finitePoint: true, pointAtInfinity: false },
} satisfies ToolExample<Input, Output>;
export const homogeneousPointWeightFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "vector/homogeneous-point-weight-flag",
    title: "Homogeneous Point Weight Flag Tool",
    description:
      "Classify a supplied homogeneous weight; other coordinates must separately define a nonzero projective tuple.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { weight: { type: "number" } },
      required: ["weight"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        finitePoint: { type: "boolean" },
        pointAtInfinity: { type: "boolean" },
      },
      required: ["finitePoint", "pointAtInfinity"],
    },
    ports: {
      inputs: [
        {
          id: "weight",
          label: "Weight",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "finitePoint",
          label: "Finite Point",
          valueType: { type: "boolean" },
        },
        {
          id: "pointAtInfinity",
          label: "Point At Infinity",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = homogeneousPointWeightFlagTool.execute;
export default homogeneousPointWeightFlagTool;
