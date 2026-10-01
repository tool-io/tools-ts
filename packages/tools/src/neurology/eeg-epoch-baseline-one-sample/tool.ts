import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sample: number;
  readonly baselineSamples: readonly number[];
  readonly robustMedian: boolean;
};
export type Output = { readonly baseline: number; readonly corrected: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sample: { type: "number" },
    baselineSamples: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    robustMedian: { type: "boolean" },
  },
  required: ["sample", "baselineSamples", "robustMedian"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { baseline: { type: "number" }, corrected: { type: "number" } },
  required: ["baseline", "corrected"],
} as const;
/** One supplied sample baseline correction using a caller-selected mean or ordinary midpoint median. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sample, baselineSamples, robustMedian } = request;
  const compute = (): Output => {
    H.domain(baselineSamples.length > 0);
    return {
      baseline: robustMedian
        ? ([...baselineSamples].sort((a, b) => a - b)[
            Math.floor((baselineSamples.length - 1) / 2)
          ] +
            [...baselineSamples].sort((a, b) => a - b)[
              Math.floor(baselineSamples.length / 2)
            ]) /
          2
        : baselineSamples.reduce((a, b) => a + b, 0) / baselineSamples.length,
      corrected:
        sample -
        (robustMedian
          ? ([...baselineSamples].sort((a, b) => a - b)[
              Math.floor((baselineSamples.length - 1) / 2)
            ] +
              [...baselineSamples].sort((a, b) => a - b)[
                Math.floor(baselineSamples.length / 2)
              ]) /
            2
          : baselineSamples.reduce((a, b) => a + b, 0) /
            baselineSamples.length),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sample: 10, baselineSamples: [2, 3, 4], robustMedian: false },
  output: { baseline: 3, corrected: 7 },
} satisfies ToolExample<Input, Output>;
export const eegEpochBaselineOneSampleTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "neurology/eeg-epoch-baseline-one-sample",
    title: "EEG Epoch Baseline One Sample Tool",
    description:
      "One supplied sample baseline correction using a caller-selected mean or ordinary midpoint median.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sample: { type: "number" },
        baselineSamples: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        robustMedian: { type: "boolean" },
      },
      required: ["sample", "baselineSamples", "robustMedian"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        baseline: { type: "number" },
        corrected: { type: "number" },
      },
      required: ["baseline", "corrected"],
    },
    ports: {
      inputs: [
        {
          id: "sample",
          label: "Sample",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "baselineSamples",
          label: "Baseline Samples",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "robustMedian",
          label: "Robust Median",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "baseline", label: "Baseline", valueType: { type: "number" } },
        { id: "corrected", label: "Corrected", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = eegEpochBaselineOneSampleTool.execute;
export default eegEpochBaselineOneSampleTool;
