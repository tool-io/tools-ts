import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly earlierDiscountFactor: number;
  readonly laterDiscountFactor: number;
};
export type Output = {
  readonly forwardDiscountFactor: number;
  readonly forwardGrowthFactor: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    earlierDiscountFactor: { type: "number", exclusiveMinimum: 0 },
    laterDiscountFactor: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["earlierDiscountFactor", "laterDiscountFactor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    forwardDiscountFactor: { type: "number" },
    forwardGrowthFactor: { type: "number" },
  },
  required: ["forwardDiscountFactor", "forwardGrowthFactor"],
} as const;
/** Take the ratio of explicit compatible discount factors without interpolating a curve or annualizing a rate. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { earlierDiscountFactor, laterDiscountFactor } = request;
  const compute = (): Output => {
    (H.domain(earlierDiscountFactor > 0, "earlierDiscountFactor"),
      earlierDiscountFactor);
    (H.domain(laterDiscountFactor > 0, "laterDiscountFactor"),
      laterDiscountFactor);
    return {
      forwardDiscountFactor: laterDiscountFactor / earlierDiscountFactor,
      forwardGrowthFactor: earlierDiscountFactor / laterDiscountFactor,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { earlierDiscountFactor: 0.96, laterDiscountFactor: 0.9 },
  output: {
    forwardDiscountFactor: 0.9375000000000001,
    forwardGrowthFactor: 1.0666666666666667,
  },
} satisfies ToolExample<Input, Output>;
export const forwardPeriodDiscountRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "trading"],
      fields: ["financial-economics", "financial economics", "economics"],
      keywords: ["financial economics", "economics"],
    },
    id: "financial-economics/forward-period-discount-ratio",
    title: "Forward Period Discount Ratio",
    description:
      "Take the ratio of explicit compatible discount factors without interpolating a curve or annualizing a rate.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        earlierDiscountFactor: { type: "number", exclusiveMinimum: 0 },
        laterDiscountFactor: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["earlierDiscountFactor", "laterDiscountFactor"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        forwardDiscountFactor: { type: "number" },
        forwardGrowthFactor: { type: "number" },
      },
      required: ["forwardDiscountFactor", "forwardGrowthFactor"],
    },
    ports: {
      inputs: [
        {
          id: "earlierDiscountFactor",
          label: "Earlier Discount Factor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "laterDiscountFactor",
          label: "Later Discount Factor",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "forwardDiscountFactor",
          label: "Forward Discount Factor",
          valueType: { type: "number" },
        },
        {
          id: "forwardGrowthFactor",
          label: "Forward Growth Factor",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = forwardPeriodDiscountRatioTool.execute;
export default forwardPeriodDiscountRatioTool;
