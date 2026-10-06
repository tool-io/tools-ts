import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly availableMinutes: number;
  readonly studyMinutes: number;
  readonly breakMinutes: number;
};
export type Output = {
  readonly remainingMinutes: number;
  readonly fits: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    availableMinutes: { type: "number", minimum: 0 },
    studyMinutes: { type: "number", minimum: 0 },
    breakMinutes: { type: "number", minimum: 0 },
  },
  required: ["availableMinutes", "studyMinutes", "breakMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    remainingMinutes: { type: "number" },
    fits: { type: "boolean" },
  },
  required: ["remainingMinutes", "fits"],
} as const;
/** Balance explicit study and nonoverlapping break durations against an available time window. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { availableMinutes, studyMinutes, breakMinutes } = request;
  const compute = (): Output => {
    H.domain(
      availableMinutes >= 0 && studyMinutes >= 0 && breakMinutes >= 0,
      "availableMinutes",
    );
    return {
      remainingMinutes: availableMinutes - studyMinutes - breakMinutes,
      fits: studyMinutes + breakMinutes <= availableMinutes,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { availableMinutes: 120, studyMinutes: 90, breakMinutes: 20 },
  output: { remainingMinutes: 10, fits: true },
} satisfies ToolExample<Input, Output>;
export const studyBreakAvailableMinuteBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["adult-education", "adult education", "education"],
      keywords: ["adult education", "education"],
    },
    id: "adult-education/study-break-available-minute-budget",
    title: "Study Break Available Minute Budget",
    description:
      "Balance explicit study and nonoverlapping break durations against an available time window.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        availableMinutes: { type: "number", minimum: 0 },
        studyMinutes: { type: "number", minimum: 0 },
        breakMinutes: { type: "number", minimum: 0 },
      },
      required: ["availableMinutes", "studyMinutes", "breakMinutes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        remainingMinutes: { type: "number" },
        fits: { type: "boolean" },
      },
      required: ["remainingMinutes", "fits"],
    },
    ports: {
      inputs: [
        {
          id: "availableMinutes",
          label: "Available Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "studyMinutes",
          label: "Study Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "breakMinutes",
          label: "Break Minutes",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "remainingMinutes",
          label: "Remaining Minutes",
          valueType: { type: "number" },
        },
        { id: "fits", label: "Fits", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = studyBreakAvailableMinuteBudgetTool.execute;
export default studyBreakAvailableMinuteBudgetTool;
