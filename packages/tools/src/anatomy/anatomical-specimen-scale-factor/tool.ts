import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly modelLength: number;
  readonly specimenLength: number;
};
export type Output = {
  readonly modelPerSpecimen: number;
  readonly specimenPerModel: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    modelLength: { type: "number", exclusiveMinimum: 0 },
    specimenLength: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["modelLength", "specimenLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    modelPerSpecimen: { type: "number" },
    specimenPerModel: { type: "number" },
  },
  required: ["modelPerSpecimen", "specimenPerModel"],
} as const;
/** Compare explicit compatible anatomical model and specimen lengths without assuming isotropic anatomical similarity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { modelLength, specimenLength } = request;
  const compute = (): Output => {
    (H.domain(modelLength > 0, "modelLength"), modelLength);
    (H.domain(specimenLength > 0, "specimenLength"), specimenLength);
    return {
      modelPerSpecimen: modelLength / specimenLength,
      specimenPerModel: specimenLength / modelLength,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { modelLength: 20, specimenLength: 100 },
  output: { modelPerSpecimen: 0.2, specimenPerModel: 5 },
} satisfies ToolExample<Input, Output>;
export const anatomicalSpecimenScaleFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["anatomy", "health and medicine"],
      keywords: ["anatomy", "health and medicine"],
    },
    id: "anatomy/anatomical-specimen-scale-factor",
    title: "Anatomical Specimen Scale Factor",
    description:
      "Compare explicit compatible anatomical model and specimen lengths without assuming isotropic anatomical similarity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        modelLength: { type: "number", exclusiveMinimum: 0 },
        specimenLength: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["modelLength", "specimenLength"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        modelPerSpecimen: { type: "number" },
        specimenPerModel: { type: "number" },
      },
      required: ["modelPerSpecimen", "specimenPerModel"],
    },
    ports: {
      inputs: [
        {
          id: "modelLength",
          label: "Model Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "specimenLength",
          label: "Specimen Length",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "modelPerSpecimen",
          label: "Model Per Specimen",
          valueType: { type: "number" },
        },
        {
          id: "specimenPerModel",
          label: "Specimen Per Model",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = anatomicalSpecimenScaleFactorTool.execute;
export default anatomicalSpecimenScaleFactorTool;
