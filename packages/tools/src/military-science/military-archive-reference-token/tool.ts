import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly repository: string;
  readonly collection: string;
  readonly item: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    repository: { type: "string", maxLength: 8192 },
    collection: { type: "string", maxLength: 8192 },
    item: { type: "string", maxLength: 8192 },
  },
  required: ["repository", "collection", "item"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Encode a public military-history archive location as a repository/collection/item token. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { repository, collection, item } = request;
  const compute = (): Output => {
    H.domain(
      repository.length > 0 && collection.length > 0 && item.length > 0,
      "repository",
    );
    return { token: JSON.stringify([repository, collection, item]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    repository: "Archive A",
    collection: "Collection 12",
    item: "Item 7",
  },
  output: { token: '["Archive A","Collection 12","Item 7"]' },
} satisfies ToolExample<Input, Output>;
export const militaryArchiveReferenceTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "military-science/military-archive-reference-token",
    title: "Military Archive Reference Token Tool",
    description:
      "Encode a public military-history archive location as a repository/collection/item token.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        repository: { type: "string", maxLength: 8192 },
        collection: { type: "string", maxLength: 8192 },
        item: { type: "string", maxLength: 8192 },
      },
      required: ["repository", "collection", "item"],
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
          id: "repository",
          label: "Repository",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "collection",
          label: "Collection",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "item",
          label: "Item",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = militaryArchiveReferenceTokenTool.execute;
export default militaryArchiveReferenceTokenTool;
