import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly bookId: string;
  readonly suppliedRunningTitle: string;
  readonly sourceLocator: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bookId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedRunningTitle: { type: "string", maxLength: 8192, minLength: 1 },
    sourceLocator: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["bookId", "suppliedRunningTitle", "sourceLocator"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit running-title transcription by locator without identifying an edition. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { bookId, suppliedRunningTitle, sourceLocator } = request;
  const compute = (): Output => {
    H.domain(bookId.length > 0, "bookId");
    H.domain(suppliedRunningTitle.length > 0, "suppliedRunningTitle");
    H.domain(sourceLocator.length > 0, "sourceLocator");
    return {
      token: JSON.stringify([bookId, suppliedRunningTitle, sourceLocator]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    bookId: "BOOK17",
    suppliedRunningTitle: "Title A",
    sourceLocator: "folio 3r",
  },
  output: { token: '["BOOK17","Title A","folio 3r"]' },
} satisfies ToolExample<Input, Output>;
export const eastasianBookRunningTitleMarkerTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["asian-studies", "asian studies", "humanities"],
      keywords: ["asian studies", "humanities"],
    },
    id: "asian-studies/east-asian-book-running-title-marker",
    title: "East Asian Book Running Title Marker",
    description:
      "Qualify an explicit running-title transcription by locator without identifying an edition.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bookId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedRunningTitle: { type: "string", maxLength: 8192, minLength: 1 },
        sourceLocator: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["bookId", "suppliedRunningTitle", "sourceLocator"],
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
          id: "bookId",
          label: "Book Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedRunningTitle",
          label: "Supplied Running Title",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourceLocator",
          label: "Source Locator",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = eastasianBookRunningTitleMarkerTool.execute;
export default eastasianBookRunningTitleMarkerTool;
