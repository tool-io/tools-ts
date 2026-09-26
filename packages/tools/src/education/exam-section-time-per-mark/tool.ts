import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly minutes: number;
  readonly marks: number;
  readonly reserveMinutes: number;
};
export type Output = { readonly minutesPerMark: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    minutes: { type: "number" },
    marks: { type: "number", exclusiveMinimum: 0 },
    reserveMinutes: { type: "number", minimum: 0 },
  },
  required: ["minutes", "marks", "reserveMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { minutesPerMark: { type: "number" } },
  required: ["minutesPerMark"],
} as const;
/** Calculate exam section time per mark from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { minutes, marks, reserveMinutes } = request;
  const compute = (): Output => {
    H.positive(marks);
    H.domain(reserveMinutes >= 0 && minutes >= reserveMinutes);
    return { minutesPerMark: (minutes - reserveMinutes) / marks };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { minutes: 60, marks: 40, reserveMinutes: 10 },
  output: { minutesPerMark: 1.25 },
} satisfies ToolExample<Input, Output>;
export const examSectionTimePerMarkTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "education/exam-section-time-per-mark",
    title: "Exam Section Time Per Mark Tool",
    description:
      "Calculate exam section time per mark from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        minutes: { type: "number" },
        marks: { type: "number", exclusiveMinimum: 0 },
        reserveMinutes: { type: "number", minimum: 0 },
      },
      required: ["minutes", "marks", "reserveMinutes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { minutesPerMark: { type: "number" } },
      required: ["minutesPerMark"],
    },
    ports: {
      inputs: [
        {
          id: "minutes",
          label: "Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "marks",
          label: "Marks",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reserveMinutes",
          label: "Reserve Minutes",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "minutesPerMark",
          label: "Minutes Per Mark",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = examSectionTimePerMarkTool.execute;
export default examSectionTimePerMarkTool;
