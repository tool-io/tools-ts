import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstAllele: string;
  readonly secondAllele: string;
  readonly separator: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstAllele: { type: "string", maxLength: 8192, minLength: 1 },
    secondAllele: { type: "string", maxLength: 8192, minLength: 1 },
    separator: { type: "string", maxLength: 8192, enum: ["/", "|"] },
  },
  required: ["firstAllele", "secondAllele", "separator"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Join explicitly supplied allele labels with an explicit unphased or phased separator without assigning a diplotype. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstAllele, secondAllele, separator } = request;
  const compute = (): Output => {
    H.domain(firstAllele.length > 0 && secondAllele.length > 0, "firstAllele");
    H.domain(["/", "|"].includes(separator), "separator");
    return { label: firstAllele + separator + secondAllele };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstAllele: "*1", secondAllele: "*4", separator: "/" },
  output: { label: "*1/*4" },
} satisfies ToolExample<Input, Output>;
export const diplotypeSeparatorLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["pharmacogenomics", "pharmacy"],
      keywords: ["pharmacogenomics", "pharmacy"],
    },
    id: "pharmacogenomics/diplotype-separator-label",
    title: "Diplotype Separator Label",
    description:
      "Join explicitly supplied allele labels with an explicit unphased or phased separator without assigning a diplotype.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstAllele: { type: "string", maxLength: 8192, minLength: 1 },
        secondAllele: { type: "string", maxLength: 8192, minLength: 1 },
        separator: { type: "string", maxLength: 8192, enum: ["/", "|"] },
      },
      required: ["firstAllele", "secondAllele", "separator"],
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
          id: "firstAllele",
          label: "First Allele",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "secondAllele",
          label: "Second Allele",
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
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = diplotypeSeparatorLabelTool.execute;
export default diplotypeSeparatorLabelTool;
