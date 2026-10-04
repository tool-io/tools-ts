import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly wetMass: number;
  readonly moistureFraction: number;
  readonly massUnitFactor: number;
};
export type Output = { readonly dryMass: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wetMass: { type: "number", minimum: 0 },
    moistureFraction: { type: "number", minimum: 0, maximum: 1 },
    massUnitFactor: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["wetMass", "moistureFraction", "massUnitFactor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { dryMass: { type: "number" } },
  required: ["dryMass"],
} as const;
/** Calculate residue moisture unit factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { wetMass, moistureFraction, massUnitFactor } = request;
  const compute = (): Output => {
    H.domain(wetMass >= 0);
    H.probability(moistureFraction);
    H.positive(massUnitFactor);
    return { dryMass: wetMass * (1 - moistureFraction) * massUnitFactor };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { wetMass: 10, moistureFraction: 0.2, massUnitFactor: 1000 },
  output: { dryMass: 8000 },
} satisfies ToolExample<Input, Output>;
export const residueMoistureUnitFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "sustainable-agriculture/residue-moisture-unit-factor",
    title: "Residue Moisture Unit Factor Tool",
    description:
      "Calculate residue moisture unit factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        wetMass: { type: "number", minimum: 0 },
        moistureFraction: { type: "number", minimum: 0, maximum: 1 },
        massUnitFactor: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["wetMass", "moistureFraction", "massUnitFactor"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { dryMass: { type: "number" } },
      required: ["dryMass"],
    },
    ports: {
      inputs: [
        {
          id: "wetMass",
          label: "Wet Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "moistureFraction",
          label: "Moisture Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "massUnitFactor",
          label: "Mass Unit Factor",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "dryMass", label: "Dry Mass", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = residueMoistureUnitFactorTool.execute;
export default residueMoistureUnitFactorTool;
