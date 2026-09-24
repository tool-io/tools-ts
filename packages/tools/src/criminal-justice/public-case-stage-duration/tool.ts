import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly enteredDay: number;
  readonly exitedDay: number;
  readonly excludedDays: number;
};
export type Output = {
  readonly elapsedDays: number;
  readonly countedDays: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    enteredDay: { type: "integer" },
    exitedDay: { type: "integer" },
    excludedDays: { type: "integer", minimum: 0 },
  },
  required: ["enteredDay", "exitedDay", "excludedDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    elapsedDays: { type: "integer" },
    countedDays: { type: "integer" },
  },
  required: ["elapsedDays", "countedDays"],
} as const;
/** Measure supplied public case-stage timestamps without evaluating legal timeliness or individual risk. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { enteredDay, exitedDay, excludedDays } = request;
  const compute = (): Output => {
    H.domain(exitedDay >= enteredDay);
    H.integer(excludedDays, 0, exitedDay - enteredDay);
    return {
      elapsedDays: exitedDay - enteredDay,
      countedDays: exitedDay - enteredDay - excludedDays,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { enteredDay: 100, exitedDay: 130, excludedDays: 5 },
  output: { elapsedDays: 30, countedDays: 25 },
} satisfies ToolExample<Input, Output>;
export const publicCaseStageDurationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "criminal-justice/public-case-stage-duration",
    title: "Public Case Stage Duration Tool",
    description:
      "Measure supplied public case-stage timestamps without evaluating legal timeliness or individual risk.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        enteredDay: { type: "integer" },
        exitedDay: { type: "integer" },
        excludedDays: { type: "integer", minimum: 0 },
      },
      required: ["enteredDay", "exitedDay", "excludedDays"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        elapsedDays: { type: "integer" },
        countedDays: { type: "integer" },
      },
      required: ["elapsedDays", "countedDays"],
    },
    ports: {
      inputs: [
        {
          id: "enteredDay",
          label: "Entered Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "exitedDay",
          label: "Exited Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "excludedDays",
          label: "Excluded Days",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "elapsedDays",
          label: "Elapsed Days",
          valueType: { type: "integer" },
        },
        {
          id: "countedDays",
          label: "Counted Days",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = publicCaseStageDurationTool.execute;
export default publicCaseStageDurationTool;
