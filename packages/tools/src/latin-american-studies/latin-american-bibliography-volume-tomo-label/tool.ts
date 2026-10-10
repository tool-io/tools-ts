import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly titleText: string;
  readonly suppliedVolumeText: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    titleText: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedVolumeText: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["titleText", "suppliedVolumeText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Format an explicit bibliographic volume label with tomo without converting numerals or identifying an edition. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { titleText, suppliedVolumeText } = request;
  const compute = (): Output => {
    H.domain(
      titleText.length > 0 && suppliedVolumeText.length > 0,
      "titleText",
    );
    return { label: titleText + ", tomo " + suppliedVolumeText };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { titleText: "Título A", suppliedVolumeText: "III" },
  output: { label: "Título A, tomo III" },
} satisfies ToolExample<Input, Output>;
export const latinAmericanBibliographyVolumeTomoLabelTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: [
          "latin-american-studies",
          "latin american studies",
          "humanities",
        ],
        keywords: ["latin american studies", "humanities"],
      },
      id: "latin-american-studies/latin-american-bibliography-volume-tomo-label",
      title: "Latin American Bibliography Volume Tomo Label",
      description:
        "Format an explicit bibliographic volume label with tomo without converting numerals or identifying an edition.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          titleText: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedVolumeText: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["titleText", "suppliedVolumeText"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { label: { type: "string", maxLength: 8192 } },
        required: ["label"],
      },
      ports: {
        inputs: [
          {
            id: "titleText",
            label: "Title Text",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedVolumeText",
            label: "Supplied Volume Text",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "label", label: "Label", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = latinAmericanBibliographyVolumeTomoLabelTool.execute;
export default latinAmericanBibliographyVolumeTomoLabelTool;
