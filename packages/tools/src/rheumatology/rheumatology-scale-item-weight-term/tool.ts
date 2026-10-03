import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly item: number;
  readonly anchor: number;
  readonly weight: number;
  readonly availableWeight: number;
  readonly totalWeight: number;
};
export type Output = {
  readonly weightedDeviation: number;
  readonly availableShare: number;
  readonly normalizedContribution: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    item: { type: "number" },
    anchor: { type: "number" },
    weight: { type: "number", minimum: 0 },
    availableWeight: { type: "number", exclusiveMinimum: 0 },
    totalWeight: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["item", "anchor", "weight", "availableWeight", "totalWeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    weightedDeviation: { type: "number" },
    availableShare: { type: "number" },
    normalizedContribution: { type: "number" },
  },
  required: ["weightedDeviation", "availableShare", "normalizedContribution"],
} as const;
/** One anchor-centered research item contribution using available weight. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { item, anchor, weight, availableWeight, totalWeight } = request;
  const compute = (): Output => {
    H.domain(
      weight >= 0 &&
        weight <= availableWeight &&
        availableWeight <= totalWeight,
      "weight",
    );
    H.positive(availableWeight);
    H.positive(totalWeight);
    return {
      weightedDeviation: (item - anchor) * weight,
      availableShare: availableWeight / totalWeight,
      normalizedContribution: ((item - anchor) * weight) / availableWeight,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    item: 4,
    anchor: 2,
    weight: 3,
    availableWeight: 10,
    totalWeight: 12,
  },
  output: {
    weightedDeviation: 6,
    availableShare: 0.8333333333333334,
    normalizedContribution: 0.6,
  },
} satisfies ToolExample<Input, Output>;
export const rheumatologyScaleItemWeightTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "rheumatology/rheumatology-scale-item-weight-term",
    title: "Rheumatology Scale Item Weight Term Tool",
    description:
      "One anchor-centered research item contribution using available weight.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        item: { type: "number" },
        anchor: { type: "number" },
        weight: { type: "number", minimum: 0 },
        availableWeight: { type: "number", exclusiveMinimum: 0 },
        totalWeight: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["item", "anchor", "weight", "availableWeight", "totalWeight"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        weightedDeviation: { type: "number" },
        availableShare: { type: "number" },
        normalizedContribution: { type: "number" },
      },
      required: [
        "weightedDeviation",
        "availableShare",
        "normalizedContribution",
      ],
    },
    ports: {
      inputs: [
        {
          id: "item",
          label: "Item",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "anchor",
          label: "Anchor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "weight",
          label: "Weight",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "availableWeight",
          label: "Available Weight",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalWeight",
          label: "Total Weight",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "weightedDeviation",
          label: "Weighted Deviation",
          valueType: { type: "number" },
        },
        {
          id: "availableShare",
          label: "Available Share",
          valueType: { type: "number" },
        },
        {
          id: "normalizedContribution",
          label: "Normalized Contribution",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = rheumatologyScaleItemWeightTermTool.execute;
export default rheumatologyScaleItemWeightTermTool;
