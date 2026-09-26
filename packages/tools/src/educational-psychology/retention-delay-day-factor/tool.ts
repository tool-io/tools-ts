import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly elapsedHours: number;
  readonly hoursPerStudyDay: number;
};
export type Output = { readonly studyDays: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    elapsedHours: { type: "number", minimum: 0 },
    hoursPerStudyDay: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["elapsedHours", "hoursPerStudyDay"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { studyDays: { type: "number" } },
  required: ["studyDays"],
} as const;
/** Calculate retention delay day factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { elapsedHours, hoursPerStudyDay } = request;
  const compute = (): Output => {
    H.domain(elapsedHours >= 0);
    H.positive(hoursPerStudyDay);
    return { studyDays: elapsedHours / hoursPerStudyDay };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { elapsedHours: 48, hoursPerStudyDay: 24 },
  output: { studyDays: 2 },
} satisfies ToolExample<Input, Output>;
export const retentionDelayDayFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "educational-psychology/retention-delay-day-factor",
    title: "Retention Delay Day Factor Tool",
    description:
      "Calculate retention delay day factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        elapsedHours: { type: "number", minimum: 0 },
        hoursPerStudyDay: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["elapsedHours", "hoursPerStudyDay"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { studyDays: { type: "number" } },
      required: ["studyDays"],
    },
    ports: {
      inputs: [
        {
          id: "elapsedHours",
          label: "Elapsed Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "hoursPerStudyDay",
          label: "Hours Per Study Day",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "studyDays", label: "Study Days", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = retentionDelayDayFactorTool.execute;
export default retentionDelayDayFactorTool;
