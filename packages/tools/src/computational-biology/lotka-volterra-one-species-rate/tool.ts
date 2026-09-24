import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly prey: number;
  readonly predators: number;
  readonly preyGrowth: number;
  readonly predation: number;
  readonly conversion: number;
  readonly predatorMortality: number;
};
export type Output = {
  readonly preyRate: number;
  readonly predatorRate: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    prey: { type: "number", minimum: 0 },
    predators: { type: "number", minimum: 0 },
    preyGrowth: { type: "number", minimum: 0 },
    predation: { type: "number", minimum: 0 },
    conversion: { type: "number", minimum: 0 },
    predatorMortality: { type: "number", minimum: 0 },
  },
  required: [
    "prey",
    "predators",
    "preyGrowth",
    "predation",
    "conversion",
    "predatorMortality",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    preyRate: { type: "number" },
    predatorRate: { type: "number" },
  },
  required: ["preyRate", "predatorRate"],
} as const;
/** Calculate lotka volterra one species rate from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    prey,
    predators,
    preyGrowth,
    predation,
    conversion,
    predatorMortality,
  } = request;
  const compute = (): Output => {
    H.domain(
      prey >= 0 &&
        predators >= 0 &&
        preyGrowth >= 0 &&
        predation >= 0 &&
        conversion >= 0 &&
        predatorMortality >= 0,
    );
    const predationFlux = predation * prey * predators;
    return {
      preyRate: preyGrowth * prey - predationFlux,
      predatorRate: conversion * predationFlux - predatorMortality * predators,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    prey: 10,
    predators: 2,
    preyGrowth: 1,
    predation: 0.1,
    conversion: 0.5,
    predatorMortality: 0.2,
  },
  output: { preyRate: 8, predatorRate: 0.6 },
} satisfies ToolExample<Input, Output>;
export const lotkaVolterraOneSpeciesRateTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "computational-biology/lotka-volterra-one-species-rate",
    title: "Lotka Volterra One Species Rate Tool",
    description:
      "Calculate lotka volterra one species rate from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        prey: { type: "number", minimum: 0 },
        predators: { type: "number", minimum: 0 },
        preyGrowth: { type: "number", minimum: 0 },
        predation: { type: "number", minimum: 0 },
        conversion: { type: "number", minimum: 0 },
        predatorMortality: { type: "number", minimum: 0 },
      },
      required: [
        "prey",
        "predators",
        "preyGrowth",
        "predation",
        "conversion",
        "predatorMortality",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        preyRate: { type: "number" },
        predatorRate: { type: "number" },
      },
      required: ["preyRate", "predatorRate"],
    },
    ports: {
      inputs: [
        {
          id: "prey",
          label: "Prey",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "predators",
          label: "Predators",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "preyGrowth",
          label: "Prey Growth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "predation",
          label: "Predation",
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
          id: "predatorMortality",
          label: "Predator Mortality",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "preyRate", label: "Prey Rate", valueType: { type: "number" } },
        {
          id: "predatorRate",
          label: "Predator Rate",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = lotkaVolterraOneSpeciesRateTool.execute;
export default lotkaVolterraOneSpeciesRateTool;
