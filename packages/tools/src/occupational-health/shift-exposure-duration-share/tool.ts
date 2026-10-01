import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly shiftDuration: number;
  readonly observedExposureDuration: number;
  readonly breakDuration: number;
  readonly excludeBreak: boolean;
};
export type Output = {
  readonly denominator: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    shiftDuration: { type: "number", minimum: 0 },
    observedExposureDuration: { type: "number", minimum: 0 },
    breakDuration: { type: "number", minimum: 0 },
    excludeBreak: { type: "boolean" },
  },
  required: [
    "shiftDuration",
    "observedExposureDuration",
    "breakDuration",
    "excludeBreak",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    denominator: { type: "number" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["denominator", "share", "defined"],
} as const;
/** Supplied exposure-time accounting without dose or occupational safety-limit assessment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    shiftDuration,
    observedExposureDuration,
    breakDuration,
    excludeBreak,
  } = request;
  const compute = (): Output => {
    H.domain(
      shiftDuration >= 0 &&
        breakDuration >= 0 &&
        breakDuration <= shiftDuration &&
        observedExposureDuration >= 0 &&
        observedExposureDuration <= shiftDuration - breakDuration,
    );
    return {
      denominator: shiftDuration - (excludeBreak ? breakDuration : 0),
      share:
        shiftDuration - (excludeBreak ? breakDuration : 0) > 0
          ? observedExposureDuration /
            (shiftDuration - (excludeBreak ? breakDuration : 0))
          : 0,
      defined: shiftDuration - (excludeBreak ? breakDuration : 0) > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    shiftDuration: 480,
    observedExposureDuration: 120,
    breakDuration: 60,
    excludeBreak: true,
  },
  output: { denominator: 420, share: 0.2857142857142857, defined: true },
} satisfies ToolExample<Input, Output>;
export const shiftExposureDurationShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "occupational-health/shift-exposure-duration-share",
    title: "Shift Exposure Duration Share Tool",
    description:
      "Supplied exposure-time accounting without dose or occupational safety-limit assessment.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        shiftDuration: { type: "number", minimum: 0 },
        observedExposureDuration: { type: "number", minimum: 0 },
        breakDuration: { type: "number", minimum: 0 },
        excludeBreak: { type: "boolean" },
      },
      required: [
        "shiftDuration",
        "observedExposureDuration",
        "breakDuration",
        "excludeBreak",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        denominator: { type: "number" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["denominator", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "shiftDuration",
          label: "Shift Duration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "observedExposureDuration",
          label: "Observed Exposure Duration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "breakDuration",
          label: "Break Duration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excludeBreak",
          label: "Exclude Break",
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
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = shiftExposureDurationShareTool.execute;
export default shiftExposureDurationShareTool;
