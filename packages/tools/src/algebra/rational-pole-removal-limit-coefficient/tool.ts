import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly numeratorOrder: number;
  readonly denominatorOrder: number;
  readonly numeratorLeading: number;
  readonly denominatorLeading: number;
};
export type Output = {
  readonly limitDefined: boolean;
  readonly limit: number;
  readonly residualOrder: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    numeratorOrder: { type: "integer", minimum: 0 },
    denominatorOrder: { type: "integer", minimum: 0 },
    numeratorLeading: { type: "number" },
    denominatorLeading: { type: "number" },
  },
  required: [
    "numeratorOrder",
    "denominatorOrder",
    "numeratorLeading",
    "denominatorLeading",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    limitDefined: { type: "boolean" },
    limit: { type: "number" },
    residualOrder: { type: "integer" },
  },
  required: ["limitDefined", "limit", "residualOrder"],
} as const;
/** Local leading-order quotient at a shared zero; zero is a placeholder when a finite limit is unavailable. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    numeratorOrder,
    denominatorOrder,
    numeratorLeading,
    denominatorLeading,
  } = request;
  const compute = (): Output => {
    H.integer(numeratorOrder, 0);
    H.integer(denominatorOrder, 0);
    H.domain(numeratorLeading !== 0 && denominatorLeading !== 0);
    return {
      limitDefined: numeratorOrder >= denominatorOrder,
      limit:
        numeratorOrder === denominatorOrder
          ? numeratorLeading / denominatorLeading
          : 0,
      residualOrder: numeratorOrder - denominatorOrder,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    numeratorOrder: 2,
    denominatorOrder: 2,
    numeratorLeading: 6,
    denominatorLeading: 3,
  },
  output: { limitDefined: true, limit: 2, residualOrder: 0 },
} satisfies ToolExample<Input, Output>;
export const rationalPoleRemovalLimitCoefficientTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "algebra/rational-pole-removal-limit-coefficient",
      title: "Rational Pole Removal Limit Coefficient Tool",
      description:
        "Local leading-order quotient at a shared zero; zero is a placeholder when a finite limit is unavailable.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          numeratorOrder: { type: "integer", minimum: 0 },
          denominatorOrder: { type: "integer", minimum: 0 },
          numeratorLeading: { type: "number" },
          denominatorLeading: { type: "number" },
        },
        required: [
          "numeratorOrder",
          "denominatorOrder",
          "numeratorLeading",
          "denominatorLeading",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          limitDefined: { type: "boolean" },
          limit: { type: "number" },
          residualOrder: { type: "integer" },
        },
        required: ["limitDefined", "limit", "residualOrder"],
      },
      ports: {
        inputs: [
          {
            id: "numeratorOrder",
            label: "Numerator Order",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "denominatorOrder",
            label: "Denominator Order",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "numeratorLeading",
            label: "Numerator Leading",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "denominatorLeading",
            label: "Denominator Leading",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "limitDefined",
            label: "Limit Defined",
            valueType: { type: "boolean" },
          },
          { id: "limit", label: "Limit", valueType: { type: "number" } },
          {
            id: "residualOrder",
            label: "Residual Order",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = rationalPoleRemovalLimitCoefficientTool.execute;
export default rationalPoleRemovalLimitCoefficientTool;
