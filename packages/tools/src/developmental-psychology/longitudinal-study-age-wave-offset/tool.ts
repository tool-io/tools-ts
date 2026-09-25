import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly baselineAgeMonths: number;
  readonly elapsedMonths: number;
  readonly targetWaveAgeMonths: number;
};
export type Output = {
  readonly observedAgeMonths: number;
  readonly targetOffsetMonths: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    baselineAgeMonths: { type: "number", minimum: 0 },
    elapsedMonths: { type: "number", minimum: 0 },
    targetWaveAgeMonths: { type: "number", minimum: 0 },
  },
  required: ["baselineAgeMonths", "elapsedMonths", "targetWaveAgeMonths"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedAgeMonths: { type: "number" },
    targetOffsetMonths: { type: "number" },
  },
  required: ["observedAgeMonths", "targetOffsetMonths"],
} as const;
/** Calculate longitudinal study age wave offset from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { baselineAgeMonths, elapsedMonths, targetWaveAgeMonths } = request;
  const compute = (): Output => {
    H.domain(
      baselineAgeMonths >= 0 && elapsedMonths >= 0 && targetWaveAgeMonths >= 0,
    );
    return {
      observedAgeMonths: baselineAgeMonths + elapsedMonths,
      targetOffsetMonths:
        baselineAgeMonths + elapsedMonths - targetWaveAgeMonths,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { baselineAgeMonths: 12, elapsedMonths: 7, targetWaveAgeMonths: 18 },
  output: { observedAgeMonths: 19, targetOffsetMonths: 1 },
} satisfies ToolExample<Input, Output>;
export const longitudinalStudyAgeWaveOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "developmental-psychology/longitudinal-study-age-wave-offset",
    title: "Longitudinal Study Age Wave Offset Tool",
    description:
      "Calculate longitudinal study age wave offset from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        baselineAgeMonths: { type: "number", minimum: 0 },
        elapsedMonths: { type: "number", minimum: 0 },
        targetWaveAgeMonths: { type: "number", minimum: 0 },
      },
      required: ["baselineAgeMonths", "elapsedMonths", "targetWaveAgeMonths"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedAgeMonths: { type: "number" },
        targetOffsetMonths: { type: "number" },
      },
      required: ["observedAgeMonths", "targetOffsetMonths"],
    },
    ports: {
      inputs: [
        {
          id: "baselineAgeMonths",
          label: "Baseline Age Months",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "elapsedMonths",
          label: "Elapsed Months",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "targetWaveAgeMonths",
          label: "Target Wave Age Months",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "observedAgeMonths",
          label: "Observed Age Months",
          valueType: { type: "number" },
        },
        {
          id: "targetOffsetMonths",
          label: "Target Offset Months",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = longitudinalStudyAgeWaveOffsetTool.execute;
export default longitudinalStudyAgeWaveOffsetTool;
