import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly year: number;
  readonly divisibleBy: number;
  readonly exceptDivisibleBy: number;
  readonly restoreDivisibleBy: number;
};
export type Output = { readonly leap: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    year: { type: "integer" },
    divisibleBy: { type: "integer", minimum: 1 },
    exceptDivisibleBy: { type: "integer", minimum: 1 },
    restoreDivisibleBy: { type: "integer", minimum: 1 },
  },
  required: ["year", "divisibleBy", "exceptDivisibleBy", "restoreDivisibleBy"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { leap: { type: "boolean" } },
  required: ["leap"],
} as const;
/** Apply a caller-defined Gregorian-shaped divisibility rule to astronomical integer years, without assuming a fictional calendar epoch. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { year, divisibleBy, exceptDivisibleBy, restoreDivisibleBy } = request;
  const compute = (): Output => {
    H.integer(divisibleBy, 1);
    H.integer(exceptDivisibleBy, 1);
    H.integer(restoreDivisibleBy, 1);
    H.domain(
      exceptDivisibleBy % divisibleBy === 0 &&
        restoreDivisibleBy % exceptDivisibleBy === 0,
    );
    return {
      leap:
        H.mod(year, divisibleBy) === 0 &&
        (H.mod(year, exceptDivisibleBy) !== 0 ||
          H.mod(year, restoreDivisibleBy) === 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    year: 2000,
    divisibleBy: 4,
    exceptDivisibleBy: 100,
    restoreDivisibleBy: 400,
  },
  output: { leap: true },
} satisfies ToolExample<Input, Output>;
export const fictionalCalendarLeapRuleStepTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "creative-writing/fictional-calendar-leap-rule-step",
    title: "Fictional Calendar Leap Rule Step Tool",
    description:
      "Apply a caller-defined Gregorian-shaped divisibility rule to astronomical integer years, without assuming a fictional calendar epoch.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        year: { type: "integer" },
        divisibleBy: { type: "integer", minimum: 1 },
        exceptDivisibleBy: { type: "integer", minimum: 1 },
        restoreDivisibleBy: { type: "integer", minimum: 1 },
      },
      required: [
        "year",
        "divisibleBy",
        "exceptDivisibleBy",
        "restoreDivisibleBy",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { leap: { type: "boolean" } },
      required: ["leap"],
    },
    ports: {
      inputs: [
        {
          id: "year",
          label: "Year",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "divisibleBy",
          label: "Divisible By",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "exceptDivisibleBy",
          label: "Except Divisible By",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "restoreDivisibleBy",
          label: "Restore Divisible By",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [{ id: "leap", label: "Leap", valueType: { type: "boolean" } }],
    },
  },
  calculate,
});
export const run = fictionalCalendarLeapRuleStepTool.execute;
export default fictionalCalendarLeapRuleStepTool;
