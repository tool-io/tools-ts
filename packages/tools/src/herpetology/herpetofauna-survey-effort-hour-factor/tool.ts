import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observerMinutes: readonly number[];
  readonly minutesPerHour: number;
};
export type Output = { readonly observerHours: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observerMinutes: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    minutesPerHour: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["observerMinutes", "minutesPerHour"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { observerHours: { type: "number" } },
  required: ["observerHours"],
} as const;
/** Calculate herpetofauna survey effort hour factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observerMinutes, minutesPerHour } = request;
  const compute = (): Output => {
    H.domain(observerMinutes.every((x) => x >= 0));
    H.positive(minutesPerHour);
    return {
      observerHours:
        observerMinutes.reduce((a, b) => a + b, 0) / minutesPerHour,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observerMinutes: [30, 60], minutesPerHour: 60 },
  output: { observerHours: 1.5 },
} satisfies ToolExample<Input, Output>;
export const herpetofaunaSurveyEffortHourFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "herpetology/herpetofauna-survey-effort-hour-factor",
    title: "Herpetofauna Survey Effort Hour Factor Tool",
    description:
      "Calculate herpetofauna survey effort hour factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observerMinutes: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        minutesPerHour: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["observerMinutes", "minutesPerHour"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { observerHours: { type: "number" } },
      required: ["observerHours"],
    },
    ports: {
      inputs: [
        {
          id: "observerMinutes",
          label: "Observer Minutes",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "minutesPerHour",
          label: "Minutes Per Hour",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "observerHours",
          label: "Observer Hours",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = herpetofaunaSurveyEffortHourFactorTool.execute;
export default herpetofaunaSurveyEffortHourFactorTool;
