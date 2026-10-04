import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly adaptationTitle: string;
  readonly sourceTitle: string;
  readonly relation: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    adaptationTitle: { type: "string", maxLength: 8192 },
    sourceTitle: { type: "string", maxLength: 8192 },
    relation: {
      type: "string",
      maxLength: 8192,
      enum: ["adapted from", "inspired by", "translation of"],
    },
  },
  required: ["adaptationTitle", "sourceTitle", "relation"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Format an explicit adaptation relation between two display titles without establishing provenance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { adaptationTitle, sourceTitle, relation } = request;
  const compute = (): Output => {
    H.domain(
      adaptationTitle.length > 0 && sourceTitle.length > 0,
      "adaptationTitle",
    );
    H.domain(
      ["adapted from", "inspired by", "translation of"].includes(relation),
      "relation",
    );
    return { label: adaptationTitle + " — " + relation + " " + sourceTitle };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    adaptationTitle: "Stage Work",
    sourceTitle: "Source Novel",
    relation: "adapted from",
  },
  output: { label: "Stage Work — adapted from Source Novel" },
} satisfies ToolExample<Input, Output>;
export const adaptationSourceTitleLinkTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cultural-studies/adaptation-source-title-link",
    title: "Adaptation Source Title Link Tool",
    description:
      "Format an explicit adaptation relation between two display titles without establishing provenance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        adaptationTitle: { type: "string", maxLength: 8192 },
        sourceTitle: { type: "string", maxLength: 8192 },
        relation: {
          type: "string",
          maxLength: 8192,
          enum: ["adapted from", "inspired by", "translation of"],
        },
      },
      required: ["adaptationTitle", "sourceTitle", "relation"],
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
          id: "adaptationTitle",
          label: "Adaptation Title",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourceTitle",
          label: "Source Title",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "relation",
          label: "Relation",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = adaptationSourceTitleLinkTool.execute;
export default adaptationSourceTitleLinkTool;
