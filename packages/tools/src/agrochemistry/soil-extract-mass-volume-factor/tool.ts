import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly concentration: number;
  readonly extractVolume: number;
  readonly sampleMass: number;
};
export type Output = { readonly massPerSampleMass: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    concentration: { type: "number", minimum: 0 },
    extractVolume: { type: "number", minimum: 0 },
    sampleMass: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["concentration", "extractVolume", "sampleMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { massPerSampleMass: { type: "number" } },
  required: ["massPerSampleMass"],
} as const;
/** Calculate soil extract mass volume factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { concentration, extractVolume, sampleMass } = request;
  const compute = (): Output => {
    H.domain(concentration >= 0 && extractVolume >= 0);
    H.positive(sampleMass);
    return { massPerSampleMass: (concentration * extractVolume) / sampleMass };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { concentration: 2, extractVolume: 5, sampleMass: 10 },
  output: { massPerSampleMass: 1 },
} satisfies ToolExample<Input, Output>;
export const soilExtractMassVolumeFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agrochemistry/soil-extract-mass-volume-factor",
    title: "Soil Extract Mass Volume Factor Tool",
    description:
      "Calculate soil extract mass volume factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        concentration: { type: "number", minimum: 0 },
        extractVolume: { type: "number", minimum: 0 },
        sampleMass: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["concentration", "extractVolume", "sampleMass"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { massPerSampleMass: { type: "number" } },
      required: ["massPerSampleMass"],
    },
    ports: {
      inputs: [
        {
          id: "concentration",
          label: "Concentration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "extractVolume",
          label: "Extract Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sampleMass",
          label: "Sample Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "massPerSampleMass",
          label: "Mass Per Sample Mass",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = soilExtractMassVolumeFactorTool.execute;
export default soilExtractMassVolumeFactorTool;
