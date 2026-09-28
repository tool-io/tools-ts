import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalTime: number;
  readonly phaseTime: number;
  readonly pausedTime: number;
  readonly useActiveBase: boolean;
};
export type Output = {
  readonly denominator: number;
  readonly phaseFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalTime: { type: "number", exclusiveMinimum: 0 },
    phaseTime: { type: "number", minimum: 0 },
    pausedTime: { type: "number", minimum: 0 },
    useActiveBase: { type: "boolean" },
  },
  required: ["totalTime", "phaseTime", "pausedTime", "useActiveBase"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    denominator: { type: "number" },
    phaseFraction: { type: "number" },
  },
  required: ["denominator", "phaseFraction"],
} as const;
/** Compare supplied study-phase duration to elapsed or pause-excluded time. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { totalTime, phaseTime, pausedTime, useActiveBase } = request;
  const compute = (): Output => {
    H.positive(totalTime);
    H.domain(
      pausedTime >= 0 &&
        pausedTime < totalTime &&
        phaseTime >= 0 &&
        phaseTime <= totalTime - pausedTime,
    );
    return {
      denominator: totalTime - (useActiveBase ? pausedTime : 0),
      phaseFraction: phaseTime / (totalTime - (useActiveBase ? pausedTime : 0)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { totalTime: 100, phaseTime: 20, pausedTime: 20, useActiveBase: true },
  output: { denominator: 80, phaseFraction: 0.25 },
} satisfies ToolExample<Input, Output>;
export const glpStudyPhaseTimeBaseFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "glp/glp-study-phase-time-base-flag",
    title: "GLP Study Phase Time Base Flag Tool",
    description:
      "Compare supplied study-phase duration to elapsed or pause-excluded time.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalTime: { type: "number", exclusiveMinimum: 0 },
        phaseTime: { type: "number", minimum: 0 },
        pausedTime: { type: "number", minimum: 0 },
        useActiveBase: { type: "boolean" },
      },
      required: ["totalTime", "phaseTime", "pausedTime", "useActiveBase"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        denominator: { type: "number" },
        phaseFraction: { type: "number" },
      },
      required: ["denominator", "phaseFraction"],
    },
    ports: {
      inputs: [
        {
          id: "totalTime",
          label: "Total Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "phaseTime",
          label: "Phase Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "pausedTime",
          label: "Paused Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "useActiveBase",
          label: "Use Active Base",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "denominator",
          label: "Denominator",
          valueType: { type: "number" },
        },
        {
          id: "phaseFraction",
          label: "Phase Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = glpStudyPhaseTimeBaseFlagTool.execute;
export default glpStudyPhaseTimeBaseFlagTool;
