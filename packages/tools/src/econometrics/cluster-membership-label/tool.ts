import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observationCode: string;
  readonly clusterCode: string;
  readonly clusterDimension: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observationCode: { type: "string", maxLength: 8192, minLength: 1 },
    clusterCode: { type: "string", maxLength: 8192, minLength: 1 },
    clusterDimension: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["observationCode", "clusterCode", "clusterDimension"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicitly assigned observation cluster and clustering dimension without selecting standard-error assumptions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observationCode, clusterCode, clusterDimension } = request;
  const compute = (): Output => {
    H.domain(
      observationCode.length > 0 &&
        clusterCode.length > 0 &&
        clusterDimension.length > 0,
      "observationCode",
    );
    return {
      label: JSON.stringify([observationCode, clusterDimension, clusterCode]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    observationCode: "O17",
    clusterCode: "F3",
    clusterDimension: "firm",
  },
  output: { label: '["O17","firm","F3"]' },
} satisfies ToolExample<Input, Output>;
export const clusterMembershipLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["econometrics", "economics"],
      keywords: ["econometrics", "economics"],
    },
    id: "econometrics/cluster-membership-label",
    title: "Cluster Membership Label",
    description:
      "Label an explicitly assigned observation cluster and clustering dimension without selecting standard-error assumptions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observationCode: { type: "string", maxLength: 8192, minLength: 1 },
        clusterCode: { type: "string", maxLength: 8192, minLength: 1 },
        clusterDimension: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["observationCode", "clusterCode", "clusterDimension"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "observationCode",
          label: "Observation Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "clusterCode",
          label: "Cluster Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "clusterDimension",
          label: "Cluster Dimension",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = clusterMembershipLabelTool.execute;
export default clusterMembershipLabelTool;
