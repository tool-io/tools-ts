import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly wetMass: number;
  readonly moistureFraction: number;
  readonly referenceMoisture: number;
};
export type Output = {
  readonly standardMass: number;
  readonly adjustment: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wetMass: { type: "number", minimum: 0 },
    moistureFraction: { type: "number", minimum: 0, exclusiveMaximum: 1 },
    referenceMoisture: { type: "number", minimum: 0, exclusiveMaximum: 1 },
  },
  required: ["wetMass", "moistureFraction", "referenceMoisture"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    standardMass: { type: "number" },
    adjustment: { type: "number" },
  },
  required: ["standardMass", "adjustment"],
} as const;
/** Standardize stored mass by conserving supplied dry matter; no mandated reference moisture. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { wetMass, moistureFraction, referenceMoisture } = request;
  const compute = (): Output => {
    H.domain(
      wetMass >= 0 &&
        moistureFraction >= 0 &&
        moistureFraction < 1 &&
        referenceMoisture >= 0 &&
        referenceMoisture < 1,
    );
    return {
      standardMass:
        (wetMass * (1 - moistureFraction)) / (1 - referenceMoisture),
      adjustment:
        (wetMass * (1 - moistureFraction)) / (1 - referenceMoisture) - wetMass,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { wetMass: 1000, moistureFraction: 0.2, referenceMoisture: 0.1 },
  output: { standardMass: 888.8888888888889, adjustment: -111.11111111111109 },
} satisfies ToolExample<Input, Output>;
export const publicGrainStorageMoistureWeightFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "agricultural-policy/public-grain-storage-moisture-weight-factor",
      title: "Public Grain Storage Moisture Weight Factor Tool",
      description:
        "Standardize stored mass by conserving supplied dry matter; no mandated reference moisture.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          wetMass: { type: "number", minimum: 0 },
          moistureFraction: { type: "number", minimum: 0, exclusiveMaximum: 1 },
          referenceMoisture: {
            type: "number",
            minimum: 0,
            exclusiveMaximum: 1,
          },
        },
        required: ["wetMass", "moistureFraction", "referenceMoisture"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          standardMass: { type: "number" },
          adjustment: { type: "number" },
        },
        required: ["standardMass", "adjustment"],
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
            valueType: { type: "number", unit: "1" },
          },
          {
            id: "referenceMoisture",
            label: "Reference Moisture",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "standardMass",
            label: "Standard Mass",
            valueType: { type: "number" },
          },
          {
            id: "adjustment",
            label: "Adjustment",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = publicGrainStorageMoistureWeightFactorTool.execute;
export default publicGrainStorageMoistureWeightFactorTool;
