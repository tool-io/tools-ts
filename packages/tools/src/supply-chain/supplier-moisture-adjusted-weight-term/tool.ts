import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly wetMass: number;
  readonly moistureFraction: number;
  readonly referenceMoisture: number;
};
export type Output = {
  readonly dryMass: number;
  readonly referenceMass: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wetMass: { type: "number", minimum: 0 },
    moistureFraction: { type: "number", minimum: 0, maximum: 1 },
    referenceMoisture: { type: "number", minimum: 0, exclusiveMaximum: 1 },
  },
  required: ["wetMass", "moistureFraction", "referenceMoisture"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dryMass: { type: "number" },
    referenceMass: { type: "number" },
  },
  required: ["dryMass", "referenceMass"],
} as const;
/** Calculate supplier moisture adjusted weight term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { wetMass, moistureFraction, referenceMoisture } = request;
  const compute = (): Output => {
    H.domain(wetMass >= 0);
    H.probability(moistureFraction);
    H.domain(referenceMoisture >= 0 && referenceMoisture < 1);
    return {
      dryMass: wetMass * (1 - moistureFraction),
      referenceMass:
        (wetMass * (1 - moistureFraction)) / (1 - referenceMoisture),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { wetMass: 100, moistureFraction: 0.2, referenceMoisture: 0.1 },
  output: { dryMass: 80, referenceMass: 88.88888888888889 },
} satisfies ToolExample<Input, Output>;
export const supplierMoistureAdjustedWeightTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "supply-chain/supplier-moisture-adjusted-weight-term",
    title: "Supplier Moisture Adjusted Weight Term Tool",
    description:
      "Calculate supplier moisture adjusted weight term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        wetMass: { type: "number", minimum: 0 },
        moistureFraction: { type: "number", minimum: 0, maximum: 1 },
        referenceMoisture: { type: "number", minimum: 0, exclusiveMaximum: 1 },
      },
      required: ["wetMass", "moistureFraction", "referenceMoisture"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dryMass: { type: "number" },
        referenceMass: { type: "number" },
      },
      required: ["dryMass", "referenceMass"],
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
          id: "referenceMoisture",
          label: "Reference Moisture",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "dryMass", label: "Dry Mass", valueType: { type: "number" } },
        {
          id: "referenceMass",
          label: "Reference Mass",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = supplierMoistureAdjustedWeightTermTool.execute;
export default supplierMoistureAdjustedWeightTermTool;
