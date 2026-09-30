import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly token: string };
export type Output = {
  readonly collection: string;
  readonly book: string;
  readonly report: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    collection: { type: "string", maxLength: 8192 },
    book: { type: "string", maxLength: 8192 },
    report: { type: "string", maxLength: 8192 },
  },
  required: ["collection", "book", "report"],
} as const;
/** Split an explicit collection:book:report locator while preserving edition-dependent identifiers and leading zeros; no report identity or grading lookup. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { token } = request;
  const compute = (): Output => {
    const match =
      /^([A-Za-z][A-Za-z0-9-]*):([A-Za-z0-9.-]+):([A-Za-z0-9.-]+)(?![\s\S])/.exec(
        token,
      );
    H.domain(match);
    return { collection: match[1], book: match[2], report: match[3] };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { token: "collection-a:12:34b" },
  output: { collection: "collection-a", book: "12", report: "34b" },
} satisfies ToolExample<Input, Output>;
export const hadithCollectionBookReportTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "islamic-studies/hadith-collection-book-report-token",
    title: "Hadith Collection Book Report Token Tool",
    description:
      "Split an explicit collection:book:report locator while preserving edition-dependent identifiers and leading zeros; no report identity or grading lookup.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        collection: { type: "string", maxLength: 8192 },
        book: { type: "string", maxLength: 8192 },
        report: { type: "string", maxLength: 8192 },
      },
      required: ["collection", "book", "report"],
    },
    ports: {
      inputs: [
        {
          id: "token",
          label: "Token",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "collection",
          label: "Collection",
          valueType: { type: "string" },
        },
        { id: "book", label: "Book", valueType: { type: "string" } },
        { id: "report", label: "Report", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = hadithCollectionBookReportTokenTool.execute;
export default hadithCollectionBookReportTokenTool;
