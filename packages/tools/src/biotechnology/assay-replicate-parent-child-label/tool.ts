import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly assayId: string;
  readonly parentSampleId: string;
  readonly replicateId: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    assayId: { type: "string", maxLength: 8192, minLength: 1 },
    parentSampleId: { type: "string", maxLength: 8192, minLength: 1 },
    replicateId: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["assayId", "parentSampleId", "replicateId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Build an explicit assay replicate-parent key without inferring sample lineage. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { assayId, parentSampleId, replicateId } = request;
  const compute = (): Output => {
    H.domain(assayId.length > 0, "assayId");
    H.domain(parentSampleId.length > 0, "parentSampleId");
    H.domain(replicateId.length > 0, "replicateId");
    return { token: JSON.stringify([assayId, parentSampleId, replicateId]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { assayId: "A17", parentSampleId: "S2", replicateId: "REP3" },
  output: { token: '["A17","S2","REP3"]' },
} satisfies ToolExample<Input, Output>;
export const assayReplicateParentChildLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["biotechnology", "biology"],
      keywords: ["biotechnology", "biology"],
    },
    id: "biotechnology/assay-replicate-parent-child-label",
    title: "Assay Replicate Parent Child Label",
    description:
      "Build an explicit assay replicate-parent key without inferring sample lineage.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        assayId: { type: "string", maxLength: 8192, minLength: 1 },
        parentSampleId: { type: "string", maxLength: 8192, minLength: 1 },
        replicateId: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["assayId", "parentSampleId", "replicateId"],
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
          id: "assayId",
          label: "Assay Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "parentSampleId",
          label: "Parent Sample Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "replicateId",
          label: "Replicate Id",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = assayReplicateParentChildLabelTool.execute;
export default assayReplicateParentChildLabelTool;
