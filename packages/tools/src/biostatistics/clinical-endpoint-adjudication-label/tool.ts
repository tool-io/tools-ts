import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly endpointId: string;
  readonly status: string;
  readonly reviewerCode: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    endpointId: { type: "string", maxLength: 8192, minLength: 1 },
    status: {
      type: "string",
      maxLength: 8192,
      enum: ["pending", "confirmed", "not-confirmed", "indeterminate"],
    },
    reviewerCode: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["endpointId", "status", "reviewerCode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Render a recorded endpoint-adjudication state and reviewer code without adjudicating a clinical outcome. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { endpointId, status, reviewerCode } = request;
  const compute = (): Output => {
    H.domain(endpointId.length > 0 && reviewerCode.length > 0, "endpointId");
    H.domain(
      ["pending", "confirmed", "not-confirmed", "indeterminate"].includes(
        status,
      ),
      "status",
    );
    return {
      label: endpointId + " [" + status + "; reviewer=" + reviewerCode + "]",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { endpointId: "E17", status: "pending", reviewerCode: "R3" },
  output: { label: "E17 [pending; reviewer=R3]" },
} satisfies ToolExample<Input, Output>;
export const clinicalEndpointAdjudicationLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["biostatistics", "research and quality management"],
      keywords: ["biostatistics", "research and quality management"],
    },
    id: "biostatistics/clinical-endpoint-adjudication-label",
    title: "Clinical Endpoint Adjudication Label",
    description:
      "Render a recorded endpoint-adjudication state and reviewer code without adjudicating a clinical outcome.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        endpointId: { type: "string", maxLength: 8192, minLength: 1 },
        status: {
          type: "string",
          maxLength: 8192,
          enum: ["pending", "confirmed", "not-confirmed", "indeterminate"],
        },
        reviewerCode: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["endpointId", "status", "reviewerCode"],
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
          id: "endpointId",
          label: "Endpoint Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "status",
          label: "Status",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "reviewerCode",
          label: "Reviewer Code",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = clinicalEndpointAdjudicationLabelTool.execute;
export default clinicalEndpointAdjudicationLabelTool;
