import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly freshMass: number;
  readonly dryMass: number;
  readonly ashMass: number;
};
export type Output = {
  readonly waterFraction: number;
  readonly dryMatterFraction: number;
  readonly ashFreeDryMass: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    freshMass: { type: "number", exclusiveMinimum: 0 },
    dryMass: { type: "number", minimum: 0 },
    ashMass: { type: "number", minimum: 0 },
  },
  required: ["freshMass", "dryMass", "ashMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    waterFraction: { type: "number" },
    dryMatterFraction: { type: "number" },
    ashFreeDryMass: { type: "number" },
  },
  required: ["waterFraction", "dryMatterFraction", "ashFreeDryMass"],
} as const;
/** Calculate animal specimen fresh dry mass factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { freshMass, dryMass, ashMass } = request;
  const compute = (): Output => {
    H.positive(freshMass);
    H.domain(
      dryMass >= 0 &&
        dryMass <= freshMass &&
        ashMass >= 0 &&
        ashMass <= dryMass,
    );
    return {
      waterFraction: (freshMass - dryMass) / freshMass,
      dryMatterFraction: dryMass / freshMass,
      ashFreeDryMass: dryMass - ashMass,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { freshMass: 100, dryMass: 30, ashMass: 5 },
  output: { waterFraction: 0.7, dryMatterFraction: 0.3, ashFreeDryMass: 25 },
} satisfies ToolExample<Input, Output>;
export const animalSpecimenFreshDryMassFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "zoology/animal-specimen-fresh-dry-mass-factor",
    title: "Animal Specimen Fresh Dry Mass Factor Tool",
    description:
      "Calculate animal specimen fresh dry mass factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        freshMass: { type: "number", exclusiveMinimum: 0 },
        dryMass: { type: "number", minimum: 0 },
        ashMass: { type: "number", minimum: 0 },
      },
      required: ["freshMass", "dryMass", "ashMass"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        waterFraction: { type: "number" },
        dryMatterFraction: { type: "number" },
        ashFreeDryMass: { type: "number" },
      },
      required: ["waterFraction", "dryMatterFraction", "ashFreeDryMass"],
    },
    ports: {
      inputs: [
        {
          id: "freshMass",
          label: "Fresh Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "dryMass",
          label: "Dry Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "ashMass",
          label: "Ash Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "waterFraction",
          label: "Water Fraction",
          valueType: { type: "number" },
        },
        {
          id: "dryMatterFraction",
          label: "Dry Matter Fraction",
          valueType: { type: "number" },
        },
        {
          id: "ashFreeDryMass",
          label: "Ash Free Dry Mass",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = animalSpecimenFreshDryMassFactorTool.execute;
export default animalSpecimenFreshDryMassFactorTool;
