import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly solventMass: number;
  readonly initialSolubility: number;
  readonly finalSolubility: number;
  readonly crystalRecovery: number;
};
export type Output = {
  readonly theoreticalCrystalMass: number;
  readonly recoveredCrystalMass: number;
  readonly dissolvedRemaining: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    solventMass: { type: "number", minimum: 0 },
    initialSolubility: { type: "number" },
    finalSolubility: { type: "number", minimum: 0 },
    crystalRecovery: { type: "number", minimum: 0, maximum: 1 },
  },
  required: [
    "solventMass",
    "initialSolubility",
    "finalSolubility",
    "crystalRecovery",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    theoreticalCrystalMass: { type: "number" },
    recoveredCrystalMass: { type: "number" },
    dissolvedRemaining: { type: "number" },
  },
  required: [
    "theoreticalCrystalMass",
    "recoveredCrystalMass",
    "dissolvedRemaining",
  ],
} as const;
/** Solubilities are solute mass per solvent mass, with no solvent evaporation or hydrate formation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { solventMass, initialSolubility, finalSolubility, crystalRecovery } =
    request;
  const compute = (): Output => {
    H.domain(
      solventMass >= 0 &&
        finalSolubility >= 0 &&
        initialSolubility >= finalSolubility,
    );
    H.probability(crystalRecovery);
    return {
      theoreticalCrystalMass:
        solventMass * (initialSolubility - finalSolubility),
      recoveredCrystalMass:
        solventMass * (initialSolubility - finalSolubility) * crystalRecovery,
      dissolvedRemaining: solventMass * finalSolubility,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    solventMass: 100,
    initialSolubility: 0.5,
    finalSolubility: 0.2,
    crystalRecovery: 0.8,
  },
  output: {
    theoreticalCrystalMass: 30,
    recoveredCrystalMass: 24,
    dissolvedRemaining: 20,
  },
} satisfies ToolExample<Input, Output>;
export const crystallizationSolubilityCoolingYieldTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "chemical-engineering/crystallization-solubility-cooling-yield-term",
      title: "Crystallization Solubility Cooling Yield Term Tool",
      description:
        "Solubilities are solute mass per solvent mass, with no solvent evaporation or hydrate formation.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          solventMass: { type: "number", minimum: 0 },
          initialSolubility: { type: "number" },
          finalSolubility: { type: "number", minimum: 0 },
          crystalRecovery: { type: "number", minimum: 0, maximum: 1 },
        },
        required: [
          "solventMass",
          "initialSolubility",
          "finalSolubility",
          "crystalRecovery",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          theoreticalCrystalMass: { type: "number" },
          recoveredCrystalMass: { type: "number" },
          dissolvedRemaining: { type: "number" },
        },
        required: [
          "theoreticalCrystalMass",
          "recoveredCrystalMass",
          "dissolvedRemaining",
        ],
      },
      ports: {
        inputs: [
          {
            id: "solventMass",
            label: "Solvent Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "initialSolubility",
            label: "Initial Solubility",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "finalSolubility",
            label: "Final Solubility",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "crystalRecovery",
            label: "Crystal Recovery",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "theoreticalCrystalMass",
            label: "Theoretical Crystal Mass",
            valueType: { type: "number" },
          },
          {
            id: "recoveredCrystalMass",
            label: "Recovered Crystal Mass",
            valueType: { type: "number" },
          },
          {
            id: "dissolvedRemaining",
            label: "Dissolved Remaining",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = crystallizationSolubilityCoolingYieldTermTool.execute;
export default crystallizationSolubilityCoolingYieldTermTool;
