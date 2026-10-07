import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly contactLength: number;
  readonly contactWidth: number;
};
export type Output = { readonly rectangularContactArea: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    contactLength: { type: "number", minimum: 0 },
    contactWidth: { type: "number", minimum: 0 },
  },
  required: ["contactLength", "contactWidth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { rectangularContactArea: { type: "number" } },
  required: ["rectangularContactArea"],
} as const;
/** Calculate a supplied rectangular electrode contact area without estimating current density or clinical safety. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { contactLength, contactWidth } = request;
  const compute = (): Output => {
    H.domain(contactLength >= 0, "contactLength");
    H.domain(contactWidth >= 0, "contactWidth");
    return { rectangularContactArea: contactLength * contactWidth };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { contactLength: 4, contactWidth: 3 },
  output: { rectangularContactArea: 12 },
} satisfies ToolExample<Input, Output>;
export const biomedicalElectrodeContactAreaTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["bioengineering", "engineering"],
      keywords: ["bioengineering", "engineering"],
    },
    id: "bioengineering/biomedical-electrode-contact-area",
    title: "Biomedical Electrode Contact Area",
    description:
      "Calculate a supplied rectangular electrode contact area without estimating current density or clinical safety.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        contactLength: { type: "number", minimum: 0 },
        contactWidth: { type: "number", minimum: 0 },
      },
      required: ["contactLength", "contactWidth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { rectangularContactArea: { type: "number" } },
      required: ["rectangularContactArea"],
    },
    ports: {
      inputs: [
        {
          id: "contactLength",
          label: "Contact Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "contactWidth",
          label: "Contact Width",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "rectangularContactArea",
          label: "Rectangular Contact Area",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = biomedicalElectrodeContactAreaTool.execute;
export default biomedicalElectrodeContactAreaTool;
