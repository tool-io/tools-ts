import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly residualSumSquares: number;
  readonly totalSumSquares: number;
};
export type Output = {
  readonly residualShare: number;
  readonly explainedShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    residualSumSquares: { type: "number", minimum: 0 },
    totalSumSquares: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["residualSumSquares", "totalSumSquares"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    residualShare: { type: "number" },
    explainedShare: { type: "number" },
  },
  required: ["residualShare", "explainedShare"],
} as const;
/** Compare independently supplied compatible first-stage sums of squares without fitting a model or testing instrument validity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { residualSumSquares, totalSumSquares } = request;
  const compute = (): Output => {
    H.positive(totalSumSquares);
    H.domain(residualSumSquares >= 0);
    return {
      residualShare: residualSumSquares / totalSumSquares,
      explainedShare: 1 - residualSumSquares / totalSumSquares,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { residualSumSquares: 20, totalSumSquares: 100 },
  output: { residualShare: 0.2, explainedShare: 0.8 },
} satisfies ToolExample<Input, Output>;
export const instrumentFirstStageResidualShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "econometrics/instrument-first-stage-residual-share",
    title: "Instrument First Stage Residual Share Tool",
    description:
      "Compare independently supplied compatible first-stage sums of squares without fitting a model or testing instrument validity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        residualSumSquares: { type: "number", minimum: 0 },
        totalSumSquares: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["residualSumSquares", "totalSumSquares"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        residualShare: { type: "number" },
        explainedShare: { type: "number" },
      },
      required: ["residualShare", "explainedShare"],
    },
    ports: {
      inputs: [
        {
          id: "residualSumSquares",
          label: "Residual Sum Squares",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalSumSquares",
          label: "Total Sum Squares",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "residualShare",
          label: "Residual Share",
          valueType: { type: "number" },
        },
        {
          id: "explainedShare",
          label: "Explained Share",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = instrumentFirstStageResidualShareTool.execute;
export default instrumentFirstStageResidualShareTool;
