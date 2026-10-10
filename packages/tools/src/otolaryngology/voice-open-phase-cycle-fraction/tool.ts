import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly openPhaseDuration: number;
  readonly cycleDuration: number;
};
export type Output = {
  readonly openFraction: number;
  readonly closedDuration: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    openPhaseDuration: { type: "number", minimum: 0 },
    cycleDuration: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["openPhaseDuration", "cycleDuration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    openFraction: { type: "number" },
    closedDuration: { type: "number" },
  },
  required: ["openFraction", "closedDuration"],
} as const;
/** Normalize explicitly marked open-phase time to one vocal cycle without estimating physiological validity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { openPhaseDuration, cycleDuration } = request;
  const compute = (): Output => {
    (H.domain(cycleDuration > 0, "cycleDuration"), cycleDuration);
    H.domain(
      openPhaseDuration >= 0 && openPhaseDuration <= cycleDuration,
      "openPhaseDuration",
    );
    return {
      openFraction: openPhaseDuration / cycleDuration,
      closedDuration: cycleDuration - openPhaseDuration,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { openPhaseDuration: 3, cycleDuration: 8 },
  output: { openFraction: 0.375, closedDuration: 5 },
} satisfies ToolExample<Input, Output>;
export const voiceOpenPhaseCycleFractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["otolaryngology", "health and medicine"],
      keywords: ["otolaryngology", "health and medicine"],
    },
    id: "otolaryngology/voice-open-phase-cycle-fraction",
    title: "Voice Open Phase Cycle Fraction",
    description:
      "Normalize explicitly marked open-phase time to one vocal cycle without estimating physiological validity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        openPhaseDuration: { type: "number", minimum: 0 },
        cycleDuration: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["openPhaseDuration", "cycleDuration"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        openFraction: { type: "number" },
        closedDuration: { type: "number" },
      },
      required: ["openFraction", "closedDuration"],
    },
    ports: {
      inputs: [
        {
          id: "openPhaseDuration",
          label: "Open Phase Duration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cycleDuration",
          label: "Cycle Duration",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "openFraction",
          label: "Open Fraction",
          valueType: { type: "number" },
        },
        {
          id: "closedDuration",
          label: "Closed Duration",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = voiceOpenPhaseCycleFractionTool.execute;
export default voiceOpenPhaseCycleFractionTool;
