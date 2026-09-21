import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly baseMinutes: number;
  readonly scheduledMinutes: number;
  readonly extraFraction: number;
  readonly fixedExtra: number;
};
export type Output = {
  readonly requestedMinutes: number;
  readonly remaining: number;
  readonly fits: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    baseMinutes: { type: "number", minimum: 0 },
    scheduledMinutes: { type: "number", minimum: 0 },
    extraFraction: { type: "number", minimum: 0 },
    fixedExtra: { type: "number", minimum: 0 },
  },
  required: ["baseMinutes", "scheduledMinutes", "extraFraction", "fixedExtra"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requestedMinutes: { type: "number" },
    remaining: { type: "number" },
    fits: { type: "boolean" },
  },
  required: ["requestedMinutes", "remaining", "fits"],
} as const;
/** Budget explicit requested time adjustments without determining accommodation eligibility. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { baseMinutes, scheduledMinutes, extraFraction, fixedExtra } = request;
  const compute = (): Output => {
    H.domain(
      baseMinutes >= 0 &&
        scheduledMinutes >= 0 &&
        extraFraction >= 0 &&
        fixedExtra >= 0,
    );
    return {
      requestedMinutes: baseMinutes * (1 + extraFraction) + fixedExtra,
      remaining:
        scheduledMinutes - baseMinutes * (1 + extraFraction) - fixedExtra,
      fits: scheduledMinutes >= baseMinutes * (1 + extraFraction) + fixedExtra,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    baseMinutes: 60,
    scheduledMinutes: 100,
    extraFraction: 0.5,
    fixedExtra: 5,
  },
  output: { requestedMinutes: 95, remaining: 5, fits: true },
} satisfies ToolExample<Input, Output>;
export const courseSessionAccessibilityBufferTimeTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "adult-education/course-session-accessibility-buffer-time",
      title: "Course Session Accessibility Buffer Time Tool",
      description:
        "Budget explicit requested time adjustments without determining accommodation eligibility.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          baseMinutes: { type: "number", minimum: 0 },
          scheduledMinutes: { type: "number", minimum: 0 },
          extraFraction: { type: "number", minimum: 0 },
          fixedExtra: { type: "number", minimum: 0 },
        },
        required: [
          "baseMinutes",
          "scheduledMinutes",
          "extraFraction",
          "fixedExtra",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          requestedMinutes: { type: "number" },
          remaining: { type: "number" },
          fits: { type: "boolean" },
        },
        required: ["requestedMinutes", "remaining", "fits"],
      },
      ports: {
        inputs: [
          {
            id: "baseMinutes",
            label: "Base Minutes",
            required: true,
            valueType: { type: "number", unit: "min" },
          },
          {
            id: "scheduledMinutes",
            label: "Scheduled Minutes",
            required: true,
            valueType: { type: "number", unit: "min" },
          },
          {
            id: "extraFraction",
            label: "Extra Fraction",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "fixedExtra",
            label: "Fixed Extra",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "requestedMinutes",
            label: "Requested Minutes",
            valueType: { type: "number", unit: "min" },
          },
          {
            id: "remaining",
            label: "Remaining",
            valueType: { type: "number" },
          },
          { id: "fits", label: "Fits", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = courseSessionAccessibilityBufferTimeTool.execute;
export default courseSessionAccessibilityBufferTimeTool;
