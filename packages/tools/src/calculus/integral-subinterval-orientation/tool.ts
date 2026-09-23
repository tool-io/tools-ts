import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lower: number;
  readonly upper: number;
  readonly suppliedIntegralInAscendingOrder: number;
};
export type Output = {
  readonly orientedIntegral: number;
  readonly orientation: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lower: { type: "number" },
    upper: { type: "number" },
    suppliedIntegralInAscendingOrder: { type: "number" },
  },
  required: ["lower", "upper", "suppliedIntegralInAscendingOrder"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    orientedIntegral: { type: "number" },
    orientation: { type: "integer" },
  },
  required: ["orientedIntegral", "orientation"],
} as const;
/** Orient a supplied ascending-bound definite integral; coincident bounds return zero. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lower, upper, suppliedIntegralInAscendingOrder } = request;
  const compute = (): Output => {
    return {
      orientedIntegral:
        lower === upper
          ? 0
          : (lower < upper ? 1 : -1) * suppliedIntegralInAscendingOrder,
      orientation: Math.sign(upper - lower),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { lower: 3, upper: 1, suppliedIntegralInAscendingOrder: 5 },
  output: { orientedIntegral: -5, orientation: -1 },
} satisfies ToolExample<Input, Output>;
export const integralSubintervalOrientationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "calculus/integral-subinterval-orientation",
    title: "Integral Subinterval Orientation Tool",
    description:
      "Orient a supplied ascending-bound definite integral; coincident bounds return zero.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lower: { type: "number" },
        upper: { type: "number" },
        suppliedIntegralInAscendingOrder: { type: "number" },
      },
      required: ["lower", "upper", "suppliedIntegralInAscendingOrder"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        orientedIntegral: { type: "number" },
        orientation: { type: "integer" },
      },
      required: ["orientedIntegral", "orientation"],
    },
    ports: {
      inputs: [
        {
          id: "lower",
          label: "Lower",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "upper",
          label: "Upper",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedIntegralInAscendingOrder",
          label: "Supplied Integral In Ascending Order",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "orientedIntegral",
          label: "Oriented Integral",
          valueType: { type: "number" },
        },
        {
          id: "orientation",
          label: "Orientation",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = integralSubintervalOrientationTool.execute;
export default integralSubintervalOrientationTool;
