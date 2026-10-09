import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly replicateId: string;
  readonly suppliedFounderCountText: string;
  readonly sourceRecord: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    replicateId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedFounderCountText: { type: "string", maxLength: 8192, minLength: 1 },
    sourceRecord: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["replicateId", "suppliedFounderCountText", "sourceRecord"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicitly supplied evolutionary replicate founder-count transcription and source without estimating effective population size. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { replicateId, suppliedFounderCountText, sourceRecord } = request;
  const compute = (): Output => {
    H.domain(replicateId.length > 0, "replicateId");
    H.domain(suppliedFounderCountText.length > 0, "suppliedFounderCountText");
    H.domain(sourceRecord.length > 0, "sourceRecord");
    return {
      token: JSON.stringify([
        replicateId,
        suppliedFounderCountText,
        sourceRecord,
      ]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    replicateId: "R17",
    suppliedFounderCountText: "12",
    sourceRecord: "record S4",
  },
  output: { token: '["R17","12","record S4"]' },
} satisfies ToolExample<Input, Output>;
export const evolutionaryReplicateFounderCountLabelTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "evolutionary-biology/evolutionary-replicate-founder-count-label",
      title: "Evolutionary Replicate Founder Count Label Tool",
      description:
        "Preserve an explicitly supplied evolutionary replicate founder-count transcription and source without estimating effective population size.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          replicateId: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedFounderCountText: {
            type: "string",
            maxLength: 8192,
            minLength: 1,
          },
          sourceRecord: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["replicateId", "suppliedFounderCountText", "sourceRecord"],
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
            id: "replicateId",
            label: "Replicate Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedFounderCountText",
            label: "Supplied Founder Count Text",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "sourceRecord",
            label: "Source Record",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "token", label: "Token", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = evolutionaryReplicateFounderCountLabelTool.execute;
export default evolutionaryReplicateFounderCountLabelTool;
