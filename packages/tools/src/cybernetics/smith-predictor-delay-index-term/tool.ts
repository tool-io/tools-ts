import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly delaySeconds: number;
  readonly sampleSeconds: number;
  readonly currentIndex: number;
};
export type Output = {
  readonly wholeSamples: number;
  readonly fractionalSample: number;
  readonly delayedIndex: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    delaySeconds: { type: "number", minimum: 0 },
    sampleSeconds: { type: "number", exclusiveMinimum: 0 },
    currentIndex: { type: "integer", minimum: 0 },
  },
  required: ["delaySeconds", "sampleSeconds", "currentIndex"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wholeSamples: { type: "integer" },
    fractionalSample: { type: "number" },
    delayedIndex: { type: "integer" },
  },
  required: ["wholeSamples", "fractionalSample", "delayedIndex"],
} as const;
/** Resolve a supplied delay into integer/fractional sample offsets; no process-model prediction is performed. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { delaySeconds, sampleSeconds, currentIndex } = request;
  const compute = (): Output => {
    H.domain(delaySeconds >= 0);
    H.positive(sampleSeconds);
    H.integer(currentIndex, 0);
    return {
      wholeSamples: Math.floor(delaySeconds / sampleSeconds),
      fractionalSample:
        delaySeconds / sampleSeconds - Math.floor(delaySeconds / sampleSeconds),
      delayedIndex: currentIndex - Math.floor(delaySeconds / sampleSeconds),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { delaySeconds: 2.5, sampleSeconds: 1, currentIndex: 10 },
  output: { wholeSamples: 2, fractionalSample: 0.5, delayedIndex: 8 },
} satisfies ToolExample<Input, Output>;
export const smithPredictorDelayIndexTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cybernetics/smith-predictor-delay-index-term",
    title: "Smith Predictor Delay Index Term Tool",
    description:
      "Resolve a supplied delay into integer/fractional sample offsets; no process-model prediction is performed.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        delaySeconds: { type: "number", minimum: 0 },
        sampleSeconds: { type: "number", exclusiveMinimum: 0 },
        currentIndex: { type: "integer", minimum: 0 },
      },
      required: ["delaySeconds", "sampleSeconds", "currentIndex"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        wholeSamples: { type: "integer" },
        fractionalSample: { type: "number" },
        delayedIndex: { type: "integer" },
      },
      required: ["wholeSamples", "fractionalSample", "delayedIndex"],
    },
    ports: {
      inputs: [
        {
          id: "delaySeconds",
          label: "Delay Seconds",
          required: true,
          valueType: { type: "number", unit: "s" },
        },
        {
          id: "sampleSeconds",
          label: "Sample Seconds",
          required: true,
          valueType: { type: "number", unit: "s" },
        },
        {
          id: "currentIndex",
          label: "Current Index",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "wholeSamples",
          label: "Whole Samples",
          valueType: { type: "integer" },
        },
        {
          id: "fractionalSample",
          label: "Fractional Sample",
          valueType: { type: "number" },
        },
        {
          id: "delayedIndex",
          label: "Delayed Index",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = smithPredictorDelayIndexTermTool.execute;
export default smithPredictorDelayIndexTermTool;
