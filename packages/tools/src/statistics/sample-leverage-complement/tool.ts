import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleSize: number;
  readonly centeredPredictor: number;
  readonly predictorSumSquares: number;
};
export type Output = { readonly leverage: number; readonly complement: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleSize: { type: "integer", minimum: 2 },
    centeredPredictor: { type: "number" },
    predictorSumSquares: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["sampleSize", "centeredPredictor", "predictorSumSquares"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { leverage: { type: "number" }, complement: { type: "number" } },
  required: ["leverage", "complement"],
} as const;
/** Compute one simple-regression diagonal leverage and its complement from supplied centered predictor data with an intercept. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampleSize, centeredPredictor, predictorSumSquares } = request;
  const compute = (): Output => {
    H.integer(sampleSize, 2);
    H.positive(predictorSumSquares);
    H.domain(
      centeredPredictor ** 2 <=
        (predictorSumSquares * (sampleSize - 1)) / sampleSize,
    );
    return {
      leverage: 1 / sampleSize + centeredPredictor ** 2 / predictorSumSquares,
      complement:
        1 - 1 / sampleSize - centeredPredictor ** 2 / predictorSumSquares,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sampleSize: 5, centeredPredictor: 2, predictorSumSquares: 20 },
  output: { leverage: 0.4, complement: 0.6000000000000001 },
} satisfies ToolExample<Input, Output>;
export const sampleLeverageComplementTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "statistics/sample-leverage-complement",
    title: "Sample Leverage Complement Tool",
    description:
      "Compute one simple-regression diagonal leverage and its complement from supplied centered predictor data with an intercept.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleSize: { type: "integer", minimum: 2 },
        centeredPredictor: { type: "number" },
        predictorSumSquares: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["sampleSize", "centeredPredictor", "predictorSumSquares"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        leverage: { type: "number" },
        complement: { type: "number" },
      },
      required: ["leverage", "complement"],
    },
    ports: {
      inputs: [
        {
          id: "sampleSize",
          label: "Sample Size",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "centeredPredictor",
          label: "Centered Predictor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "predictorSumSquares",
          label: "Predictor Sum Squares",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "leverage", label: "Leverage", valueType: { type: "number" } },
        {
          id: "complement",
          label: "Complement",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = sampleLeverageComplementTool.execute;
export default sampleLeverageComplementTool;
