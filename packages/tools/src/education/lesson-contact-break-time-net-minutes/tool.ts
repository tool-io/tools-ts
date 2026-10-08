import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly scheduledMinutes: number;
  readonly breakMinutes: number;
};
export type Output = { readonly contactMinutes: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scheduledMinutes: { type: "number", minimum: 0 },
    breakMinutes: { type: "number", minimum: 0 },
  },
  required: ["scheduledMinutes", "breakMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { contactMinutes: { type: "number" } },
  required: ["contactMinutes"],
} as const;
/** Subtract explicit lesson breaks from scheduled duration without establishing instructional contact-hour rules. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { scheduledMinutes, breakMinutes } = request;
  const compute = (): Output => {
    H.domain(
      scheduledMinutes >= 0 &&
        breakMinutes >= 0 &&
        breakMinutes <= scheduledMinutes,
      "scheduledMinutes",
    );
    return { contactMinutes: scheduledMinutes - breakMinutes };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { scheduledMinutes: 90, breakMinutes: 15 },
  output: { contactMinutes: 75 },
} satisfies ToolExample<Input, Output>;
export const lessonContactBreakTimeNetMinutesTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["education"],
      keywords: ["education"],
    },
    id: "education/lesson-contact-break-time-net-minutes",
    title: "Lesson Contact Break Time Net Minutes",
    description:
      "Subtract explicit lesson breaks from scheduled duration without establishing instructional contact-hour rules.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        scheduledMinutes: { type: "number", minimum: 0 },
        breakMinutes: { type: "number", minimum: 0 },
      },
      required: ["scheduledMinutes", "breakMinutes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { contactMinutes: { type: "number" } },
      required: ["contactMinutes"],
    },
    ports: {
      inputs: [
        {
          id: "scheduledMinutes",
          label: "Scheduled Minutes",
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
          id: "contactMinutes",
          label: "Contact Minutes",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = lessonContactBreakTimeNetMinutesTool.execute;
export default lessonContactBreakTimeNetMinutesTool;
