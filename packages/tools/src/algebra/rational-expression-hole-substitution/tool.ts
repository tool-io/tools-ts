import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reducedNumeratorAscending: readonly number[];
  readonly reducedDenominatorAscending: readonly number[];
  readonly excludedPoint: number;
  readonly evaluationPoint: number;
};
export type Output = {
  readonly value: number;
  readonly excludedPointEncountered: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reducedNumeratorAscending: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    reducedDenominatorAscending: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    excludedPoint: { type: "number" },
    evaluationPoint: { type: "number" },
  },
  required: [
    "reducedNumeratorAscending",
    "reducedDenominatorAscending",
    "excludedPoint",
    "evaluationPoint",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "number" },
    excludedPointEncountered: { type: "boolean" },
  },
  required: ["value", "excludedPointEncountered"],
} as const;
/** Evaluate an explicitly supplied reduced rational polynomial in ascending coefficient order, separately flagging a caller-identified excluded point of the original expression. At that point the value is the continuous extension, not the undefined original expression. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    reducedNumeratorAscending,
    reducedDenominatorAscending,
    excludedPoint,
    evaluationPoint,
  } = request;
  const compute = (): Output => {
    H.domain(
      reducedNumeratorAscending.length > 0 &&
        reducedDenominatorAscending.length > 0,
      "reducedNumeratorAscending",
    );
    const evaluate = (coefficients: readonly number[]): number => {
      let result = 0;
      for (let i = coefficients.length - 1; i >= 0; i--)
        result = H.finite(result * evaluationPoint + coefficients[i]);
      return result;
    };
    const numerator = evaluate(reducedNumeratorAscending),
      denominator = evaluate(reducedDenominatorAscending);
    H.domain(denominator !== 0, "reducedDenominatorAscending");
    return {
      value: numerator / denominator,
      excludedPointEncountered: evaluationPoint === excludedPoint,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    reducedNumeratorAscending: [8, 2],
    reducedDenominatorAscending: [1, 1],
    excludedPoint: 2,
    evaluationPoint: 2,
  },
  output: { value: 4, excludedPointEncountered: true },
} satisfies ToolExample<Input, Output>;
export const rationalExpressionHoleSubstitutionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "algebra/rational-expression-hole-substitution",
    title: "Rational Expression Hole Substitution Tool",
    description:
      "Evaluate an explicitly supplied reduced rational polynomial in ascending coefficient order, separately flagging a caller-identified excluded point of the original expression. At that point the value is the continuous extension, not the undefined original expression.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reducedNumeratorAscending: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        reducedDenominatorAscending: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        excludedPoint: { type: "number" },
        evaluationPoint: { type: "number" },
      },
      required: [
        "reducedNumeratorAscending",
        "reducedDenominatorAscending",
        "excludedPoint",
        "evaluationPoint",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        value: { type: "number" },
        excludedPointEncountered: { type: "boolean" },
      },
      required: ["value", "excludedPointEncountered"],
    },
    ports: {
      inputs: [
        {
          id: "reducedNumeratorAscending",
          label: "Reduced Numerator Ascending",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "reducedDenominatorAscending",
          label: "Reduced Denominator Ascending",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "excludedPoint",
          label: "Excluded Point",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "evaluationPoint",
          label: "Evaluation Point",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "value", label: "Value", valueType: { type: "number" } },
        {
          id: "excludedPointEncountered",
          label: "Excluded Point Encountered",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = rationalExpressionHoleSubstitutionTool.execute;
export default rationalExpressionHoleSubstitutionTool;
