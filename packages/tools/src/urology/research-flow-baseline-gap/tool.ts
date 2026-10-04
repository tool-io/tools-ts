import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly flowSamples: readonly number[];
  readonly durations: readonly number[];
  readonly baselineFlow: number;
};
export type Output = {
  readonly observedVolume: number;
  readonly baselineVolume: number;
  readonly correctedVolume: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    flowSamples: { type: "array", maxItems: 256, items: { type: "number" } },
    durations: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    baselineFlow: { type: "number" },
  },
  required: ["flowSamples", "durations", "baselineFlow"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedVolume: { type: "number" },
    baselineVolume: { type: "number" },
    correctedVolume: { type: "number" },
  },
  required: ["observedVolume", "baselineVolume", "correctedVolume"],
} as const;
/** Integrate supplied piecewise-constant bench flows and explicit baseline, preserving signed corrected volume. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { flowSamples, durations, baselineFlow } = request;
  const compute = (): Output => {
    H.sameLength(flowSamples, durations);
    H.domain(durations.every((x) => x >= 0));
    return (() => {
      const observedVolume = flowSamples.reduce(
          (s, x, i) => s + x * durations[i],
          0,
        ),
        baselineVolume = durations.reduce((a, b) => a + b, 0) * baselineFlow;
      return {
        observedVolume,
        baselineVolume,
        correctedVolume: observedVolume - baselineVolume,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { flowSamples: [2, 3], durations: [1, 2], baselineFlow: 1 },
  output: { observedVolume: 8, baselineVolume: 3, correctedVolume: 5 },
} satisfies ToolExample<Input, Output>;
export const researchFlowBaselineGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "urology/research-flow-baseline-gap",
    title: "Research Flow Baseline Gap Tool",
    description:
      "Integrate supplied piecewise-constant bench flows and explicit baseline, preserving signed corrected volume.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        flowSamples: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        durations: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        baselineFlow: { type: "number" },
      },
      required: ["flowSamples", "durations", "baselineFlow"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedVolume: { type: "number" },
        baselineVolume: { type: "number" },
        correctedVolume: { type: "number" },
      },
      required: ["observedVolume", "baselineVolume", "correctedVolume"],
    },
    ports: {
      inputs: [
        {
          id: "flowSamples",
          label: "Flow Samples",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "durations",
          label: "Durations",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "baselineFlow",
          label: "Baseline Flow",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "observedVolume",
          label: "Observed Volume",
          valueType: { type: "number" },
        },
        {
          id: "baselineVolume",
          label: "Baseline Volume",
          valueType: { type: "number" },
        },
        {
          id: "correctedVolume",
          label: "Corrected Volume",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = researchFlowBaselineGapTool.execute;
export default researchFlowBaselineGapTool;
