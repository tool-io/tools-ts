import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly animalRecordId: string;
  readonly exuviaSpecimenId: string;
  readonly observationId: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    animalRecordId: { type: "string", maxLength: 8192, minLength: 1 },
    exuviaSpecimenId: { type: "string", maxLength: 8192, minLength: 1 },
    observationId: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["animalRecordId", "exuviaSpecimenId", "observationId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Link explicit insect molt, exuvia specimen and observation identifiers without verifying organism identity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { animalRecordId, exuviaSpecimenId, observationId } = request;
  const compute = (): Output => {
    H.domain(animalRecordId.length > 0, "animalRecordId");
    H.domain(exuviaSpecimenId.length > 0, "exuviaSpecimenId");
    H.domain(observationId.length > 0, "observationId");
    return {
      token: JSON.stringify([animalRecordId, exuviaSpecimenId, observationId]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { animalRecordId: "A17", exuviaSpecimenId: "E4", observationId: "O2" },
  output: { token: '["A17","E4","O2"]' },
} satisfies ToolExample<Input, Output>;
export const insectMoltExuviaSpecimenLinkTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "entomology/insect-molt-exuvia-specimen-link",
    title: "Insect Molt Exuvia Specimen Link Tool",
    description:
      "Link explicit insect molt, exuvia specimen and observation identifiers without verifying organism identity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        animalRecordId: { type: "string", maxLength: 8192, minLength: 1 },
        exuviaSpecimenId: { type: "string", maxLength: 8192, minLength: 1 },
        observationId: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["animalRecordId", "exuviaSpecimenId", "observationId"],
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
          id: "animalRecordId",
          label: "Animal Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "exuviaSpecimenId",
          label: "Exuvia Specimen Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "observationId",
          label: "Observation Id",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = insectMoltExuviaSpecimenLinkTool.execute;
export default insectMoltExuviaSpecimenLinkTool;
