import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly initialGaugePressure: number;
  readonly finalGaugePressure: number;
  readonly duration: number;
  readonly testVolume: number;
};
export type Output = {
  readonly decayRate: number;
  readonly exponentialTimeConstant: number;
  readonly linearEquivalentLeak: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initialGaugePressure: { type: "number" },
    finalGaugePressure: { type: "number", exclusiveMinimum: 0 },
    duration: { type: "number", exclusiveMinimum: 0 },
    testVolume: { type: "number", minimum: 0 },
  },
  required: [
    "initialGaugePressure",
    "finalGaugePressure",
    "duration",
    "testVolume",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    decayRate: { type: "number" },
    exponentialTimeConstant: { type: "number" },
    linearEquivalentLeak: { type: "number" },
  },
  required: ["decayRate", "exponentialTimeConstant", "linearEquivalentLeak"],
} as const;
/** Descriptive bench pressure-decay rate and initial-pressure-normalized volume loss proxy, not a compressible leak-orifice model or safety test. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { initialGaugePressure, finalGaugePressure, duration, testVolume } =
    request;
  const compute = (): Output => {
    H.domain(
      initialGaugePressure > finalGaugePressure &&
        finalGaugePressure > 0 &&
        testVolume >= 0,
    );
    H.positive(duration);
    return {
      decayRate:
        -Math.log(finalGaugePressure / initialGaugePressure) / duration,
      exponentialTimeConstant:
        duration / -Math.log(finalGaugePressure / initialGaugePressure),
      linearEquivalentLeak:
        (testVolume * (initialGaugePressure - finalGaugePressure)) /
        (initialGaugePressure * duration),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    initialGaugePressure: 100,
    finalGaugePressure: 50,
    duration: 10,
    testVolume: 2,
  },
  output: {
    decayRate: 0.06931471805599453,
    exponentialTimeConstant: 14.426950408889635,
    linearEquivalentLeak: 0.1,
  },
} satisfies ToolExample<Input, Output>;
export const pulmonaryDeviceLeakDecayTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pulmonology/pulmonary-device-leak-decay-term",
    title: "Pulmonary Device Leak Decay Term Tool",
    description:
      "Descriptive bench pressure-decay rate and initial-pressure-normalized volume loss proxy, not a compressible leak-orifice model or safety test.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        initialGaugePressure: { type: "number" },
        finalGaugePressure: { type: "number", exclusiveMinimum: 0 },
        duration: { type: "number", exclusiveMinimum: 0 },
        testVolume: { type: "number", minimum: 0 },
      },
      required: [
        "initialGaugePressure",
        "finalGaugePressure",
        "duration",
        "testVolume",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        decayRate: { type: "number" },
        exponentialTimeConstant: { type: "number" },
        linearEquivalentLeak: { type: "number" },
      },
      required: [
        "decayRate",
        "exponentialTimeConstant",
        "linearEquivalentLeak",
      ],
    },
    ports: {
      inputs: [
        {
          id: "initialGaugePressure",
          label: "Initial Gauge Pressure",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "finalGaugePressure",
          label: "Final Gauge Pressure",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "duration",
          label: "Duration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "testVolume",
          label: "Test Volume",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "decayRate", label: "Decay Rate", valueType: { type: "number" } },
        {
          id: "exponentialTimeConstant",
          label: "Exponential Time Constant",
          valueType: { type: "number" },
        },
        {
          id: "linearEquivalentLeak",
          label: "Linear Equivalent Leak",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = pulmonaryDeviceLeakDecayTermTool.execute;
export default pulmonaryDeviceLeakDecayTermTool;
