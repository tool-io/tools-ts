import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

const ATTACHMENTS = [
  "free",
  "adnate",
  "adnexed",
  "decurrent",
  "emarginate",
  "sinuate",
] as const;

type GillAttachment = (typeof ATTACHMENTS)[number];

export type GillAttachmentTypeClassifierInput = {
  readonly attachment: GillAttachment;
};

export type GillAttachmentTypeClassifierOutput = {
  readonly attachmentClass: GillAttachment;
};

export const gillAttachmentTypeClassifierExample = {
  input: { attachment: "free" },
  output: { attachmentClass: "free" },
} satisfies ToolExample<
  GillAttachmentTypeClassifierInput,
  GillAttachmentTypeClassifierOutput
>;

export const gillAttachmentTypeClassifierTool = createSimpleTool({
  id: "mycology/gill-attachment-type-classifier",
  title: "Gill Attachment Type",
  description: "Classify how the lamellae attach to the stipe.",
  inputs: [
    {
      enum: ATTACHMENTS,
      id: "attachment",
      kind: "string",
      label: "Attachment",
    },
  ],
  outputs: [
    {
      enum: ATTACHMENTS,
      id: "attachmentClass",
      kind: "string",
      label: "Attachment class",
    },
  ],
  calculate: (input) => {
    return { attachmentClass: input.attachment as GillAttachment };
  },
});
export const runGillAttachmentTypeClassifier =
  gillAttachmentTypeClassifierTool.execute;
export default gillAttachmentTypeClassifierTool;
