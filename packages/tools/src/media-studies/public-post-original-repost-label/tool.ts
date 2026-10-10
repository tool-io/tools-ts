import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly postId: string;
  readonly reportedRelation: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    postId: { type: "string", maxLength: 8192, minLength: 1 },
    reportedRelation: {
      type: "string",
      maxLength: 8192,
      enum: ["original", "repost", "quotation", "unknown"],
    },
  },
  required: ["postId", "reportedRelation"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicitly reported public-post relation without identifying copied content. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { postId, reportedRelation } = request;
  const compute = (): Output => {
    H.domain(postId.length > 0, "postId");
    H.domain(
      ["original", "repost", "quotation", "unknown"].includes(reportedRelation),
      "reportedRelation",
    );
    return { label: postId + " [" + reportedRelation + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { postId: "P17", reportedRelation: "repost" },
  output: { label: "P17 [repost]" },
} satisfies ToolExample<Input, Output>;
export const publicPostOriginalRepostLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["media-studies", "media studies", "social sciences"],
      keywords: ["media studies", "social sciences"],
    },
    id: "media-studies/public-post-original-repost-label",
    title: "Public Post Original Repost Label",
    description:
      "Label an explicitly reported public-post relation without identifying copied content.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        postId: { type: "string", maxLength: 8192, minLength: 1 },
        reportedRelation: {
          type: "string",
          maxLength: 8192,
          enum: ["original", "repost", "quotation", "unknown"],
        },
      },
      required: ["postId", "reportedRelation"],
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
          id: "postId",
          label: "Post Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "reportedRelation",
          label: "Reported Relation",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = publicPostOriginalRepostLabelTool.execute;
export default publicPostOriginalRepostLabelTool;
