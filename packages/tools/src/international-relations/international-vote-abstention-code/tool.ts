import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly vote: string };
export type Output = {
  readonly code: string;
  readonly countsAsCastYesOrNo: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    vote: {
      type: "string",
      maxLength: 8192,
      enum: ["yes", "no", "abstain", "absent", "not-voting"],
    },
  },
  required: ["vote"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    code: { type: "string", maxLength: 8192 },
    countsAsCastYesOrNo: { type: "boolean" },
  },
  required: ["code", "countsAsCastYesOrNo"],
} as const;
/** Encode one explicitly recorded international vote under a declared Y/N/A/X/NV convention, separating abstention from absence. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { vote } = request;
  const compute = (): Output => {
    H.domain(
      ["yes", "no", "abstain", "absent", "not-voting"].includes(vote),
      "vote",
    );
    return {
      code:
        vote === "yes"
          ? "Y"
          : vote === "no"
            ? "N"
            : vote === "abstain"
              ? "A"
              : vote === "absent"
                ? "X"
                : "NV",
      countsAsCastYesOrNo: vote === "yes" || vote === "no",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { vote: "abstain" },
  output: { code: "A", countsAsCastYesOrNo: false },
} satisfies ToolExample<Input, Output>;
export const internationalVoteAbstentionCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "international-relations/international-vote-abstention-code",
    title: "International Vote Abstention Code Tool",
    description:
      "Encode one explicitly recorded international vote under a declared Y/N/A/X/NV convention, separating abstention from absence.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        vote: {
          type: "string",
          maxLength: 8192,
          enum: ["yes", "no", "abstain", "absent", "not-voting"],
        },
      },
      required: ["vote"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        code: { type: "string", maxLength: 8192 },
        countsAsCastYesOrNo: { type: "boolean" },
      },
      required: ["code", "countsAsCastYesOrNo"],
    },
    ports: {
      inputs: [
        {
          id: "vote",
          label: "Vote",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "code", label: "Code", valueType: { type: "string" } },
        {
          id: "countsAsCastYesOrNo",
          label: "Counts As Cast Yes Or No",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = internationalVoteAbstentionCodeTool.execute;
export default internationalVoteAbstentionCodeTool;
