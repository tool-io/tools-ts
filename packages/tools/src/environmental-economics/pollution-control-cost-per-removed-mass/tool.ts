import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly inletMass: number;
  readonly outletMass: number;
  readonly operatingCost: number;
  readonly annualizedCapitalCost: number;
};
export type Output = {
  readonly removedMass: number;
  readonly removalFraction: number;
  readonly costPerRemovedMass: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inletMass: { type: "number" },
    outletMass: { type: "number", minimum: 0 },
    operatingCost: { type: "number" },
    annualizedCapitalCost: { type: "number" },
  },
  required: [
    "inletMass",
    "outletMass",
    "operatingCost",
    "annualizedCapitalCost",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    removedMass: { type: "number" },
    removalFraction: { type: "number" },
    costPerRemovedMass: { type: "number" },
  },
  required: ["removedMass", "removalFraction", "costPerRemovedMass"],
} as const;
/** Calculate pollution control cost per removed mass from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { inletMass, outletMass, operatingCost, annualizedCapitalCost } =
    request;
  const compute = (): Output => {
    H.domain(inletMass > outletMass && outletMass >= 0);
    return {
      removedMass: inletMass - outletMass,
      removalFraction: (inletMass - outletMass) / inletMass,
      costPerRemovedMass:
        (operatingCost + annualizedCapitalCost) / (inletMass - outletMass),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    inletMass: 100,
    outletMass: 20,
    operatingCost: 600,
    annualizedCapitalCost: 200,
  },
  output: { removedMass: 80, removalFraction: 0.8, costPerRemovedMass: 10 },
} satisfies ToolExample<Input, Output>;
export const pollutionControlCostPerRemovedMassTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-economics/pollution-control-cost-per-removed-mass",
    title: "Pollution Control Cost Per Removed Mass Tool",
    description:
      "Calculate pollution control cost per removed mass from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        inletMass: { type: "number" },
        outletMass: { type: "number", minimum: 0 },
        operatingCost: { type: "number" },
        annualizedCapitalCost: { type: "number" },
      },
      required: [
        "inletMass",
        "outletMass",
        "operatingCost",
        "annualizedCapitalCost",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        removedMass: { type: "number" },
        removalFraction: { type: "number" },
        costPerRemovedMass: { type: "number" },
      },
      required: ["removedMass", "removalFraction", "costPerRemovedMass"],
    },
    ports: {
      inputs: [
        {
          id: "inletMass",
          label: "Inlet Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "outletMass",
          label: "Outlet Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "operatingCost",
          label: "Operating Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "annualizedCapitalCost",
          label: "Annualized Capital Cost",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "removedMass",
          label: "Removed Mass",
          valueType: { type: "number" },
        },
        {
          id: "removalFraction",
          label: "Removal Fraction",
          valueType: { type: "number" },
        },
        {
          id: "costPerRemovedMass",
          label: "Cost Per Removed Mass",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = pollutionControlCostPerRemovedMassTool.execute;
export default pollutionControlCostPerRemovedMassTool;
