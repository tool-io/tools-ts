import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleId: string;
  readonly suppliedComment: string;
  readonly commentSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedComment: { type: "string", maxLength: 8192, minLength: 1 },
    commentSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["sampleId", "suppliedComment", "commentSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit platelet-clump comment and source without inferring platelet counts or specimen acceptability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampleId, suppliedComment, commentSource } = request;
  const compute = (): Output => {
    H.domain(sampleId.length > 0, "sampleId");
    H.domain(suppliedComment.length > 0, "suppliedComment");
    H.domain(commentSource.length > 0, "commentSource");
    return {
      token: JSON.stringify([sampleId, suppliedComment, commentSource]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sampleId: "S17",
    suppliedComment: "clumps observed",
    commentSource: "reader R4",
  },
  output: { token: '["S17","clumps observed","reader R4"]' },
} satisfies ToolExample<Input, Output>;
export const plateletClumpCommentSourceTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hematology/platelet-clump-comment-source-token",
    title: "Platelet Clump Comment Source Token Tool",
    description:
      "Preserve an explicit platelet-clump comment and source without inferring platelet counts or specimen acceptability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedComment: { type: "string", maxLength: 8192, minLength: 1 },
        commentSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["sampleId", "suppliedComment", "commentSource"],
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
          id: "sampleId",
          label: "Sample Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedComment",
          label: "Supplied Comment",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "commentSource",
          label: "Comment Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = plateletClumpCommentSourceTokenTool.execute;
export default plateletClumpCommentSourceTokenTool;
