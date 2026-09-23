import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleIndex: number;
  readonly originSample: number;
  readonly sampleRateHertz: number;
  readonly suppliedTimeOrigin: number;
};
export type Output = {
  readonly timeSeconds: number;
  readonly relativeSeconds: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleIndex: { type: "integer" },
    originSample: { type: "integer" },
    sampleRateHertz: { type: "number", exclusiveMinimum: 0 },
    suppliedTimeOrigin: { type: "number" },
  },
  required: [
    "sampleIndex",
    "originSample",
    "sampleRateHertz",
    "suppliedTimeOrigin",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    timeSeconds: { type: "number" },
    relativeSeconds: { type: "number" },
  },
  required: ["timeSeconds", "relativeSeconds"],
} as const;
/** Map a supplied ECG research sample index to an explicit seconds origin without peak detection or rhythm interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampleIndex, originSample, sampleRateHertz, suppliedTimeOrigin } =
    request;
  const compute = (): Output => {
    H.positive(sampleRateHertz);
    return {
      timeSeconds:
        suppliedTimeOrigin +
        Number(BigInt(sampleIndex) - BigInt(originSample)) / sampleRateHertz,
      relativeSeconds:
        Number(BigInt(sampleIndex) - BigInt(originSample)) / sampleRateHertz,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sampleIndex: 120,
    originSample: 100,
    sampleRateHertz: 20,
    suppliedTimeOrigin: 5,
  },
  output: { timeSeconds: 6, relativeSeconds: 1 },
} satisfies ToolExample<Input, Output>;
export const ecgSampleToTimeFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cardiology/ecg-sample-to-time-factor",
    title: "ECG Sample To Time Factor Tool",
    description:
      "Map a supplied ECG research sample index to an explicit seconds origin without peak detection or rhythm interpretation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleIndex: { type: "integer" },
        originSample: { type: "integer" },
        sampleRateHertz: { type: "number", exclusiveMinimum: 0 },
        suppliedTimeOrigin: { type: "number" },
      },
      required: [
        "sampleIndex",
        "originSample",
        "sampleRateHertz",
        "suppliedTimeOrigin",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        timeSeconds: { type: "number" },
        relativeSeconds: { type: "number" },
      },
      required: ["timeSeconds", "relativeSeconds"],
    },
    ports: {
      inputs: [
        {
          id: "sampleIndex",
          label: "Sample Index",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "originSample",
          label: "Origin Sample",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "sampleRateHertz",
          label: "Sample Rate Hertz",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedTimeOrigin",
          label: "Supplied Time Origin",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "timeSeconds",
          label: "Time Seconds",
          valueType: { type: "number" },
        },
        {
          id: "relativeSeconds",
          label: "Relative Seconds",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = ecgSampleToTimeFactorTool.execute;
export default ecgSampleToTimeFactorTool;
