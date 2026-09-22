import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly airChangesPerHour: number;
  readonly hours: number;
  readonly initialExcess: number;
};
export type Output = {
  readonly retainedFraction: number;
  readonly finalExcess: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    airChangesPerHour: { type: "number", minimum: 0 },
    hours: { type: "number", minimum: 0 },
    initialExcess: { type: "number" },
  },
  required: ["airChangesPerHour", "hours", "initialExcess"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    retainedFraction: { type: "number" },
    finalExcess: { type: "number" },
  },
  required: ["retainedFraction", "finalExcess"],
} as const;
/** Well-mixed first-order excess concentration decay with no internal source or sorption. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { airChangesPerHour, hours, initialExcess } = request;
  const compute = (): Output => {
    H.domain(airChangesPerHour >= 0 && hours >= 0);
    return {
      retainedFraction: Math.exp(-airChangesPerHour * hours),
      finalExcess: initialExcess * Math.exp(-airChangesPerHour * hours),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { airChangesPerHour: 0.5, hours: 2, initialExcess: 100 },
  output: {
    retainedFraction: 0.36787944117144233,
    finalExcess: 36.787944117144235,
  },
} satisfies ToolExample<Input, Output>;
export const displayCaseAirExchangeOneIntervalTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "art-conservation/display-case-air-exchange-one-interval",
    title: "Display Case Air Exchange One Interval Tool",
    description:
      "Well-mixed first-order excess concentration decay with no internal source or sorption.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        airChangesPerHour: { type: "number", minimum: 0 },
        hours: { type: "number", minimum: 0 },
        initialExcess: { type: "number" },
      },
      required: ["airChangesPerHour", "hours", "initialExcess"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        retainedFraction: { type: "number" },
        finalExcess: { type: "number" },
      },
      required: ["retainedFraction", "finalExcess"],
    },
    ports: {
      inputs: [
        {
          id: "airChangesPerHour",
          label: "Air Changes Per Hour",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "hours",
          label: "Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "initialExcess",
          label: "Initial Excess",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "retainedFraction",
          label: "Retained Fraction",
          valueType: { type: "number" },
        },
        {
          id: "finalExcess",
          label: "Final Excess",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = displayCaseAirExchangeOneIntervalTool.execute;
export default displayCaseAirExchangeOneIntervalTool;
