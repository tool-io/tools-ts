import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly value: number;
  readonly lowerKnot: number;
  readonly upperKnot: number;
};
export type Output = {
  readonly signedParameter: number;
  readonly outsideDistance: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "number" },
    lowerKnot: { type: "number" },
    upperKnot: { type: "number" },
  },
  required: ["value", "lowerKnot", "upperKnot"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedParameter: { type: "number" },
    outsideDistance: { type: "number" },
  },
  required: ["signedParameter", "outsideDistance"],
} as const;
/** Measure supplied extrapolation distance in one positive knot-interval unit without evaluating an interpolant. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { value, lowerKnot, upperKnot } = request;
  const compute = (): Output => {
    H.domain(lowerKnot < upperKnot);
    return {
      signedParameter: (value - lowerKnot) / (upperKnot - lowerKnot),
      outsideDistance:
        value < lowerKnot
          ? (lowerKnot - value) / (upperKnot - lowerKnot)
          : value > upperKnot
            ? (value - upperKnot) / (upperKnot - lowerKnot)
            : 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { value: 7, lowerKnot: 1, upperKnot: 5 },
  output: { signedParameter: 1.5, outsideDistance: 0.5 },
} satisfies ToolExample<Input, Output>;
export const extrapolationDistanceInKnotUnitsTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "interpolation/extrapolation-distance-in-knot-units",
    title: "Extrapolation Distance In Knot Units Tool",
    description:
      "Measure supplied extrapolation distance in one positive knot-interval unit without evaluating an interpolant.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        value: { type: "number" },
        lowerKnot: { type: "number" },
        upperKnot: { type: "number" },
      },
      required: ["value", "lowerKnot", "upperKnot"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signedParameter: { type: "number" },
        outsideDistance: { type: "number" },
      },
      required: ["signedParameter", "outsideDistance"],
    },
    ports: {
      inputs: [
        {
          id: "value",
          label: "Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lowerKnot",
          label: "Lower Knot",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "upperKnot",
          label: "Upper Knot",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "signedParameter",
          label: "Signed Parameter",
          valueType: { type: "number" },
        },
        {
          id: "outsideDistance",
          label: "Outside Distance",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = extrapolationDistanceInKnotUnitsTool.execute;
export default extrapolationDistanceInKnotUnitsTool;
