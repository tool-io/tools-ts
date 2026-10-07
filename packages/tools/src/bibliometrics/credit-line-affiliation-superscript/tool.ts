import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly authorName: string;
  readonly affiliationMarker: string;
};
export type Output = { readonly creditHtml: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    authorName: { type: "string", maxLength: 8192, minLength: 1 },
    affiliationMarker: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["authorName", "affiliationMarker"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { creditHtml: { type: "string", maxLength: 8192 } },
  required: ["creditHtml"],
} as const;
/** Render escaped supplied author and affiliation marker as a small HTML superscript credit fragment without resolving affiliations. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { authorName, affiliationMarker } = request;
  const compute = (): Output => {
    H.domain(authorName.length > 0, "authorName");
    H.domain(affiliationMarker.length > 0, "affiliationMarker");
    const escape = (value: string) =>
      value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll(String.fromCharCode(34), "&quot;")
        .replaceAll("'", "&#39;");
    return {
      creditHtml:
        escape(authorName) + "<sup>" + escape(affiliationMarker) + "</sup>",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { authorName: "A. Lee", affiliationMarker: "1" },
  output: { creditHtml: "A. Lee<sup>1</sup>" },
} satisfies ToolExample<Input, Output>;
export const creditLineAffiliationSuperscriptTool = H.defineSchemaCalculation<
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
    id: "bibliometrics/credit-line-affiliation-superscript",
    title: "Credit Line Affiliation Superscript",
    description:
      "Render escaped supplied author and affiliation marker as a small HTML superscript credit fragment without resolving affiliations.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        authorName: { type: "string", maxLength: 8192, minLength: 1 },
        affiliationMarker: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["authorName", "affiliationMarker"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { creditHtml: { type: "string", maxLength: 8192 } },
      required: ["creditHtml"],
    },
    ports: {
      inputs: [
        {
          id: "authorName",
          label: "Author Name",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "affiliationMarker",
          label: "Affiliation Marker",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "creditHtml",
          label: "Credit Html",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = creditLineAffiliationSuperscriptTool.execute;
export default creditLineAffiliationSuperscriptTool;
