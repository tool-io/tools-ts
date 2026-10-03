import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedStart: number;
  readonly observedEnd: number;
  readonly referenceStart: number;
  readonly referenceEnd: number;
  readonly samplePeriod: number;
};
export type Output = {
  readonly onsetGap: number;
  readonly offsetGap: number;
  readonly durationGapInSamples: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedStart: { type: "number" },
    observedEnd: { type: "number" },
    referenceStart: { type: "number" },
    referenceEnd: { type: "number" },
    samplePeriod: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "observedStart",
    "observedEnd",
    "referenceStart",
    "referenceEnd",
    "samplePeriod",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    onsetGap: { type: "number" },
    offsetGap: { type: "number" },
    durationGapInSamples: { type: "number" },
  },
  required: ["onsetGap", "offsetGap", "durationGapInSamples"],
} as const;
/** Calculate phoneme window reference gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    observedStart,
    observedEnd,
    referenceStart,
    referenceEnd,
    samplePeriod,
  } = request;
  const compute = (): Output => {
    H.domain(observedEnd >= observedStart && referenceEnd >= referenceStart);
    H.positive(samplePeriod);
    return {
      onsetGap: observedStart - referenceStart,
      offsetGap: observedEnd - referenceEnd,
      durationGapInSamples:
        (observedEnd - observedStart - (referenceEnd - referenceStart)) /
        samplePeriod,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    observedStart: 1,
    observedEnd: 4,
    referenceStart: 0,
    referenceEnd: 2,
    samplePeriod: 0.5,
  },
  output: { onsetGap: 1, offsetGap: 2, durationGapInSamples: 2 },
} satisfies ToolExample<Input, Output>;
export const phonemeWindowReferenceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "speech-therapy/phoneme-window-reference-gap",
    title: "Phoneme Window Reference Gap Tool",
    description:
      "Calculate phoneme window reference gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedStart: { type: "number" },
        observedEnd: { type: "number" },
        referenceStart: { type: "number" },
        referenceEnd: { type: "number" },
        samplePeriod: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "observedStart",
        "observedEnd",
        "referenceStart",
        "referenceEnd",
        "samplePeriod",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        onsetGap: { type: "number" },
        offsetGap: { type: "number" },
        durationGapInSamples: { type: "number" },
      },
      required: ["onsetGap", "offsetGap", "durationGapInSamples"],
    },
    ports: {
      inputs: [
        {
          id: "observedStart",
          label: "Observed Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "observedEnd",
          label: "Observed End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceStart",
          label: "Reference Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceEnd",
          label: "Reference End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "samplePeriod",
          label: "Sample Period",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "onsetGap", label: "Onset Gap", valueType: { type: "number" } },
        { id: "offsetGap", label: "Offset Gap", valueType: { type: "number" } },
        {
          id: "durationGapInSamples",
          label: "Duration Gap In Samples",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = phonemeWindowReferenceGapTool.execute;
export default phonemeWindowReferenceGapTool;
