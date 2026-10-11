import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly libraryId: string;
  readonly collectionCode: string;
  readonly shelfmarkText: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    libraryId: { type: "string", maxLength: 8192, minLength: 1 },
    collectionCode: { type: "string", maxLength: 8192, minLength: 1 },
    shelfmarkText: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["libraryId", "collectionCode", "shelfmarkText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Build an unambiguous explicit monastery library shelfmark key without accessing a collection. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { libraryId, collectionCode, shelfmarkText } = request;
  const compute = (): Output => {
    H.domain(libraryId.length > 0, "libraryId");
    H.domain(collectionCode.length > 0, "collectionCode");
    H.domain(shelfmarkText.length > 0, "shelfmarkText");
    return {
      token: JSON.stringify([libraryId, collectionCode, shelfmarkText]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    libraryId: "LIB17",
    collectionCode: "COL2",
    shelfmarkText: "MS 042",
  },
  output: { token: '["LIB17","COL2","MS 042"]' },
} satisfies ToolExample<Input, Output>;
export const monasteryLibraryShelfmarkLocatorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["religious-studies", "religious studies", "humanities"],
      keywords: ["religious studies", "humanities"],
    },
    id: "religious-studies/monastery-library-shelfmark-locator",
    title: "Monastery Library Shelfmark Locator",
    description:
      "Build an unambiguous explicit monastery library shelfmark key without accessing a collection.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        libraryId: { type: "string", maxLength: 8192, minLength: 1 },
        collectionCode: { type: "string", maxLength: 8192, minLength: 1 },
        shelfmarkText: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["libraryId", "collectionCode", "shelfmarkText"],
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
          id: "libraryId",
          label: "Library Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "collectionCode",
          label: "Collection Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "shelfmarkText",
          label: "Shelfmark Text",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = monasteryLibraryShelfmarkLocatorTool.execute;
export default monasteryLibraryShelfmarkLocatorTool;
