import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly archiveId: string;
  readonly itemText: string;
  readonly subitemText: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    archiveId: { type: "string", maxLength: 8192, minLength: 1 },
    itemText: { type: "string", maxLength: 8192, minLength: 1 },
    subitemText: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["archiveId", "itemText", "subitemText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Build an unambiguous explicit archive item-subitem key while preserving source numbering. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { archiveId, itemText, subitemText } = request;
  const compute = (): Output => {
    H.domain(archiveId.length > 0, "archiveId");
    H.domain(itemText.length > 0, "itemText");
    H.domain(subitemText.length > 0, "subitemText");
    return { token: JSON.stringify([archiveId, itemText, subitemText]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { archiveId: "AR17", itemText: "42", subitemText: "b" },
  output: { token: '["AR17","42","b"]' },
} satisfies ToolExample<Input, Output>;
export const europeanArchiveItemSubitemSuffixTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["european-studies", "european studies", "humanities"],
      keywords: ["european studies", "humanities"],
    },
    id: "european-studies/european-archive-item-subitem-suffix",
    title: "European Archive Item Subitem Suffix",
    description:
      "Build an unambiguous explicit archive item-subitem key while preserving source numbering.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        archiveId: { type: "string", maxLength: 8192, minLength: 1 },
        itemText: { type: "string", maxLength: 8192, minLength: 1 },
        subitemText: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["archiveId", "itemText", "subitemText"],
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
          id: "archiveId",
          label: "Archive Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "itemText",
          label: "Item Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "subitemText",
          label: "Subitem Text",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = europeanArchiveItemSubitemSuffixTool.execute;
export default europeanArchiveItemSubitemSuffixTool;
