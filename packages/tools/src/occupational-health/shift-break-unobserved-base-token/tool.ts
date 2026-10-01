import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly shiftMinutes: number;
  readonly breakMinutes: number;
  readonly unobservedMinutes: number;
  readonly excludeBreaks: boolean;
};
export type Output = {
  readonly denominatorMinutes: number;
  readonly observedMinutes: number;
  readonly observedFraction: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    shiftMinutes: { type: "number", minimum: 0 },
    breakMinutes: { type: "number", minimum: 0 },
    unobservedMinutes: { type: "number", minimum: 0 },
    excludeBreaks: { type: "boolean" },
  },
  required: [
    "shiftMinutes",
    "breakMinutes",
    "unobservedMinutes",
    "excludeBreaks",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    denominatorMinutes: { type: "number" },
    observedMinutes: { type: "number" },
    observedFraction: { type: "number" },
    defined: { type: "boolean" },
  },
  required: [
    "denominatorMinutes",
    "observedMinutes",
    "observedFraction",
    "defined",
  ],
} as const;
/** Calculate shift break unobserved base token from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { shiftMinutes, breakMinutes, unobservedMinutes, excludeBreaks } =
    request;
  const compute = (): Output => {
    H.domain(
      shiftMinutes >= 0 &&
        breakMinutes >= 0 &&
        unobservedMinutes >= 0 &&
        breakMinutes + unobservedMinutes <= shiftMinutes,
    );
    return {
      denominatorMinutes: shiftMinutes - (excludeBreaks ? breakMinutes : 0),
      observedMinutes: shiftMinutes - breakMinutes - unobservedMinutes,
      observedFraction:
        shiftMinutes - (excludeBreaks ? breakMinutes : 0) > 0
          ? (shiftMinutes - breakMinutes - unobservedMinutes) /
            (shiftMinutes - (excludeBreaks ? breakMinutes : 0))
          : 0,
      defined: shiftMinutes - (excludeBreaks ? breakMinutes : 0) > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    shiftMinutes: 480,
    breakMinutes: 60,
    unobservedMinutes: 20,
    excludeBreaks: true,
  },
  output: {
    denominatorMinutes: 420,
    observedMinutes: 400,
    observedFraction: 0.9523809523809523,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const shiftBreakUnobservedBaseTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "occupational-health/shift-break-unobserved-base-token",
    title: "Shift Break Unobserved Base Token Tool",
    description:
      "Calculate shift break unobserved base token from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        shiftMinutes: { type: "number", minimum: 0 },
        breakMinutes: { type: "number", minimum: 0 },
        unobservedMinutes: { type: "number", minimum: 0 },
        excludeBreaks: { type: "boolean" },
      },
      required: [
        "shiftMinutes",
        "breakMinutes",
        "unobservedMinutes",
        "excludeBreaks",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        denominatorMinutes: { type: "number" },
        observedMinutes: { type: "number" },
        observedFraction: { type: "number" },
        defined: { type: "boolean" },
      },
      required: [
        "denominatorMinutes",
        "observedMinutes",
        "observedFraction",
        "defined",
      ],
    },
    ports: {
      inputs: [
        {
          id: "shiftMinutes",
          label: "Shift Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "breakMinutes",
          label: "Break Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "unobservedMinutes",
          label: "Unobserved Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excludeBreaks",
          label: "Exclude Breaks",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "denominatorMinutes",
          label: "Denominator Minutes",
          valueType: { type: "number" },
        },
        {
          id: "observedMinutes",
          label: "Observed Minutes",
          valueType: { type: "number" },
        },
        {
          id: "observedFraction",
          label: "Observed Fraction",
          valueType: { type: "number" },
        },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = shiftBreakUnobservedBaseTokenTool.execute;
export default shiftBreakUnobservedBaseTokenTool;
