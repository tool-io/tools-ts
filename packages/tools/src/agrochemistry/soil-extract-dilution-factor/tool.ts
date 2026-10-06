import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly aliquotVolume: number;
  readonly finalVolume: number;
};
export type Output = { readonly dilutionFactor: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    aliquotVolume: { type: "number", exclusiveMinimum: 0 },
    finalVolume: { type: "number" },
  },
  required: ["aliquotVolume", "finalVolume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { dilutionFactor: { type: "number" } },
  required: ["dilutionFactor"],
} as const;
/** Calculate an explicit extract aliquot-to-final-volume dilution factor without prescribing extraction conditions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { aliquotVolume, finalVolume } = request;
  const compute = (): Output => {
    (H.domain(aliquotVolume > 0, "aliquotVolume"), aliquotVolume);
    H.domain(finalVolume >= aliquotVolume, "finalVolume");
    return { dilutionFactor: finalVolume / aliquotVolume };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { aliquotVolume: 5, finalVolume: 50 },
  output: { dilutionFactor: 10 },
} satisfies ToolExample<Input, Output>;
export const soilExtractDilutionFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["agrochemistry", "agriculture"],
      keywords: ["agrochemistry", "agriculture"],
    },
    id: "agrochemistry/soil-extract-dilution-factor",
    title: "Soil Extract Dilution Factor",
    description:
      "Calculate an explicit extract aliquot-to-final-volume dilution factor without prescribing extraction conditions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        aliquotVolume: { type: "number", exclusiveMinimum: 0 },
        finalVolume: { type: "number" },
      },
      required: ["aliquotVolume", "finalVolume"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { dilutionFactor: { type: "number" } },
      required: ["dilutionFactor"],
    },
    ports: {
      inputs: [
        {
          id: "aliquotVolume",
          label: "Aliquot Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "finalVolume",
          label: "Final Volume",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "dilutionFactor",
          label: "Dilution Factor",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = soilExtractDilutionFactorTool.execute;
export default soilExtractDilutionFactorTool;
