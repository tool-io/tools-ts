import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly actualSavedEnergy: number;
  readonly modeledSavedEnergy: number;
};
export type Output = { readonly realizationFactor: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    actualSavedEnergy: { type: "number" },
    modeledSavedEnergy: { type: "number" },
  },
  required: ["actualSavedEnergy", "modeledSavedEnergy"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { realizationFactor: { type: "number" } },
  required: ["realizationFactor"],
} as const;
/** Divide supplied signed actual energy savings by nonzero modeled savings without estimating a retrofit counterfactual. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { actualSavedEnergy, modeledSavedEnergy } = request;
  const compute = (): Output => {
    H.domain(modeledSavedEnergy !== 0, "modeledSavedEnergy");
    return { realizationFactor: actualSavedEnergy / modeledSavedEnergy };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { actualSavedEnergy: 80, modeledSavedEnergy: 100 },
  output: { realizationFactor: 0.8 },
} satisfies ToolExample<Input, Output>;
export const energyRetrofitSavingsRealizationFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "energy-economics/energy-retrofit-savings-realization-factor",
      title: "Energy Retrofit Savings Realization Factor Tool",
      description:
        "Divide supplied signed actual energy savings by nonzero modeled savings without estimating a retrofit counterfactual.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          actualSavedEnergy: { type: "number" },
          modeledSavedEnergy: { type: "number" },
        },
        required: ["actualSavedEnergy", "modeledSavedEnergy"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { realizationFactor: { type: "number" } },
        required: ["realizationFactor"],
      },
      ports: {
        inputs: [
          {
            id: "actualSavedEnergy",
            label: "Actual Saved Energy",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "modeledSavedEnergy",
            label: "Modeled Saved Energy",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "realizationFactor",
            label: "Realization Factor",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = energyRetrofitSavingsRealizationFactorTool.execute;
export default energyRetrofitSavingsRealizationFactorTool;
