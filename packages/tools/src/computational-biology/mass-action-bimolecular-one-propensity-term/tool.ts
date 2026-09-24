import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstCount: number;
  readonly secondCount: number;
  readonly coefficient: number;
  readonly identicalSpecies: boolean;
};
export type Output = {
  readonly reactantPairs: number;
  readonly propensity: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstCount: { type: "integer", minimum: 0 },
    secondCount: { type: "integer", minimum: 0 },
    coefficient: { type: "number" },
    identicalSpecies: { type: "boolean" },
  },
  required: ["firstCount", "secondCount", "coefficient", "identicalSpecies"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reactantPairs: { type: "number" },
    propensity: { type: "number" },
  },
  required: ["reactantPairs", "propensity"],
} as const;
/** Stochastic mass-action pair count; identical reactants use n choose 2 and a supplied per-pair propensity coefficient. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstCount, secondCount, coefficient, identicalSpecies } = request;
  const compute = (): Output => {
    H.integer(firstCount, 0);
    H.integer(secondCount, 0);
    H.domain(
      coefficient >= 0 && (!identicalSpecies || firstCount === secondCount),
    );
    return {
      reactantPairs: identicalSpecies
        ? (firstCount * (firstCount - 1)) / 2
        : firstCount * secondCount,
      propensity:
        coefficient *
        (identicalSpecies
          ? (firstCount * (firstCount - 1)) / 2
          : firstCount * secondCount),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstCount: 5,
    secondCount: 5,
    coefficient: 0.2,
    identicalSpecies: true,
  },
  output: { reactantPairs: 10, propensity: 2 },
} satisfies ToolExample<Input, Output>;
export const massActionBimolecularOnePropensityTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "computational-biology/mass-action-bimolecular-one-propensity-term",
      title: "Mass Action Bimolecular One Propensity Term Tool",
      description:
        "Stochastic mass-action pair count; identical reactants use n choose 2 and a supplied per-pair propensity coefficient.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstCount: { type: "integer", minimum: 0 },
          secondCount: { type: "integer", minimum: 0 },
          coefficient: { type: "number" },
          identicalSpecies: { type: "boolean" },
        },
        required: [
          "firstCount",
          "secondCount",
          "coefficient",
          "identicalSpecies",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          reactantPairs: { type: "number" },
          propensity: { type: "number" },
        },
        required: ["reactantPairs", "propensity"],
      },
      ports: {
        inputs: [
          {
            id: "firstCount",
            label: "First Count",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "secondCount",
            label: "Second Count",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "coefficient",
            label: "Coefficient",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "identicalSpecies",
            label: "Identical Species",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "reactantPairs",
            label: "Reactant Pairs",
            valueType: { type: "number" },
          },
          {
            id: "propensity",
            label: "Propensity",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = massActionBimolecularOnePropensityTermTool.execute;
export default massActionBimolecularOnePropensityTermTool;
