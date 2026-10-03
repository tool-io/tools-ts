import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly numeratorCoefficient: number;
  readonly denominatorTail: readonly number[];
  readonly previousCoefficients: readonly number[];
  readonly denominatorConstant: number;
};
export type Output = { readonly coefficient: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    numeratorCoefficient: { type: "number" },
    denominatorTail: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    previousCoefficients: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    denominatorConstant: { type: "number" },
  },
  required: [
    "numeratorCoefficient",
    "denominatorTail",
    "previousCoefficients",
    "denominatorConstant",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { coefficient: { type: "number" } },
  required: ["coefficient"],
} as const;
/** One formal power-series coefficient from Q(z)A(z)=P(z), with supplied prior coefficients aligned to Q tail coefficients. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    numeratorCoefficient,
    denominatorTail,
    previousCoefficients,
    denominatorConstant,
  } = request;
  const compute = (): Output => {
    H.sameLength(denominatorTail, previousCoefficients);
    H.domain(denominatorConstant !== 0);
    return {
      coefficient:
        (numeratorCoefficient - H.dot(denominatorTail, previousCoefficients)) /
        denominatorConstant,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    numeratorCoefficient: 0,
    denominatorTail: [-1, -1],
    previousCoefficients: [3, 2],
    denominatorConstant: 1,
  },
  output: { coefficient: 5 },
} satisfies ToolExample<Input, Output>;
export const rationalGeneratingFunctionCoefficientStepTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "sequence/rational-generating-function-coefficient-step",
      title: "Rational Generating Function Coefficient Step Tool",
      description:
        "One formal power-series coefficient from Q(z)A(z)=P(z), with supplied prior coefficients aligned to Q tail coefficients.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          numeratorCoefficient: { type: "number" },
          denominatorTail: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
          previousCoefficients: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
          denominatorConstant: { type: "number" },
        },
        required: [
          "numeratorCoefficient",
          "denominatorTail",
          "previousCoefficients",
          "denominatorConstant",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { coefficient: { type: "number" } },
        required: ["coefficient"],
      },
      ports: {
        inputs: [
          {
            id: "numeratorCoefficient",
            label: "Numerator Coefficient",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "denominatorTail",
            label: "Denominator Tail",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "previousCoefficients",
            label: "Previous Coefficients",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "denominatorConstant",
            label: "Denominator Constant",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "coefficient",
            label: "Coefficient",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = rationalGeneratingFunctionCoefficientStepTool.execute;
export default rationalGeneratingFunctionCoefficientStepTool;
