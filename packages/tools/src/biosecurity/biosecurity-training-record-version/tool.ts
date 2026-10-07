import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly personRecordId: string;
  readonly trainingRecordId: string;
  readonly version: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    personRecordId: { type: "string", maxLength: 8192, minLength: 1 },
    trainingRecordId: { type: "string", maxLength: 8192, minLength: 1 },
    version: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["personRecordId", "trainingRecordId", "version"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit administrative training record by version without deciding competence or authorization. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { personRecordId, trainingRecordId, version } = request;
  const compute = (): Output => {
    H.domain(personRecordId.length > 0, "personRecordId");
    H.domain(trainingRecordId.length > 0, "trainingRecordId");
    H.domain(version.length > 0, "version");
    return {
      token: JSON.stringify([personRecordId, trainingRecordId, version]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { personRecordId: "P17", trainingRecordId: "TR2", version: "v2" },
  output: { token: '["P17","TR2","v2"]' },
} satisfies ToolExample<Input, Output>;
export const biosecurityTrainingRecordVersionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["biosecurity", "research and quality management"],
      keywords: ["biosecurity", "research and quality management"],
    },
    id: "biosecurity/biosecurity-training-record-version",
    title: "Biosecurity Training Record Version",
    description:
      "Qualify an explicit administrative training record by version without deciding competence or authorization.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        personRecordId: { type: "string", maxLength: 8192, minLength: 1 },
        trainingRecordId: { type: "string", maxLength: 8192, minLength: 1 },
        version: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["personRecordId", "trainingRecordId", "version"],
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
          id: "personRecordId",
          label: "Person Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "trainingRecordId",
          label: "Training Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "version",
          label: "Version",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = biosecurityTrainingRecordVersionTool.execute;
export default biosecurityTrainingRecordVersionTool;
