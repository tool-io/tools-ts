import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly exportedWetMass: number;
  readonly dryFraction: number;
  readonly nutrientFraction: number;
};
export type Output = {
  readonly dryMass: number;
  readonly exportedNutrient: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    exportedWetMass: { type: "number", minimum: 0 },
    dryFraction: { type: "number", minimum: 0, maximum: 1 },
    nutrientFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["exportedWetMass", "dryFraction", "nutrientFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dryMass: { type: "number" },
    exportedNutrient: { type: "number" },
  },
  required: ["dryMass", "exportedNutrient"],
} as const;
/** Calculate fish plant solids nutrient export term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { exportedWetMass, dryFraction, nutrientFraction } = request;
  const compute = (): Output => {
    H.domain(exportedWetMass >= 0);
    H.probability(dryFraction);
    H.probability(nutrientFraction);
    return {
      dryMass: exportedWetMass * dryFraction,
      exportedNutrient: exportedWetMass * dryFraction * nutrientFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { exportedWetMass: 100, dryFraction: 0.2, nutrientFraction: 0.05 },
  output: { dryMass: 20, exportedNutrient: 1 },
} satisfies ToolExample<Input, Output>;
export const fishPlantSolidsNutrientExportTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "aquaponics/fish-plant-solids-nutrient-export-term",
    title: "Fish Plant Solids Nutrient Export Term Tool",
    description:
      "Calculate fish plant solids nutrient export term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        exportedWetMass: { type: "number", minimum: 0 },
        dryFraction: { type: "number", minimum: 0, maximum: 1 },
        nutrientFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["exportedWetMass", "dryFraction", "nutrientFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dryMass: { type: "number" },
        exportedNutrient: { type: "number" },
      },
      required: ["dryMass", "exportedNutrient"],
    },
    ports: {
      inputs: [
        {
          id: "exportedWetMass",
          label: "Exported Wet Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "dryFraction",
          label: "Dry Fraction",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
        {
          id: "nutrientFraction",
          label: "Nutrient Fraction",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
      ],
      outputs: [
        { id: "dryMass", label: "Dry Mass", valueType: { type: "number" } },
        {
          id: "exportedNutrient",
          label: "Exported Nutrient",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = fishPlantSolidsNutrientExportTermTool.execute;
export default fishPlantSolidsNutrientExportTermTool;
