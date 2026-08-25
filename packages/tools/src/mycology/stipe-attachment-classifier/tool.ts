import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

const STIPE_ATTACHMENTS = [
  "central",
  "eccentric",
  "lateral",
  "absent",
] as const;
type StipeAttachment = (typeof STIPE_ATTACHMENTS)[number];

export type StipeAttachmentClassifierInput = {
  readonly attachment: StipeAttachment;
};

export type StipeAttachmentClassifierOutput = {
  readonly stipeAttachmentClass: StipeAttachment;
};

export const stipeAttachmentClassifierExample = {
  input: { attachment: "central" },
  output: { stipeAttachmentClass: "central" },
} satisfies ToolExample<
  StipeAttachmentClassifierInput,
  StipeAttachmentClassifierOutput
>;

export const stipeAttachmentClassifierTool = createSimpleTool({
  id: "mycology/stipe-attachment-classifier",
  title: "Stipe Attachment",
  description: "Classify how the stipe attaches to the pileus.",
  inputs: [
    {
      enum: STIPE_ATTACHMENTS,
      id: "attachment",
      kind: "string",
      label: "Attachment",
    },
  ],
  outputs: [
    {
      enum: STIPE_ATTACHMENTS,
      id: "stipeAttachmentClass",
      kind: "string",
      label: "Stipe attachment class",
    },
  ],
  calculate: (input) => {
    return {
      stipeAttachmentClass: input.attachment as StipeAttachment,
    };
  },
});
export const runStipeAttachmentClassifier =
  stipeAttachmentClassifierTool.execute;
export default stipeAttachmentClassifierTool;
