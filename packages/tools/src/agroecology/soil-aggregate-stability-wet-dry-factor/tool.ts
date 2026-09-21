import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly stableDryMass: number;
  readonly initialDryMass: number;
  readonly coarseMass: number;
};
export type Output = {
  readonly correctedStableMass: number;
  readonly correctedInitialMass: number;
  readonly stableFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stableDryMass: { type: "number" },
    initialDryMass: { type: "number" },
    coarseMass: { type: "number", minimum: 0 },
  },
  required: ["stableDryMass", "initialDryMass", "coarseMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    correctedStableMass: { type: "number" },
    correctedInitialMass: { type: "number" },
    stableFraction: { type: "number" },
  },
  required: ["correctedStableMass", "correctedInitialMass", "stableFraction"],
} as const;
/** Dry-mass aggregate fraction corrected by the same supplied coarse nonaggregate mass in both measurements. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { stableDryMass, initialDryMass, coarseMass } = request;
  const compute = (): Output => {
    H.domain(
      coarseMass >= 0 &&
        stableDryMass >= coarseMass &&
        initialDryMass > coarseMass &&
        stableDryMass <= initialDryMass,
    );
    return {
      correctedStableMass: stableDryMass - coarseMass,
      correctedInitialMass: initialDryMass - coarseMass,
      stableFraction:
        (stableDryMass - coarseMass) / (initialDryMass - coarseMass),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { stableDryMass: 60, initialDryMass: 100, coarseMass: 20 },
  output: {
    correctedStableMass: 40,
    correctedInitialMass: 80,
    stableFraction: 0.5,
  },
} satisfies ToolExample<Input, Output>;
export const soilAggregateStabilityWetDryFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agroecology/soil-aggregate-stability-wet-dry-factor",
    title: "Soil Aggregate Stability Wet Dry Factor Tool",
    description:
      "Dry-mass aggregate fraction corrected by the same supplied coarse nonaggregate mass in both measurements.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        stableDryMass: { type: "number" },
        initialDryMass: { type: "number" },
        coarseMass: { type: "number", minimum: 0 },
      },
      required: ["stableDryMass", "initialDryMass", "coarseMass"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        correctedStableMass: { type: "number" },
        correctedInitialMass: { type: "number" },
        stableFraction: { type: "number" },
      },
      required: [
        "correctedStableMass",
        "correctedInitialMass",
        "stableFraction",
      ],
    },
    ports: {
      inputs: [
        {
          id: "stableDryMass",
          label: "Stable Dry Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "initialDryMass",
          label: "Initial Dry Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "coarseMass",
          label: "Coarse Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "correctedStableMass",
          label: "Corrected Stable Mass",
          valueType: { type: "number" },
        },
        {
          id: "correctedInitialMass",
          label: "Corrected Initial Mass",
          valueType: { type: "number" },
        },
        {
          id: "stableFraction",
          label: "Stable Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = soilAggregateStabilityWetDryFactorTool.execute;
export default soilAggregateStabilityWetDryFactorTool;
