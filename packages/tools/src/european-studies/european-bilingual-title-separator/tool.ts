import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstTitle: string;
  readonly secondTitle: string;
  readonly separator: string;
};
export type Output = { readonly displayTitle: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstTitle: { type: "string", maxLength: 8192, minLength: 1 },
    secondTitle: { type: "string", maxLength: 8192, minLength: 1 },
    separator: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["firstTitle", "secondTitle", "separator"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { displayTitle: { type: "string", maxLength: 8192 } },
  required: ["displayTitle"],
} as const;
/** Join explicitly supplied bilingual titles with a selected separator without translating or asserting title equivalence. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstTitle, secondTitle, separator } = request;
  const compute = (): Output => {
    H.domain(
      firstTitle.length > 0 && secondTitle.length > 0 && separator.length > 0,
      "firstTitle",
    );
    return { displayTitle: firstTitle + separator + secondTitle };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstTitle: "Titre A", secondTitle: "Title A", separator: " / " },
  output: { displayTitle: "Titre A / Title A" },
} satisfies ToolExample<Input, Output>;
export const europeanBilingualTitleSeparatorTool = H.defineSchemaCalculation<
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
    id: "european-studies/european-bilingual-title-separator",
    title: "European Bilingual Title Separator",
    description:
      "Join explicitly supplied bilingual titles with a selected separator without translating or asserting title equivalence.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstTitle: { type: "string", maxLength: 8192, minLength: 1 },
        secondTitle: { type: "string", maxLength: 8192, minLength: 1 },
        separator: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["firstTitle", "secondTitle", "separator"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { displayTitle: { type: "string", maxLength: 8192 } },
      required: ["displayTitle"],
    },
    ports: {
      inputs: [
        {
          id: "firstTitle",
          label: "First Title",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "secondTitle",
          label: "Second Title",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "separator",
          label: "Separator",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "displayTitle",
          label: "Display Title",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = europeanBilingualTitleSeparatorTool.execute;
export default europeanBilingualTitleSeparatorTool;
