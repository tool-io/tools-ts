import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly referenceName: string;
  readonly edition: string;
  readonly publicationYear: number;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceName: { type: "string", maxLength: 8192 },
    edition: { type: "string", maxLength: 8192 },
    publicationYear: { type: "integer", minimum: 1, maximum: 9999 },
  },
  required: ["referenceName", "edition", "publicationYear"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label a supplied environmental reference edition and year without treating it as the currently applicable standard. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { referenceName, edition, publicationYear } = request;
  const compute = (): Output => {
    H.domain(referenceName.length > 0 && edition.length > 0, "referenceName");
    (H.domain(
      Number.isSafeInteger(publicationYear) &&
        publicationYear >= 1 &&
        publicationYear <= 9999,
      "publicationYear",
    ),
      publicationYear);
    return {
      label:
        referenceName + "; edition " + edition + " (" + publicationYear + ")",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    referenceName: "Local sampling guide",
    edition: "2",
    publicationYear: 2025,
  },
  output: { label: "Local sampling guide; edition 2 (2025)" },
} satisfies ToolExample<Input, Output>;
export const environmentalReferenceVersionLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-science/environmental-reference-version-label",
    title: "Environmental Reference Version Label Tool",
    description:
      "Label a supplied environmental reference edition and year without treating it as the currently applicable standard.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        referenceName: { type: "string", maxLength: 8192 },
        edition: { type: "string", maxLength: 8192 },
        publicationYear: { type: "integer", minimum: 1, maximum: 9999 },
      },
      required: ["referenceName", "edition", "publicationYear"],
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
          id: "referenceName",
          label: "Reference Name",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "edition",
          label: "Edition",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "publicationYear",
          label: "Publication Year",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = environmentalReferenceVersionLabelTool.execute;
export default environmentalReferenceVersionLabelTool;
