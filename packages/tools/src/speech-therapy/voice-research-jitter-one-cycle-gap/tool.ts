import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly periods: readonly number[] };
export type Output = {
  readonly meanPeriod: number;
  readonly meanAbsoluteDifference: number;
  readonly localJitter: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    periods: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["periods"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    meanPeriod: { type: "number" },
    meanAbsoluteDifference: { type: "number" },
    localJitter: { type: "number" },
  },
  required: ["meanPeriod", "meanAbsoluteDifference", "localJitter"],
} as const;
/** Local jitter from supplied consecutive cycle periods without extracting pitch. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { periods } = request;
  const compute = (): Output => {
    H.domain(periods.length >= 2 && periods.every((x) => x > 0));
    return {
      meanPeriod: periods.reduce((a, b) => a + b, 0) / periods.length,
      meanAbsoluteDifference:
        periods.slice(1).reduce((a, b, i) => a + Math.abs(b - periods[i]), 0) /
        (periods.length - 1),
      localJitter:
        (periods.slice(1).reduce((a, b, i) => a + Math.abs(b - periods[i]), 0) *
          periods.length) /
        ((periods.length - 1) * periods.reduce((a, b) => a + b, 0)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { periods: [0.01, 0.011, 0.01] },
  output: {
    meanPeriod: 0.010333333333333333,
    meanAbsoluteDifference: 0.0009999999999999992,
    localJitter: 0.09677419354838701,
  },
} satisfies ToolExample<Input, Output>;
export const voiceResearchJitterOneCycleGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "speech-therapy/voice-research-jitter-one-cycle-gap",
    title: "Voice Research Jitter One Cycle Gap Tool",
    description:
      "Local jitter from supplied consecutive cycle periods without extracting pitch.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        periods: { type: "array", maxItems: 256, items: { type: "number" } },
      },
      required: ["periods"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        meanPeriod: { type: "number" },
        meanAbsoluteDifference: { type: "number" },
        localJitter: { type: "number" },
      },
      required: ["meanPeriod", "meanAbsoluteDifference", "localJitter"],
    },
    ports: {
      inputs: [
        {
          id: "periods",
          label: "Periods",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "meanPeriod",
          label: "Mean Period",
          valueType: { type: "number" },
        },
        {
          id: "meanAbsoluteDifference",
          label: "Mean Absolute Difference",
          valueType: { type: "number" },
        },
        {
          id: "localJitter",
          label: "Local Jitter",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = voiceResearchJitterOneCycleGapTool.execute;
export default voiceResearchJitterOneCycleGapTool;
