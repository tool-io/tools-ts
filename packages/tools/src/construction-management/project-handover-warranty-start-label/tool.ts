import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly projectId: string;
  readonly handoverDateText: string;
  readonly warrantySource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    projectId: { type: "string", maxLength: 8192, minLength: 1 },
    handoverDateText: { type: "string", maxLength: 8192, minLength: 1 },
    warrantySource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["projectId", "handoverDateText", "warrantySource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve supplied handover date and warranty-start source metadata without interpreting warranty commencement. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { projectId, handoverDateText, warrantySource } = request;
  const compute = (): Output => {
    H.domain(projectId.length > 0, "projectId");
    H.domain(handoverDateText.length > 0, "handoverDateText");
    H.domain(warrantySource.length > 0, "warrantySource");
    return {
      token: JSON.stringify([projectId, handoverDateText, warrantySource]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    projectId: "P17",
    handoverDateText: "2026-11-01",
    warrantySource: "clause 4",
  },
  output: { token: '["P17","2026-11-01","clause 4"]' },
} satisfies ToolExample<Input, Output>;
export const projectHandoverWarrantyStartLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: [
        "construction-management",
        "construction management",
        "engineering",
      ],
      keywords: ["construction management", "engineering"],
    },
    id: "construction-management/project-handover-warranty-start-label",
    title: "Project Handover Warranty Start Label",
    description:
      "Preserve supplied handover date and warranty-start source metadata without interpreting warranty commencement.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        projectId: { type: "string", maxLength: 8192, minLength: 1 },
        handoverDateText: { type: "string", maxLength: 8192, minLength: 1 },
        warrantySource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["projectId", "handoverDateText", "warrantySource"],
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
          id: "projectId",
          label: "Project Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "handoverDateText",
          label: "Handover Date Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "warrantySource",
          label: "Warranty Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = projectHandoverWarrantyStartLabelTool.execute;
export default projectHandoverWarrantyStartLabelTool;
