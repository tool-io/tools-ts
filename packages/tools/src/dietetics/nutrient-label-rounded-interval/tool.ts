import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly displayedAmount: number;
  readonly roundingIncrement: number;
};
export type Output = {
  readonly lowerBound: number;
  readonly upperBoundExclusive: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    displayedAmount: { type: "number", minimum: 0 },
    roundingIncrement: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["displayedAmount", "roundingIncrement"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lowerBound: { type: "number" },
    upperBoundExclusive: { type: "number" },
  },
  required: ["lowerBound", "upperBoundExclusive"],
} as const;
/** Describe the nonnegative interval for ordinary nearest-increment half-up rounding, without applying jurisdiction-specific nutrient-label rules. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { displayedAmount, roundingIncrement } = request;
  const compute = (): Output => {
    H.domain(displayedAmount >= 0, "displayedAmount");
    (H.domain(roundingIncrement > 0, "roundingIncrement"), roundingIncrement);
    return {
      lowerBound: Math.max(0, displayedAmount - roundingIncrement / 2),
      upperBoundExclusive: displayedAmount + roundingIncrement / 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { displayedAmount: 10, roundingIncrement: 1 },
  output: { lowerBound: 9.5, upperBoundExclusive: 10.5 },
} satisfies ToolExample<Input, Output>;
export const nutrientLabelRoundedIntervalTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["dietetics", "health and medicine"],
      keywords: ["dietetics", "health and medicine"],
    },
    id: "dietetics/nutrient-label-rounded-interval",
    title: "Nutrient Label Rounded Interval",
    description:
      "Describe the nonnegative interval for ordinary nearest-increment half-up rounding, without applying jurisdiction-specific nutrient-label rules.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        displayedAmount: { type: "number", minimum: 0 },
        roundingIncrement: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["displayedAmount", "roundingIncrement"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lowerBound: { type: "number" },
        upperBoundExclusive: { type: "number" },
      },
      required: ["lowerBound", "upperBoundExclusive"],
    },
    ports: {
      inputs: [
        {
          id: "displayedAmount",
          label: "Displayed Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "roundingIncrement",
          label: "Rounding Increment",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "lowerBound",
          label: "Lower Bound",
          valueType: { type: "number" },
        },
        {
          id: "upperBoundExclusive",
          label: "Upper Bound Exclusive",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = nutrientLabelRoundedIntervalTool.execute;
export default nutrientLabelRoundedIntervalTool;
