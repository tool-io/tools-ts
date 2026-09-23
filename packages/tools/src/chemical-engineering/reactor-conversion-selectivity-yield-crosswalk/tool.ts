import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly feedReactant: number;
  readonly conversion: number;
  readonly selectivity: number;
  readonly productPerReactant: number;
};
export type Output = {
  readonly consumedReactant: number;
  readonly desiredProduct: number;
  readonly feedBasisYield: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    feedReactant: { type: "number", minimum: 0 },
    conversion: { type: "number", minimum: 0, maximum: 1 },
    selectivity: { type: "number", minimum: 0, maximum: 1 },
    productPerReactant: { type: "number", minimum: 0 },
  },
  required: ["feedReactant", "conversion", "selectivity", "productPerReactant"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    consumedReactant: { type: "number" },
    desiredProduct: { type: "number" },
    feedBasisYield: { type: "number" },
  },
  required: ["consumedReactant", "desiredProduct", "feedBasisYield"],
} as const;
/** Selectivity is the fraction of consumed reactant routed to the desired product; stoichiometric product factor is applied separately. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { feedReactant, conversion, selectivity, productPerReactant } = request;
  const compute = (): Output => {
    H.domain(feedReactant >= 0 && productPerReactant >= 0);
    H.probability(conversion);
    H.probability(selectivity);
    return {
      consumedReactant: feedReactant * conversion,
      desiredProduct:
        feedReactant * conversion * selectivity * productPerReactant,
      feedBasisYield: conversion * selectivity,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    feedReactant: 100,
    conversion: 0.8,
    selectivity: 0.5,
    productPerReactant: 2,
  },
  output: { consumedReactant: 80, desiredProduct: 80, feedBasisYield: 0.4 },
} satisfies ToolExample<Input, Output>;
export const reactorConversionSelectivityYieldCrosswalkTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "chemical-engineering/reactor-conversion-selectivity-yield-crosswalk",
      title: "Reactor Conversion Selectivity Yield Crosswalk Tool",
      description:
        "Selectivity is the fraction of consumed reactant routed to the desired product; stoichiometric product factor is applied separately.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          feedReactant: { type: "number", minimum: 0 },
          conversion: { type: "number", minimum: 0, maximum: 1 },
          selectivity: { type: "number", minimum: 0, maximum: 1 },
          productPerReactant: { type: "number", minimum: 0 },
        },
        required: [
          "feedReactant",
          "conversion",
          "selectivity",
          "productPerReactant",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          consumedReactant: { type: "number" },
          desiredProduct: { type: "number" },
          feedBasisYield: { type: "number" },
        },
        required: ["consumedReactant", "desiredProduct", "feedBasisYield"],
      },
      ports: {
        inputs: [
          {
            id: "feedReactant",
            label: "Feed Reactant",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "conversion",
            label: "Conversion",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "selectivity",
            label: "Selectivity",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "productPerReactant",
            label: "Product Per Reactant",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "consumedReactant",
            label: "Consumed Reactant",
            valueType: { type: "number" },
          },
          {
            id: "desiredProduct",
            label: "Desired Product",
            valueType: { type: "number" },
          },
          {
            id: "feedBasisYield",
            label: "Feed Basis Yield",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = reactorConversionSelectivityYieldCrosswalkTool.execute;
export default reactorConversionSelectivityYieldCrosswalkTool;
