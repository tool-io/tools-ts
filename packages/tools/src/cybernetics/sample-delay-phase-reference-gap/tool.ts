import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly angularFrequency: number;
  readonly delaySamples: number;
  readonly samplePeriod: number;
  readonly referencePhase: number;
};
export type Output = { readonly phaseLag: number; readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    angularFrequency: { type: "number" },
    delaySamples: { type: "integer", minimum: 0 },
    samplePeriod: { type: "number", exclusiveMinimum: 0 },
    referencePhase: { type: "number" },
  },
  required: [
    "angularFrequency",
    "delaySamples",
    "samplePeriod",
    "referencePhase",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { phaseLag: { type: "number" }, signedGap: { type: "number" } },
  required: ["phaseLag", "signedGap"],
} as const;
/** Compare a pure-delay unwrapped phase lag with an explicit reference under the exp(i*omega*t) convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { angularFrequency, delaySamples, samplePeriod, referencePhase } =
    request;
  const compute = (): Output => {
    H.integer(delaySamples, 0);
    H.positive(samplePeriod);
    return {
      phaseLag: -angularFrequency * delaySamples * samplePeriod,
      signedGap:
        -angularFrequency * delaySamples * samplePeriod - referencePhase,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    angularFrequency: 2,
    delaySamples: 3,
    samplePeriod: 0.5,
    referencePhase: -2,
  },
  output: { phaseLag: -3, signedGap: -1 },
} satisfies ToolExample<Input, Output>;
export const sampleDelayPhaseReferenceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cybernetics/sample-delay-phase-reference-gap",
    title: "Sample Delay Phase Reference Gap Tool",
    description:
      "Compare a pure-delay unwrapped phase lag with an explicit reference under the exp(i*omega*t) convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        angularFrequency: { type: "number" },
        delaySamples: { type: "integer", minimum: 0 },
        samplePeriod: { type: "number", exclusiveMinimum: 0 },
        referencePhase: { type: "number" },
      },
      required: [
        "angularFrequency",
        "delaySamples",
        "samplePeriod",
        "referencePhase",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        phaseLag: { type: "number" },
        signedGap: { type: "number" },
      },
      required: ["phaseLag", "signedGap"],
    },
    ports: {
      inputs: [
        {
          id: "angularFrequency",
          label: "Angular Frequency",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "delaySamples",
          label: "Delay Samples",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "samplePeriod",
          label: "Sample Period",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referencePhase",
          label: "Reference Phase",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "phaseLag", label: "Phase Lag", valueType: { type: "number" } },
        { id: "signedGap", label: "Signed Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = sampleDelayPhaseReferenceGapTool.execute;
export default sampleDelayPhaseReferenceGapTool;
