import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pulses: number;
  readonly firstOnset: number;
  readonly lastOnset: number;
};
export type Output = {
  readonly intervalCount: number;
  readonly meanInterval: number;
  readonly pulseRate: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pulses: { type: "integer", minimum: 2 },
    firstOnset: { type: "number" },
    lastOnset: { type: "number" },
  },
  required: ["pulses", "firstOnset", "lastOnset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    intervalCount: { type: "integer" },
    meanInterval: { type: "number" },
    pulseRate: { type: "number" },
  },
  required: ["intervalCount", "meanInterval", "pulseRate"],
} as const;
/** N pulses span N-1 onset intervals; rate excludes the endpoint-counting bias of N divided by first-to-last duration. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pulses, firstOnset, lastOnset } = request;
  const compute = (): Output => {
    H.integer(pulses, 2);
    H.domain(lastOnset > firstOnset);
    return {
      intervalCount: pulses - 1,
      meanInterval: (lastOnset - firstOnset) / (pulses - 1),
      pulseRate: (pulses - 1) / (lastOnset - firstOnset),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { pulses: 6, firstOnset: 0, lastOnset: 1 },
  output: { intervalCount: 5, meanInterval: 0.2, pulseRate: 5 },
} satisfies ToolExample<Input, Output>;
export const frogCallPulseIntervalRateTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "herpetology/frog-call-pulse-interval-rate-term",
    title: "Frog Call Pulse Interval Rate Term Tool",
    description:
      "N pulses span N-1 onset intervals; rate excludes the endpoint-counting bias of N divided by first-to-last duration.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pulses: { type: "integer", minimum: 2 },
        firstOnset: { type: "number" },
        lastOnset: { type: "number" },
      },
      required: ["pulses", "firstOnset", "lastOnset"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        intervalCount: { type: "integer" },
        meanInterval: { type: "number" },
        pulseRate: { type: "number" },
      },
      required: ["intervalCount", "meanInterval", "pulseRate"],
    },
    ports: {
      inputs: [
        {
          id: "pulses",
          label: "Pulses",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "firstOnset",
          label: "First Onset",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lastOnset",
          label: "Last Onset",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "intervalCount",
          label: "Interval Count",
          valueType: { type: "integer" },
        },
        {
          id: "meanInterval",
          label: "Mean Interval",
          valueType: { type: "number" },
        },
        { id: "pulseRate", label: "Pulse Rate", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = frogCallPulseIntervalRateTermTool.execute;
export default frogCallPulseIntervalRateTermTool;
