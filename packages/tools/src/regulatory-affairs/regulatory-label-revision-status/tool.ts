import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly labelId: string;
  readonly revisionStatus: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    labelId: { type: "string", maxLength: 8192, minLength: 1 },
    revisionStatus: {
      type: "string",
      maxLength: 8192,
      enum: ["draft", "approved", "superseded", "withdrawn", "unspecified"],
    },
  },
  required: ["labelId", "revisionStatus"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicitly recorded revision status without determining regulatory approval. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { labelId, revisionStatus } = request;
  const compute = (): Output => {
    H.domain(labelId.length > 0, "labelId");
    H.domain(
      ["draft", "approved", "superseded", "withdrawn", "unspecified"].includes(
        revisionStatus,
      ),
      "revisionStatus",
    );
    return { label: labelId + " [" + revisionStatus + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { labelId: "LBL17", revisionStatus: "approved" },
  output: { label: "LBL17 [approved]" },
} satisfies ToolExample<Input, Output>;
export const regulatoryLabelRevisionStatusTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "regulatory-affairs",
        "regulatory affairs",
        "research and quality management",
      ],
      keywords: ["regulatory affairs", "research and quality management"],
    },
    id: "regulatory-affairs/regulatory-label-revision-status",
    title: "Regulatory Label Revision Status",
    description:
      "Label an explicitly recorded revision status without determining regulatory approval.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        labelId: { type: "string", maxLength: 8192, minLength: 1 },
        revisionStatus: {
          type: "string",
          maxLength: 8192,
          enum: ["draft", "approved", "superseded", "withdrawn", "unspecified"],
        },
      },
      required: ["labelId", "revisionStatus"],
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
          id: "labelId",
          label: "Label Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "revisionStatus",
          label: "Revision Status",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = regulatoryLabelRevisionStatusTool.execute;
export default regulatoryLabelRevisionStatusTool;
