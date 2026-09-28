import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly nominalPrice: number;
  readonly sourceIndex: number;
  readonly targetIndex: number;
  readonly sourceKnown: boolean;
};
export type Output = {
  readonly comparable: boolean;
  readonly rebasedPrice: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nominalPrice: { type: "number" },
    sourceIndex: { type: "number", exclusiveMinimum: 0 },
    targetIndex: { type: "number", exclusiveMinimum: 0 },
    sourceKnown: { type: "boolean" },
  },
  required: ["nominalPrice", "sourceIndex", "targetIndex", "sourceKnown"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    comparable: { type: "boolean" },
    rebasedPrice: { type: "number" },
  },
  required: ["comparable", "rebasedPrice"],
} as const;
/** Supplied comparable-index rebasing, with unknown source basis explicitly flagged. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { nominalPrice, sourceIndex, targetIndex, sourceKnown } = request;
  const compute = (): Output => {
    H.positive(sourceIndex);
    H.positive(targetIndex);
    return {
      comparable: sourceKnown,
      rebasedPrice: sourceKnown
        ? (nominalPrice * targetIndex) / sourceIndex
        : 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    nominalPrice: 100,
    sourceIndex: 80,
    targetIndex: 120,
    sourceKnown: true,
  },
  output: { comparable: true, rebasedPrice: 150 },
} satisfies ToolExample<Input, Output>;
export const internationalPriceYearBaseFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "global-studies/international-price-year-base-flag",
    title: "International Price Year Base Flag Tool",
    description:
      "Supplied comparable-index rebasing, with unknown source basis explicitly flagged.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nominalPrice: { type: "number" },
        sourceIndex: { type: "number", exclusiveMinimum: 0 },
        targetIndex: { type: "number", exclusiveMinimum: 0 },
        sourceKnown: { type: "boolean" },
      },
      required: ["nominalPrice", "sourceIndex", "targetIndex", "sourceKnown"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        comparable: { type: "boolean" },
        rebasedPrice: { type: "number" },
      },
      required: ["comparable", "rebasedPrice"],
    },
    ports: {
      inputs: [
        {
          id: "nominalPrice",
          label: "Nominal Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sourceIndex",
          label: "Source Index",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "targetIndex",
          label: "Target Index",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sourceKnown",
          label: "Source Known",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "comparable",
          label: "Comparable",
          valueType: { type: "boolean" },
        },
        {
          id: "rebasedPrice",
          label: "Rebased Price",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = internationalPriceYearBaseFlagTool.execute;
export default internationalPriceYearBaseFlagTool;
