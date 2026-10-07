import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly requestId: string;
  readonly priorityCode: string;
  readonly sourcePolicy: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requestId: { type: "string", maxLength: 8192, minLength: 1 },
    priorityCode: { type: "string", maxLength: 8192, minLength: 1 },
    sourcePolicy: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["requestId", "priorityCode", "sourcePolicy"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Attach an explicitly recorded service-request priority and policy label without inferring urgency. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { requestId, priorityCode, sourcePolicy } = request;
  const compute = (): Output => {
    H.domain(
      requestId.length > 0 &&
        priorityCode.length > 0 &&
        sourcePolicy.length > 0,
      "requestId",
    );
    return {
      label:
        requestId + "; priority=" + priorityCode + " [" + sourcePolicy + "]",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    requestId: "R17",
    priorityCode: "P2",
    sourcePolicy: "local policy v3",
  },
  output: { label: "R17; priority=P2 [local policy v3]" },
} satisfies ToolExample<Input, Output>;
export const serviceRequestPriorityFieldTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "business-administration",
        "business administration",
        "business and finance",
      ],
      keywords: ["business administration", "business and finance"],
    },
    id: "business-administration/service-request-priority-field",
    title: "Service Request Priority Field",
    description:
      "Attach an explicitly recorded service-request priority and policy label without inferring urgency.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requestId: { type: "string", maxLength: 8192, minLength: 1 },
        priorityCode: { type: "string", maxLength: 8192, minLength: 1 },
        sourcePolicy: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["requestId", "priorityCode", "sourcePolicy"],
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
          id: "requestId",
          label: "Request Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "priorityCode",
          label: "Priority Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourcePolicy",
          label: "Source Policy",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = serviceRequestPriorityFieldTool.execute;
export default serviceRequestPriorityFieldTool;
