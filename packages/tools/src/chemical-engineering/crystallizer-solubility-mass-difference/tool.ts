import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly dissolvedSoluteMass: number;
  readonly solventMass: number;
  readonly solubilityMassPerSolventMass: number;
};
export type Output = {
  readonly saturationCapacity: number;
  readonly excessSoluteMass: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dissolvedSoluteMass: { type: "number", minimum: 0 },
    solventMass: { type: "number", minimum: 0 },
    solubilityMassPerSolventMass: { type: "number", minimum: 0 },
  },
  required: [
    "dissolvedSoluteMass",
    "solventMass",
    "solubilityMassPerSolventMass",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    saturationCapacity: { type: "number" },
    excessSoluteMass: { type: "number" },
  },
  required: ["saturationCapacity", "excessSoluteMass"],
} as const;
/** Compare supplied dissolved-solute mass with an explicit equilibrium solubility capacity, assuming unchanged solvent mass and no other phases. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { dissolvedSoluteMass, solventMass, solubilityMassPerSolventMass } =
    request;
  const compute = (): Output => {
    H.domain(
      dissolvedSoluteMass >= 0 &&
        solventMass >= 0 &&
        solubilityMassPerSolventMass >= 0,
      "dissolvedSoluteMass",
    );
    return {
      saturationCapacity: solventMass * solubilityMassPerSolventMass,
      excessSoluteMass: Math.max(
        0,
        dissolvedSoluteMass - solventMass * solubilityMassPerSolventMass,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    dissolvedSoluteMass: 30,
    solventMass: 100,
    solubilityMassPerSolventMass: 0.2,
  },
  output: { saturationCapacity: 20, excessSoluteMass: 10 },
} satisfies ToolExample<Input, Output>;
export const crystallizerSolubilityMassDifferenceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: ["chemical-engineering", "chemical engineering", "engineering"],
        keywords: ["chemical engineering", "engineering"],
      },
      id: "chemical-engineering/crystallizer-solubility-mass-difference",
      title: "Crystallizer Solubility Mass Difference",
      description:
        "Compare supplied dissolved-solute mass with an explicit equilibrium solubility capacity, assuming unchanged solvent mass and no other phases.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          dissolvedSoluteMass: { type: "number", minimum: 0 },
          solventMass: { type: "number", minimum: 0 },
          solubilityMassPerSolventMass: { type: "number", minimum: 0 },
        },
        required: [
          "dissolvedSoluteMass",
          "solventMass",
          "solubilityMassPerSolventMass",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          saturationCapacity: { type: "number" },
          excessSoluteMass: { type: "number" },
        },
        required: ["saturationCapacity", "excessSoluteMass"],
      },
      ports: {
        inputs: [
          {
            id: "dissolvedSoluteMass",
            label: "Dissolved Solute Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "solventMass",
            label: "Solvent Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "solubilityMassPerSolventMass",
            label: "Solubility Mass Per Solvent Mass",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "saturationCapacity",
            label: "Saturation Capacity",
            valueType: { type: "number" },
          },
          {
            id: "excessSoluteMass",
            label: "Excess Solute Mass",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = crystallizerSolubilityMassDifferenceTool.execute;
export default crystallizerSolubilityMassDifferenceTool;
