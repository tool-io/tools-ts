import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly studyUid: string;
  readonly seriesUid: string;
  readonly instanceUid: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    studyUid: { type: "string", maxLength: 8192, minLength: 1 },
    seriesUid: { type: "string", maxLength: 8192, minLength: 1 },
    instanceUid: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["studyUid", "seriesUid", "instanceUid"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record supplied DICOM study, series, and instance UID strings without resolving images or validating UID assignment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { studyUid, seriesUid, instanceUid } = request;
  const compute = (): Output => {
    H.domain(studyUid.length > 0, "studyUid");
    H.domain(seriesUid.length > 0, "seriesUid");
    H.domain(instanceUid.length > 0, "instanceUid");
    return { token: JSON.stringify([studyUid, seriesUid, instanceUid]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { studyUid: "1.2.3", seriesUid: "1.2.3.4", instanceUid: "1.2.3.4.5" },
  output: { token: '["1.2.3","1.2.3.4","1.2.3.4.5"]' },
} satisfies ToolExample<Input, Output>;
export const dicomSopInstanceReferenceTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["radiology", "health and medicine"],
      keywords: ["radiology", "health and medicine"],
    },
    id: "radiology/dicom-sop-instance-reference-token",
    title: "DICOM SOP Instance Reference Token",
    description:
      "Record supplied DICOM study, series, and instance UID strings without resolving images or validating UID assignment.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        studyUid: { type: "string", maxLength: 8192, minLength: 1 },
        seriesUid: { type: "string", maxLength: 8192, minLength: 1 },
        instanceUid: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["studyUid", "seriesUid", "instanceUid"],
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
          id: "studyUid",
          label: "Study Uid",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "seriesUid",
          label: "Series Uid",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "instanceUid",
          label: "Instance Uid",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = dicomSopInstanceReferenceTokenTool.execute;
export default dicomSopInstanceReferenceTokenTool;
