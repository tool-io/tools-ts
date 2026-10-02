import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recorded: number;
  readonly sourceQuantum: number;
  readonly targetQuantum: number;
};
export type Output = {
  readonly resolutionRatio: number;
  readonly targetSteps: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recorded: { type: "number", minimum: 0 },
    sourceQuantum: { type: "number", exclusiveMinimum: 0 },
    targetQuantum: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["recorded", "sourceQuantum", "targetQuantum"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    resolutionRatio: { type: "number" },
    targetSteps: { type: "number" },
  },
  required: ["resolutionRatio", "targetSteps"],
} as const;
/** Express a supplied bench measurement and source resolution in target quantum units, without clinical cutoffs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recorded, sourceQuantum, targetQuantum } = request;
  const compute = (): Output => {
    H.domain(recorded >= 0);
    H.positive(sourceQuantum);
    H.positive(targetQuantum);
    return {
      resolutionRatio: sourceQuantum / targetQuantum,
      targetSteps: recorded / targetQuantum,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recorded: 3, sourceQuantum: 0.5, targetQuantum: 0.25 },
  output: { resolutionRatio: 2, targetSteps: 12 },
} satisfies ToolExample<Input, Output>;
export const probeMeasurementResolutionFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "periodontology/probe-measurement-resolution-factor",
    title: "Probe Measurement Resolution Factor Tool",
    description:
      "Express a supplied bench measurement and source resolution in target quantum units, without clinical cutoffs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recorded: { type: "number", minimum: 0 },
        sourceQuantum: { type: "number", exclusiveMinimum: 0 },
        targetQuantum: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["recorded", "sourceQuantum", "targetQuantum"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        resolutionRatio: { type: "number" },
        targetSteps: { type: "number" },
      },
      required: ["resolutionRatio", "targetSteps"],
    },
    ports: {
      inputs: [
        {
          id: "recorded",
          label: "Recorded",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sourceQuantum",
          label: "Source Quantum",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "targetQuantum",
          label: "Target Quantum",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "resolutionRatio",
          label: "Resolution Ratio",
          valueType: { type: "number" },
        },
        {
          id: "targetSteps",
          label: "Target Steps",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = probeMeasurementResolutionFactorTool.execute;
export default probeMeasurementResolutionFactorTool;
