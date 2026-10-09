import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly attributableTripCost: number;
  readonly totalTripCost: number;
};
export type Output = {
  readonly attributedFraction: number;
  readonly otherCost: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    attributableTripCost: { type: "number", minimum: 0 },
    totalTripCost: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["attributableTripCost", "totalTripCost"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    attributedFraction: { type: "number" },
    otherCost: { type: "number" },
  },
  required: ["attributedFraction", "otherCost"],
} as const;
/** Return a caller-attributed recreation cost share without estimating willingness to pay. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { attributableTripCost, totalTripCost } = request;
  const compute = (): Output => {
    (H.domain(totalTripCost > 0, "totalTripCost"), totalTripCost);
    H.domain(
      attributableTripCost >= 0 && attributableTripCost <= totalTripCost,
      "attributableTripCost",
    );
    return {
      attributedFraction: attributableTripCost / totalTripCost,
      otherCost: totalTripCost - attributableTripCost,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { attributableTripCost: 30, totalTripCost: 120 },
  output: { attributedFraction: 0.25, otherCost: 90 },
} satisfies ToolExample<Input, Output>;
export const recreationTripCostShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "environmental-economics",
        "environmental economics",
        "economics",
      ],
      keywords: ["environmental economics", "economics"],
    },
    id: "environmental-economics/recreation-trip-cost-share",
    title: "Recreation Trip Cost Share",
    description:
      "Return a caller-attributed recreation cost share without estimating willingness to pay.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        attributableTripCost: { type: "number", minimum: 0 },
        totalTripCost: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["attributableTripCost", "totalTripCost"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        attributedFraction: { type: "number" },
        otherCost: { type: "number" },
      },
      required: ["attributedFraction", "otherCost"],
    },
    ports: {
      inputs: [
        {
          id: "attributableTripCost",
          label: "Attributable Trip Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalTripCost",
          label: "Total Trip Cost",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "attributedFraction",
          label: "Attributed Fraction",
          valueType: { type: "number" },
        },
        { id: "otherCost", label: "Other Cost", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = recreationTripCostShareTool.execute;
export default recreationTripCostShareTool;
