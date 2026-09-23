import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly permeability: number;
  readonly outside: number;
  readonly inside: number;
  readonly anion: boolean;
};
export type Output = {
  readonly numeratorContribution: number;
  readonly denominatorContribution: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    permeability: { type: "number", minimum: 0 },
    outside: { type: "number", minimum: 0 },
    inside: { type: "number", minimum: 0 },
    anion: { type: "boolean" },
  },
  required: ["permeability", "outside", "inside", "anion"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    numeratorContribution: { type: "number" },
    denominatorContribution: { type: "number" },
  },
  required: ["numeratorContribution", "denominatorContribution"],
} as const;
/** One monovalent GHK concentration-sum contribution; anions exchange inside/outside placement, and no full membrane potential is returned. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { permeability, outside, inside, anion } = request;
  const compute = (): Output => {
    H.domain(permeability >= 0 && outside >= 0 && inside >= 0);
    return {
      numeratorContribution: permeability * (anion ? inside : outside),
      denominatorContribution: permeability * (anion ? outside : inside),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { permeability: 2, outside: 10, inside: 1, anion: false },
  output: { numeratorContribution: 20, denominatorContribution: 2 },
} satisfies ToolExample<Input, Output>;
export const goldmanOneIonPermeabilityContributionTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "biophysics/goldman-one-ion-permeability-contribution",
      title: "Goldman One Ion Permeability Contribution Tool",
      description:
        "One monovalent GHK concentration-sum contribution; anions exchange inside/outside placement, and no full membrane potential is returned.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          permeability: { type: "number", minimum: 0 },
          outside: { type: "number", minimum: 0 },
          inside: { type: "number", minimum: 0 },
          anion: { type: "boolean" },
        },
        required: ["permeability", "outside", "inside", "anion"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          numeratorContribution: { type: "number" },
          denominatorContribution: { type: "number" },
        },
        required: ["numeratorContribution", "denominatorContribution"],
      },
      ports: {
        inputs: [
          {
            id: "permeability",
            label: "Permeability",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "outside",
            label: "Outside",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "inside",
            label: "Inside",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "anion",
            label: "Anion",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "numeratorContribution",
            label: "Numerator Contribution",
            valueType: { type: "number" },
          },
          {
            id: "denominatorContribution",
            label: "Denominator Contribution",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = goldmanOneIonPermeabilityContributionTool.execute;
export default goldmanOneIonPermeabilityContributionTool;
