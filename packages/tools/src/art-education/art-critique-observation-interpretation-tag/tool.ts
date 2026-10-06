import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly commentId: string;
  readonly commentKind: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    commentId: { type: "string", maxLength: 8192, minLength: 1 },
    commentKind: {
      type: "string",
      maxLength: 8192,
      enum: ["observation", "interpretation", "question"],
    },
  },
  required: ["commentId", "commentKind"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label a supplied art-critique comment as observation, interpretation or question without classifying its text. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { commentId, commentKind } = request;
  const compute = (): Output => {
    H.domain(commentId.length > 0, "commentId");
    H.domain(
      ["observation", "interpretation", "question"].includes(commentKind),
      "commentKind",
    );
    return { label: commentId + " [" + commentKind + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { commentId: "C17", commentKind: "observation" },
  output: { label: "C17 [observation]" },
} satisfies ToolExample<Input, Output>;
export const artCritiqueObservationInterpretationTagTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["art-education", "art education", "education"],
        keywords: ["art education", "education"],
      },
      id: "art-education/art-critique-observation-interpretation-tag",
      title: "Art Critique Observation Interpretation Tag",
      description:
        "Label a supplied art-critique comment as observation, interpretation or question without classifying its text.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          commentId: { type: "string", maxLength: 8192, minLength: 1 },
          commentKind: {
            type: "string",
            maxLength: 8192,
            enum: ["observation", "interpretation", "question"],
          },
        },
        required: ["commentId", "commentKind"],
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
            id: "commentId",
            label: "Comment Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "commentKind",
            label: "Comment Kind",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "label", label: "Label", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = artCritiqueObservationInterpretationTagTool.execute;
export default artCritiqueObservationInterpretationTagTool;
