import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly authorId: string;
  readonly correspondingAuthorIds: readonly string[];
};
export type Output = { readonly isCorresponding: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    authorId: { type: "string", maxLength: 8192, minLength: 1 },
    correspondingAuthorIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["authorId", "correspondingAuthorIds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { isCorresponding: { type: "boolean" } },
  required: ["isCorresponding"],
} as const;
/** Check exact membership of an explicit author identifier in a supplied corresponding-author list. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { authorId, correspondingAuthorIds } = request;
  const compute = (): Output => {
    H.domain(authorId.length > 0, "authorId");
    return { isCorresponding: correspondingAuthorIds.includes(authorId) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { authorId: "A17", correspondingAuthorIds: ["A17", "A18"] },
  output: { isCorresponding: true },
} satisfies ToolExample<Input, Output>;
export const publicationAuthorCorrespondingFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["bibliometrics", "research and quality management"],
      keywords: ["bibliometrics", "research and quality management"],
    },
    id: "bibliometrics/publication-author-corresponding-flag",
    title: "Publication Author Corresponding Flag",
    description:
      "Check exact membership of an explicit author identifier in a supplied corresponding-author list.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        authorId: { type: "string", maxLength: 8192, minLength: 1 },
        correspondingAuthorIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["authorId", "correspondingAuthorIds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { isCorresponding: { type: "boolean" } },
      required: ["isCorresponding"],
    },
    ports: {
      inputs: [
        {
          id: "authorId",
          label: "Author Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "correspondingAuthorIds",
          label: "Corresponding Author Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "isCorresponding",
          label: "Is Corresponding",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = publicationAuthorCorrespondingFlagTool.execute;
export default publicationAuthorCorrespondingFlagTool;
