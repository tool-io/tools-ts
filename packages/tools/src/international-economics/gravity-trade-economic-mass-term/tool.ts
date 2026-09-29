import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstGdp: number;
  readonly secondGdp: number;
  readonly distance: number;
  readonly coefficient: number;
  readonly firstElasticity: number;
  readonly secondElasticity: number;
  readonly distanceElasticity: number;
};
export type Output = { readonly tradeReference: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstGdp: { type: "number", exclusiveMinimum: 0 },
    secondGdp: { type: "number", exclusiveMinimum: 0 },
    distance: { type: "number", exclusiveMinimum: 0 },
    coefficient: { type: "number", minimum: 0 },
    firstElasticity: { type: "number" },
    secondElasticity: { type: "number" },
    distanceElasticity: { type: "number" },
  },
  required: [
    "firstGdp",
    "secondGdp",
    "distance",
    "coefficient",
    "firstElasticity",
    "secondElasticity",
    "distanceElasticity",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { tradeReference: { type: "number" } },
  required: ["tradeReference"],
} as const;
/** One explicitly calibrated log-linear gravity-model level prediction without multilateral resistance or an estimation routine. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    firstGdp,
    secondGdp,
    distance,
    coefficient,
    firstElasticity,
    secondElasticity,
    distanceElasticity,
  } = request;
  const compute = (): Output => {
    H.positive(firstGdp);
    H.positive(secondGdp);
    H.positive(distance);
    H.domain(coefficient >= 0);
    return {
      tradeReference:
        (coefficient *
          firstGdp ** firstElasticity *
          secondGdp ** secondElasticity) /
        distance ** distanceElasticity,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstGdp: 100,
    secondGdp: 200,
    distance: 10,
    coefficient: 0.01,
    firstElasticity: 1,
    secondElasticity: 1,
    distanceElasticity: 2,
  },
  output: { tradeReference: 2 },
} satisfies ToolExample<Input, Output>;
export const gravityTradeEconomicMassTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "international-economics/gravity-trade-economic-mass-term",
    title: "Gravity Trade Economic Mass Term Tool",
    description:
      "One explicitly calibrated log-linear gravity-model level prediction without multilateral resistance or an estimation routine.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstGdp: { type: "number", exclusiveMinimum: 0 },
        secondGdp: { type: "number", exclusiveMinimum: 0 },
        distance: { type: "number", exclusiveMinimum: 0 },
        coefficient: { type: "number", minimum: 0 },
        firstElasticity: { type: "number" },
        secondElasticity: { type: "number" },
        distanceElasticity: { type: "number" },
      },
      required: [
        "firstGdp",
        "secondGdp",
        "distance",
        "coefficient",
        "firstElasticity",
        "secondElasticity",
        "distanceElasticity",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { tradeReference: { type: "number" } },
      required: ["tradeReference"],
    },
    ports: {
      inputs: [
        {
          id: "firstGdp",
          label: "First Gdp",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondGdp",
          label: "Second Gdp",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "distance",
          label: "Distance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "coefficient",
          label: "Coefficient",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstElasticity",
          label: "First Elasticity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondElasticity",
          label: "Second Elasticity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "distanceElasticity",
          label: "Distance Elasticity",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "tradeReference",
          label: "Trade Reference",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = gravityTradeEconomicMassTermTool.execute;
export default gravityTradeEconomicMassTermTool;
