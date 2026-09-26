import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly phaseDifference: number;
  readonly period: number;
};
export type Output = {
  readonly wrappedDifference: number;
  readonly halfCycleTie: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    phaseDifference: { type: "number" },
    period: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["phaseDifference", "period"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wrappedDifference: { type: "number" },
    halfCycleTie: { type: "boolean" },
  },
  required: ["wrappedDifference", "halfCycleTie"],
} as const;
/** Flag an exact half-cycle phase separation in supplied periodic observations. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { phaseDifference, period } = request;
  const compute = (): Output => {
    H.positive(period);
    let wrappedDifference = phaseDifference % period;
    if (wrappedDifference < 0) wrappedDifference += period;
    return {
      wrappedDifference,
      halfCycleTie: wrappedDifference === period / 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { phaseDifference: 5, period: 10 },
  output: { wrappedDifference: 5, halfCycleTie: true },
} satisfies ToolExample<Input, Output>;
export const wingBeatHalfCycleAmbiguityTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "entomology/wing-beat-half-cycle-ambiguity",
    title: "Wing Beat Half Cycle Ambiguity Tool",
    description:
      "Flag an exact half-cycle phase separation in supplied periodic observations.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        phaseDifference: { type: "number" },
        period: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["phaseDifference", "period"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        wrappedDifference: { type: "number" },
        halfCycleTie: { type: "boolean" },
      },
      required: ["wrappedDifference", "halfCycleTie"],
    },
    ports: {
      inputs: [
        {
          id: "phaseDifference",
          label: "Phase Difference",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "period",
          label: "Period",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "wrappedDifference",
          label: "Wrapped Difference",
          valueType: { type: "number" },
        },
        {
          id: "halfCycleTie",
          label: "Half Cycle Tie",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = wingBeatHalfCycleAmbiguityTool.execute;
export default wingBeatHalfCycleAmbiguityTool;
