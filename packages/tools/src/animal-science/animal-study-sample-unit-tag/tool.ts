import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleId: string;
  readonly samplingUnit: string;
  readonly animalOrGroupId: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleId: { type: "string", maxLength: 8192, minLength: 1 },
    samplingUnit: { type: "string", maxLength: 8192, minLength: 1 },
    animalOrGroupId: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["sampleId", "samplingUnit", "animalOrGroupId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record explicit study sampling-unit metadata without assuming observations are statistically independent. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampleId, samplingUnit, animalOrGroupId } = request;
  const compute = (): Output => {
    H.domain(sampleId.length > 0, "sampleId");
    H.domain(samplingUnit.length > 0, "samplingUnit");
    H.domain(animalOrGroupId.length > 0, "animalOrGroupId");
    return { token: JSON.stringify([sampleId, samplingUnit, animalOrGroupId]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sampleId: "S17", samplingUnit: "animal", animalOrGroupId: "A4" },
  output: { token: '["S17","animal","A4"]' },
} satisfies ToolExample<Input, Output>;
export const animalStudySampleUnitTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["animal-science", "animal science", "agriculture"],
      keywords: ["animal science", "agriculture"],
    },
    id: "animal-science/animal-study-sample-unit-tag",
    title: "Animal Study Sample Unit Tag",
    description:
      "Record explicit study sampling-unit metadata without assuming observations are statistically independent.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleId: { type: "string", maxLength: 8192, minLength: 1 },
        samplingUnit: { type: "string", maxLength: 8192, minLength: 1 },
        animalOrGroupId: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["sampleId", "samplingUnit", "animalOrGroupId"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "sampleId",
          label: "Sample Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "samplingUnit",
          label: "Sampling Unit",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "animalOrGroupId",
          label: "Animal Or Group Id",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = animalStudySampleUnitTagTool.execute;
export default animalStudySampleUnitTagTool;
