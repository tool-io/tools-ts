import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly editionId: string;
  readonly pageText: string;
  readonly columnText: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    editionId: { type: "string", maxLength: 8192, minLength: 1 },
    pageText: { type: "string", maxLength: 8192, minLength: 1 },
    columnText: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["editionId", "pageText", "columnText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Build an unambiguous explicit edition page-column locator without retrieving text. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { editionId, pageText, columnText } = request;
  const compute = (): Output => {
    H.domain(editionId.length > 0, "editionId");
    H.domain(pageText.length > 0, "pageText");
    H.domain(columnText.length > 0, "columnText");
    return { token: JSON.stringify([editionId, pageText, columnText]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { editionId: "ED17", pageText: "42", columnText: "b" },
  output: { token: '["ED17","42","b"]' },
} satisfies ToolExample<Input, Output>;
export const arabicEditionPageColumnLocatorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "middle-eastern-studies",
        "middle eastern studies",
        "humanities",
      ],
      keywords: ["middle eastern studies", "humanities"],
    },
    id: "middle-eastern-studies/arabic-edition-page-column-locator",
    title: "Arabic Edition Page Column Locator",
    description:
      "Build an unambiguous explicit edition page-column locator without retrieving text.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        editionId: { type: "string", maxLength: 8192, minLength: 1 },
        pageText: { type: "string", maxLength: 8192, minLength: 1 },
        columnText: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["editionId", "pageText", "columnText"],
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
          id: "editionId",
          label: "Edition Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "pageText",
          label: "Page Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "columnText",
          label: "Column Text",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = arabicEditionPageColumnLocatorTool.execute;
export default arabicEditionPageColumnLocatorTool;
