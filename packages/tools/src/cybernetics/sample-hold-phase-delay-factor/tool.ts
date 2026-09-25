import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly frequencyHz: number;
  readonly sampleSeconds: number;
};
export type Output = {
  readonly phaseRadians: number;
  readonly equivalentDelay: number;
  readonly sincFactor: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    frequencyHz: { type: "number", minimum: 0 },
    sampleSeconds: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["frequencyHz", "sampleSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    phaseRadians: { type: "number" },
    equivalentDelay: { type: "number" },
    sincFactor: { type: "number" },
  },
  required: ["phaseRadians", "equivalentDelay", "sincFactor"],
} as const;
/** Normalized zero-order-hold response with a signed sinc factor and a separate linear phase term; the signed factor is not a nonnegative magnitude. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { frequencyHz, sampleSeconds } = request;
  const compute = (): Output => {
    H.domain(frequencyHz >= 0);
    H.positive(sampleSeconds);
    return {
      phaseRadians: -Math.PI * frequencyHz * sampleSeconds,
      equivalentDelay: sampleSeconds / 2,
      sincFactor:
        frequencyHz === 0
          ? 1
          : Math.sin(Math.PI * frequencyHz * sampleSeconds) /
            (Math.PI * frequencyHz * sampleSeconds),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { frequencyHz: 1, sampleSeconds: 0.5 },
  output: {
    phaseRadians: -1.5707963267948966,
    equivalentDelay: 0.25,
    sincFactor: 0.6366197723675814,
  },
} satisfies ToolExample<Input, Output>;
export const sampleHoldPhaseDelayFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cybernetics/sample-hold-phase-delay-factor",
    title: "Sample Hold Phase Delay Factor Tool",
    description:
      "Normalized zero-order-hold response with a signed sinc factor and a separate linear phase term; the signed factor is not a nonnegative magnitude.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        frequencyHz: { type: "number", minimum: 0 },
        sampleSeconds: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["frequencyHz", "sampleSeconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        phaseRadians: { type: "number" },
        equivalentDelay: { type: "number" },
        sincFactor: { type: "number" },
      },
      required: ["phaseRadians", "equivalentDelay", "sincFactor"],
    },
    ports: {
      inputs: [
        {
          id: "frequencyHz",
          label: "Frequency Hz",
          required: true,
          valueType: { type: "number", unit: "Hz" },
        },
        {
          id: "sampleSeconds",
          label: "Sample Seconds",
          required: true,
          valueType: { type: "number", unit: "s" },
        },
      ],
      outputs: [
        {
          id: "phaseRadians",
          label: "Phase Radians",
          valueType: { type: "number", unit: "rad" },
        },
        {
          id: "equivalentDelay",
          label: "Equivalent Delay",
          valueType: { type: "number" },
        },
        {
          id: "sincFactor",
          label: "Sinc Factor",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = sampleHoldPhaseDelayFactorTool.execute;
export default sampleHoldPhaseDelayFactorTool;
