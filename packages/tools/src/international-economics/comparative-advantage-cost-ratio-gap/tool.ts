import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly homeFirst: number;
  readonly homeSecond: number;
  readonly foreignFirst: number;
  readonly foreignSecond: number;
};
export type Output = {
  readonly homeOpportunityCost: number;
  readonly foreignOpportunityCost: number;
  readonly gap: number;
  readonly homeAdvantage: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    homeFirst: { type: "number", exclusiveMinimum: 0 },
    homeSecond: { type: "number", exclusiveMinimum: 0 },
    foreignFirst: { type: "number", exclusiveMinimum: 0 },
    foreignSecond: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["homeFirst", "homeSecond", "foreignFirst", "foreignSecond"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    homeOpportunityCost: { type: "number" },
    foreignOpportunityCost: { type: "number" },
    gap: { type: "number" },
    homeAdvantage: { type: "boolean" },
  },
  required: [
    "homeOpportunityCost",
    "foreignOpportunityCost",
    "gap",
    "homeAdvantage",
  ],
} as const;
/** Calculate comparative advantage cost ratio gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { homeFirst, homeSecond, foreignFirst, foreignSecond } = request;
  const compute = (): Output => {
    H.positive(homeFirst);
    H.positive(homeSecond);
    H.positive(foreignFirst);
    H.positive(foreignSecond);
    return {
      homeOpportunityCost: homeFirst / homeSecond,
      foreignOpportunityCost: foreignFirst / foreignSecond,
      gap: homeFirst / homeSecond - foreignFirst / foreignSecond,
      homeAdvantage: homeFirst / homeSecond < foreignFirst / foreignSecond,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { homeFirst: 2, homeSecond: 4, foreignFirst: 3, foreignSecond: 3 },
  output: {
    homeOpportunityCost: 0.5,
    foreignOpportunityCost: 1,
    gap: -0.5,
    homeAdvantage: true,
  },
} satisfies ToolExample<Input, Output>;
export const comparativeAdvantageCostRatioGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "international-economics/comparative-advantage-cost-ratio-gap",
    title: "Comparative Advantage Cost Ratio Gap Tool",
    description:
      "Calculate comparative advantage cost ratio gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        homeFirst: { type: "number", exclusiveMinimum: 0 },
        homeSecond: { type: "number", exclusiveMinimum: 0 },
        foreignFirst: { type: "number", exclusiveMinimum: 0 },
        foreignSecond: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["homeFirst", "homeSecond", "foreignFirst", "foreignSecond"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        homeOpportunityCost: { type: "number" },
        foreignOpportunityCost: { type: "number" },
        gap: { type: "number" },
        homeAdvantage: { type: "boolean" },
      },
      required: [
        "homeOpportunityCost",
        "foreignOpportunityCost",
        "gap",
        "homeAdvantage",
      ],
    },
    ports: {
      inputs: [
        {
          id: "homeFirst",
          label: "Home First",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "homeSecond",
          label: "Home Second",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "foreignFirst",
          label: "Foreign First",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "foreignSecond",
          label: "Foreign Second",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "homeOpportunityCost",
          label: "Home Opportunity Cost",
          valueType: { type: "number" },
        },
        {
          id: "foreignOpportunityCost",
          label: "Foreign Opportunity Cost",
          valueType: { type: "number" },
        },
        { id: "gap", label: "Gap", valueType: { type: "number" } },
        {
          id: "homeAdvantage",
          label: "Home Advantage",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = comparativeAdvantageCostRatioGapTool.execute;
export default comparativeAdvantageCostRatioGapTool;
