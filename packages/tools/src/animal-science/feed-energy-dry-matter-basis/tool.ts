import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly asFedEnergy: number;
  readonly dryMatterFraction: number;
  readonly asFedMass: number;
};
export type Output = {
  readonly energyPerDryMass: number;
  readonly totalEnergy: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    asFedEnergy: { type: "number", minimum: 0 },
    dryMatterFraction: { type: "number", exclusiveMinimum: 0, maximum: 1 },
    asFedMass: { type: "number", minimum: 0 },
  },
  required: ["asFedEnergy", "dryMatterFraction", "asFedMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    energyPerDryMass: { type: "number" },
    totalEnergy: { type: "number" },
  },
  required: ["energyPerDryMass", "totalEnergy"],
} as const;
/** Calculate feed energy dry matter basis from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { asFedEnergy, dryMatterFraction, asFedMass } = request;
  const compute = (): Output => {
    H.domain(
      asFedEnergy >= 0 &&
        asFedMass >= 0 &&
        dryMatterFraction > 0 &&
        dryMatterFraction <= 1,
    );
    return {
      energyPerDryMass: asFedEnergy / dryMatterFraction,
      totalEnergy: asFedEnergy * asFedMass,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { asFedEnergy: 8, dryMatterFraction: 0.8, asFedMass: 10 },
  output: { energyPerDryMass: 10, totalEnergy: 80 },
} satisfies ToolExample<Input, Output>;
export const feedEnergyDryMatterBasisTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "animal-science/feed-energy-dry-matter-basis",
    title: "Feed Energy Dry Matter Basis Tool",
    description:
      "Calculate feed energy dry matter basis from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        asFedEnergy: { type: "number", minimum: 0 },
        dryMatterFraction: { type: "number", exclusiveMinimum: 0, maximum: 1 },
        asFedMass: { type: "number", minimum: 0 },
      },
      required: ["asFedEnergy", "dryMatterFraction", "asFedMass"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        energyPerDryMass: { type: "number" },
        totalEnergy: { type: "number" },
      },
      required: ["energyPerDryMass", "totalEnergy"],
    },
    ports: {
      inputs: [
        {
          id: "asFedEnergy",
          label: "As Fed Energy",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "dryMatterFraction",
          label: "Dry Matter Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "asFedMass",
          label: "As Fed Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "energyPerDryMass",
          label: "Energy Per Dry Mass",
          valueType: { type: "number" },
        },
        {
          id: "totalEnergy",
          label: "Total Energy",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = feedEnergyDryMatterBasisTool.execute;
export default feedEnergyDryMatterBasisTool;
