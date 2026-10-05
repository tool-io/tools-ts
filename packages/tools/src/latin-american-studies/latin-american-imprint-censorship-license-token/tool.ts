import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly imprintTitle: string;
  readonly licenseWording: string;
  readonly sourceLocator: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    imprintTitle: { type: "string", maxLength: 8192 },
    licenseWording: { type: "string", maxLength: 8192 },
    sourceLocator: { type: "string", maxLength: 8192 },
  },
  required: ["imprintTitle", "licenseWording", "sourceLocator"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Preserve explicit imprint-license wording with a source locator without asserting publication rights or approval. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { imprintTitle, licenseWording, sourceLocator } = request;
  const compute = (): Output => {
    H.domain(
      imprintTitle.length > 0 &&
        licenseWording.length > 0 &&
        sourceLocator.length > 0,
      "imprintTitle",
    );
    return {
      label:
        imprintTitle +
        "; license transcription=" +
        JSON.stringify(licenseWording) +
        " [" +
        sourceLocator +
        "]",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    imprintTitle: "Title A",
    licenseWording: "con licencia",
    sourceLocator: "title page",
  },
  output: {
    label: 'Title A; license transcription="con licencia" [title page]',
  },
} satisfies ToolExample<Input, Output>;
export const latinAmericanImprintCensorshipLicenseTokenTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "latin-american-studies/latin-american-imprint-censorship-license-token",
      title: "Latin American Imprint Censorship License Token Tool",
      description:
        "Preserve explicit imprint-license wording with a source locator without asserting publication rights or approval.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          imprintTitle: { type: "string", maxLength: 8192 },
          licenseWording: { type: "string", maxLength: 8192 },
          sourceLocator: { type: "string", maxLength: 8192 },
        },
        required: ["imprintTitle", "licenseWording", "sourceLocator"],
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
            id: "imprintTitle",
            label: "Imprint Title",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "licenseWording",
            label: "License Wording",
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
        outputs: [
          { id: "label", label: "Label", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = latinAmericanImprintCensorshipLicenseTokenTool.execute;
export default latinAmericanImprintCensorshipLicenseTokenTool;
