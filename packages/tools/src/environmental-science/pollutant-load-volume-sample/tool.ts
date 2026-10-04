import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly concentrationMgPerLiter: number;
  readonly volumeLiters: number;
};
export type Output = { readonly pollutantMassMg: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    concentrationMgPerLiter: { type: "number", minimum: 0 },
    volumeLiters: { type: "number", minimum: 0 },
  },
  required: ["concentrationMgPerLiter", "volumeLiters"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { pollutantMassMg: { type: "number" } },
  required: ["pollutantMassMg"],
} as const;
/** Convert a uniform measured pollutant concentration and compatible sample volume into mass in milligrams. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { concentrationMgPerLiter, volumeLiters } = request;
  const compute = (): Output => {
    H.domain(
      concentrationMgPerLiter >= 0 && volumeLiters >= 0,
      "concentrationMgPerLiter",
    );
    return { pollutantMassMg: concentrationMgPerLiter * volumeLiters };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { concentrationMgPerLiter: 2.5, volumeLiters: 40 },
  output: { pollutantMassMg: 100 },
} satisfies ToolExample<Input, Output>;
export const pollutantLoadVolumeSampleTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-science/pollutant-load-volume-sample",
    title: "Pollutant Load Volume Sample Tool",
    description:
      "Convert a uniform measured pollutant concentration and compatible sample volume into mass in milligrams.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        concentrationMgPerLiter: { type: "number", minimum: 0 },
        volumeLiters: { type: "number", minimum: 0 },
      },
      required: ["concentrationMgPerLiter", "volumeLiters"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { pollutantMassMg: { type: "number" } },
      required: ["pollutantMassMg"],
    },
    ports: {
      inputs: [
        {
          id: "concentrationMgPerLiter",
          label: "Concentration Mg Per Liter",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "volumeLiters",
          label: "Volume Liters",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "pollutantMassMg",
          label: "Pollutant Mass Mg",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = pollutantLoadVolumeSampleTool.execute;
export default pollutantLoadVolumeSampleTool;
