import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstError: number;
  readonly secondError: number;
};
export type Output = {
  readonly meanBias: number;
  readonly meanAbsoluteError: number;
  readonly cancelled: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstError: { type: "number" },
    secondError: { type: "number" },
  },
  required: ["firstError", "secondError"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    meanBias: { type: "number" },
    meanAbsoluteError: { type: "number" },
    cancelled: { type: "number" },
  },
  required: ["meanBias", "meanAbsoluteError", "cancelled"],
} as const;
/** Calculate forecast bias cancellation one pair from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstError, secondError } = request;
  const compute = (): Output => {
    const meanBias = (firstError + secondError) / 2,
      meanAbsoluteError = (Math.abs(firstError) + Math.abs(secondError)) / 2;
    return {
      meanBias,
      meanAbsoluteError,
      cancelled: meanAbsoluteError - Math.abs(meanBias),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstError: 3, secondError: -5 },
  output: { meanBias: -1, meanAbsoluteError: 4, cancelled: 3 },
} satisfies ToolExample<Input, Output>;
export const forecastBiasCancellationOnePairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "metrics/forecast-bias-cancellation-one-pair",
    title: "Forecast Bias Cancellation One Pair Tool",
    description:
      "Calculate forecast bias cancellation one pair from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstError: { type: "number" },
        secondError: { type: "number" },
      },
      required: ["firstError", "secondError"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        meanBias: { type: "number" },
        meanAbsoluteError: { type: "number" },
        cancelled: { type: "number" },
      },
      required: ["meanBias", "meanAbsoluteError", "cancelled"],
    },
    ports: {
      inputs: [
        {
          id: "firstError",
          label: "First Error",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondError",
          label: "Second Error",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "meanBias", label: "Mean Bias", valueType: { type: "number" } },
        {
          id: "meanAbsoluteError",
          label: "Mean Absolute Error",
          valueType: { type: "number" },
        },
        { id: "cancelled", label: "Cancelled", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = forecastBiasCancellationOnePairTool.execute;
export default forecastBiasCancellationOnePairTool;
