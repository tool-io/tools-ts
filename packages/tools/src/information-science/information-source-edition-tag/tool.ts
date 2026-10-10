import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceId: string;
  readonly edition: string;
  readonly publicationWording: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceId: { type: "string", maxLength: 8192, minLength: 1 },
    edition: { type: "string", maxLength: 8192, minLength: 1 },
    publicationWording: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["sourceId", "edition", "publicationWording"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify explicit source-edition wording without normalizing publication history. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourceId, edition, publicationWording } = request;
  const compute = (): Output => {
    H.domain(sourceId.length > 0, "sourceId");
    H.domain(edition.length > 0, "edition");
    H.domain(publicationWording.length > 0, "publicationWording");
    return { token: JSON.stringify([sourceId, edition, publicationWording]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sourceId: "SRC17",
    edition: "2nd edition",
    publicationWording: "2026",
  },
  output: { token: '["SRC17","2nd edition","2026"]' },
} satisfies ToolExample<Input, Output>;
export const informationSourceEditionTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "information-science",
        "information science",
        "information and language sciences",
      ],
      keywords: ["information science", "information and language sciences"],
    },
    id: "information-science/information-source-edition-tag",
    title: "Information Source Edition Tag",
    description:
      "Qualify explicit source-edition wording without normalizing publication history.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceId: { type: "string", maxLength: 8192, minLength: 1 },
        edition: { type: "string", maxLength: 8192, minLength: 1 },
        publicationWording: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["sourceId", "edition", "publicationWording"],
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
          id: "sourceId",
          label: "Source Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "edition",
          label: "Edition",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "publicationWording",
          label: "Publication Wording",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = informationSourceEditionTagTool.execute;
export default informationSourceEditionTagTool;
