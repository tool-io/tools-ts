import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observationId: string;
  readonly vocalizationCode: string;
  readonly codebookSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observationId: { type: "string", maxLength: 8192, minLength: 1 },
    vocalizationCode: { type: "string", maxLength: 8192, minLength: 1 },
    codebookSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["observationId", "vocalizationCode", "codebookSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify a supplied vocalization code by its observation and codebook source without sound classification. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observationId, vocalizationCode, codebookSource } = request;
  const compute = (): Output => {
    H.domain(observationId.length > 0, "observationId");
    H.domain(vocalizationCode.length > 0, "vocalizationCode");
    H.domain(codebookSource.length > 0, "codebookSource");
    return {
      token: JSON.stringify([observationId, vocalizationCode, codebookSource]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    observationId: "O17",
    vocalizationCode: "CALL-A",
    codebookSource: "Ethogram v2",
  },
  output: { token: '["O17","CALL-A","Ethogram v2"]' },
} satisfies ToolExample<Input, Output>;
export const animalObservationVocalizationLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["zoology", "biology"],
      keywords: ["zoology", "biology"],
    },
    id: "zoology/animal-observation-vocalization-label",
    title: "Animal Observation Vocalization Label",
    description:
      "Qualify a supplied vocalization code by its observation and codebook source without sound classification.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observationId: { type: "string", maxLength: 8192, minLength: 1 },
        vocalizationCode: { type: "string", maxLength: 8192, minLength: 1 },
        codebookSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["observationId", "vocalizationCode", "codebookSource"],
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
          id: "observationId",
          label: "Observation Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "vocalizationCode",
          label: "Vocalization Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "codebookSource",
          label: "Codebook Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = animalObservationVocalizationLabelTool.execute;
export default animalObservationVocalizationLabelTool;
