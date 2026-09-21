import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly weighedMass: number;
  readonly purity: number;
  readonly finalVolume: number;
  readonly dilutionFactor: number;
};
export type Output = { readonly concentration: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    weighedMass: { type: "number", minimum: 0 },
    purity: { type: "number", minimum: 0, maximum: 1 },
    finalVolume: { type: "number", exclusiveMinimum: 0 },
    dilutionFactor: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["weighedMass", "purity", "finalVolume", "dilutionFactor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { concentration: { type: "number" } },
  required: ["concentration"],
} as const;
/** Formal supplied assay mass/volume bookkeeping without laboratory or field-use instructions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { weighedMass, purity, finalVolume, dilutionFactor } = request;
  const compute = (): Output => {
    H.domain(weighedMass >= 0);
    H.probability(purity);
    H.positive(finalVolume);
    H.positive(dilutionFactor);
    return {
      concentration: (weighedMass * purity) / (finalVolume * dilutionFactor),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { weighedMass: 10, purity: 0.9, finalVolume: 100, dilutionFactor: 2 },
  output: { concentration: 0.045 },
} satisfies ToolExample<Input, Output>;
export const agrochemicalStandardPurityDilutionFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "agrochemistry/agrochemical-standard-purity-dilution-factor",
      title: "Agrochemical Standard Purity Dilution Factor Tool",
      description:
        "Formal supplied assay mass/volume bookkeeping without laboratory or field-use instructions.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          weighedMass: { type: "number", minimum: 0 },
          purity: { type: "number", minimum: 0, maximum: 1 },
          finalVolume: { type: "number", exclusiveMinimum: 0 },
          dilutionFactor: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["weighedMass", "purity", "finalVolume", "dilutionFactor"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { concentration: { type: "number" } },
        required: ["concentration"],
      },
      ports: {
        inputs: [
          {
            id: "weighedMass",
            label: "Weighed Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "purity",
            label: "Purity",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "finalVolume",
            label: "Final Volume",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "dilutionFactor",
            label: "Dilution Factor",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "concentration",
            label: "Concentration",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = agrochemicalStandardPurityDilutionFactorTool.execute;
export default agrochemicalStandardPurityDilutionFactorTool;
