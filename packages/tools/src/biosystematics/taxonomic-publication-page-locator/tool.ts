import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly publication: string;
  readonly volume: string;
  readonly page: string;
  readonly figure: string;
};
export type Output = { readonly key: string; readonly hasFigure: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    publication: { type: "string", maxLength: 8192 },
    volume: { type: "string", maxLength: 8192 },
    page: { type: "string", maxLength: 8192 },
    figure: { type: "string", maxLength: 8192 },
  },
  required: ["publication", "volume", "page", "figure"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    key: { type: "string", maxLength: 8192 },
    hasFigure: { type: "boolean" },
  },
  required: ["key", "hasFigure"],
} as const;
/** Preserve publication/page/figure locator spellings exactly. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { publication, volume, page, figure } = request;
  const compute = (): Output => {
    H.domain(publication.length > 0 && page.length > 0);
    return {
      key: JSON.stringify([publication, volume, page, figure]),
      hasFigure: figure.length > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { publication: "pub-A", volume: "12", page: "0012", figure: "2a" },
  output: { key: '["pub-A","12","0012","2a"]', hasFigure: true },
} satisfies ToolExample<Input, Output>;
export const taxonomicPublicationPageLocatorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biosystematics/taxonomic-publication-page-locator",
    title: "Taxonomic Publication Page Locator Tool",
    description: "Preserve publication/page/figure locator spellings exactly.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        publication: { type: "string", maxLength: 8192 },
        volume: { type: "string", maxLength: 8192 },
        page: { type: "string", maxLength: 8192 },
        figure: { type: "string", maxLength: 8192 },
      },
      required: ["publication", "volume", "page", "figure"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        key: { type: "string", maxLength: 8192 },
        hasFigure: { type: "boolean" },
      },
      required: ["key", "hasFigure"],
    },
    ports: {
      inputs: [
        {
          id: "publication",
          label: "Publication",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "volume",
          label: "Volume",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "page",
          label: "Page",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "figure",
          label: "Figure",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "key", label: "Key", valueType: { type: "string" } },
        {
          id: "hasFigure",
          label: "Has Figure",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = taxonomicPublicationPageLocatorTool.execute;
export default taxonomicPublicationPageLocatorTool;
