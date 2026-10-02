import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly initialMass: number;
  readonly initialFraction: number;
  readonly removedMass: number;
  readonly addedMass: number;
  readonly addedFraction: number;
};
export type Output = {
  readonly finalMass: number;
  readonly soluteMass: number;
  readonly fraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initialMass: { type: "number", exclusiveMinimum: 0 },
    initialFraction: { type: "number", minimum: 0, maximum: 1 },
    removedMass: { type: "number", minimum: 0 },
    addedMass: { type: "number", minimum: 0 },
    addedFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: [
    "initialMass",
    "initialFraction",
    "removedMass",
    "addedMass",
    "addedFraction",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    finalMass: { type: "number" },
    soluteMass: { type: "number" },
    fraction: { type: "number" },
  },
  required: ["finalMass", "soluteMass", "fraction"],
} as const;
/** Calculate diluted mixture displacement mass balance from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const {
    initialMass,
    initialFraction,
    removedMass,
    addedMass,
    addedFraction,
  } = input;
  const compute = (): Output => {
    H.positive(initialMass);
    H.probability(initialFraction);
    H.probability(addedFraction);
    H.domain(removedMass >= 0 && removedMass <= initialMass && addedMass >= 0);
    const finalMass = initialMass - removedMass + addedMass;
    H.positive(finalMass);
    const soluteMass =
      (initialMass - removedMass) * initialFraction + addedMass * addedFraction;
    return { finalMass, soluteMass, fraction: soluteMass / finalMass };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: {
    initialMass: 100,
    initialFraction: 0.2,
    removedMass: 20,
    addedMass: 20,
    addedFraction: 0,
  },
  output: { finalMass: 100, soluteMass: 16, fraction: 0.16 },
} satisfies ToolExample<Input, Output>;
export const dilutedMixtureDisplacementMassBalanceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "proportions/diluted-mixture-displacement-mass-balance",
      title: "Diluted Mixture Displacement Mass Balance Tool",
      description:
        "Calculate diluted mixture displacement mass balance from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          initialMass: { type: "number", exclusiveMinimum: 0 },
          initialFraction: { type: "number", minimum: 0, maximum: 1 },
          removedMass: { type: "number", minimum: 0 },
          addedMass: { type: "number", minimum: 0 },
          addedFraction: { type: "number", minimum: 0, maximum: 1 },
        },
        required: [
          "initialMass",
          "initialFraction",
          "removedMass",
          "addedMass",
          "addedFraction",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          finalMass: { type: "number" },
          soluteMass: { type: "number" },
          fraction: { type: "number" },
        },
        required: ["finalMass", "soluteMass", "fraction"],
      },
      ports: {
        inputs: [
          {
            id: "initialMass",
            label: "Initial Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "initialFraction",
            label: "Initial Fraction",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "removedMass",
            label: "Removed Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "addedMass",
            label: "Added Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "addedFraction",
            label: "Added Fraction",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "finalMass",
            label: "Final Mass",
            valueType: { type: "number" },
          },
          {
            id: "soluteMass",
            label: "Solute Mass",
            valueType: { type: "number" },
          },
          { id: "fraction", label: "Fraction", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = dilutedMixtureDisplacementMassBalanceTool.execute;
export default dilutedMixtureDisplacementMassBalanceTool;
