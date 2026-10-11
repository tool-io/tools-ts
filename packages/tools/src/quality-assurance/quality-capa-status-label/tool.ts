import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly actionId: string; readonly status: string };
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    actionId: { type: "string", maxLength: 8192, minLength: 1 },
    status: {
      type: "string",
      maxLength: 8192,
      enum: ["open", "in-progress", "closed", "cancelled", "unspecified"],
    },
  },
  required: ["actionId", "status"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicitly recorded corrective-action status without judging effectiveness or compliance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { actionId, status } = request;
  const compute = (): Output => {
    H.domain(actionId.length > 0, "actionId");
    H.domain(
      ["open", "in-progress", "closed", "cancelled", "unspecified"].includes(
        status,
      ),
      "status",
    );
    return { label: actionId + " [" + status + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { actionId: "CAPA17", status: "in-progress" },
  output: { label: "CAPA17 [in-progress]" },
} satisfies ToolExample<Input, Output>;
export const qualityCapaStatusLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "quality-assurance",
        "quality assurance",
        "research and quality management",
      ],
      keywords: ["quality assurance", "research and quality management"],
    },
    id: "quality-assurance/quality-capa-status-label",
    title: "Quality CAPA Status Label",
    description:
      "Label an explicitly recorded corrective-action status without judging effectiveness or compliance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        actionId: { type: "string", maxLength: 8192, minLength: 1 },
        status: {
          type: "string",
          maxLength: 8192,
          enum: ["open", "in-progress", "closed", "cancelled", "unspecified"],
        },
      },
      required: ["actionId", "status"],
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
          id: "actionId",
          label: "Action Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "status",
          label: "Status",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = qualityCapaStatusLabelTool.execute;
export default qualityCapaStatusLabelTool;
