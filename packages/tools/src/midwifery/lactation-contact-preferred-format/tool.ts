import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly preferredFormat: string;
  readonly availableFormats: readonly string[];
};
export type Output = { readonly available: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    preferredFormat: { type: "string", maxLength: 8192, minLength: 1 },
    availableFormats: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["preferredFormat", "availableFormats"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { available: { type: "boolean" } },
  required: ["available"],
} as const;
/** Check whether an explicitly preferred contact format is listed as available without inferring lactation needs or communication preferences. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { preferredFormat, availableFormats } = request;
  const compute = (): Output => {
    H.domain(preferredFormat.length > 0, "preferredFormat");
    return { available: availableFormats.includes(preferredFormat) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { preferredFormat: "text", availableFormats: ["text", "phone"] },
  output: { available: true },
} satisfies ToolExample<Input, Output>;
export const lactationContactPreferredFormatTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["midwifery", "health and medicine"],
      keywords: ["midwifery", "health and medicine"],
    },
    id: "midwifery/lactation-contact-preferred-format",
    title: "Lactation Contact Preferred Format",
    description:
      "Check whether an explicitly preferred contact format is listed as available without inferring lactation needs or communication preferences.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        preferredFormat: { type: "string", maxLength: 8192, minLength: 1 },
        availableFormats: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["preferredFormat", "availableFormats"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { available: { type: "boolean" } },
      required: ["available"],
    },
    ports: {
      inputs: [
        {
          id: "preferredFormat",
          label: "Preferred Format",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "availableFormats",
          label: "Available Formats",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        { id: "available", label: "Available", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = lactationContactPreferredFormatTool.execute;
export default lactationContactPreferredFormatTool;
