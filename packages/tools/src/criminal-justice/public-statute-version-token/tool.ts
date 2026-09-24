import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly reference: string; readonly separator: string };
export type Output = { readonly statute: string; readonly version: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reference: { type: "string", maxLength: 8192 },
    separator: { type: "string", maxLength: 8192 },
  },
  required: ["reference", "separator"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    statute: { type: "string", maxLength: 8192 },
    version: { type: "string", maxLength: 8192 },
  },
  required: ["statute", "version"],
} as const;
/** Split an opaque supplied public statute/version reference without checking current law. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reference, separator } = request;
  const compute = (): Output => {
    H.domain(separator.length > 0);
    const i = reference.lastIndexOf(separator);
    H.domain(i > 0 && i + separator.length < reference.length);
    return {
      statute: reference.slice(0, i),
      version: reference.slice(i + separator.length),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { reference: "code/section@2024", separator: "@" },
  output: { statute: "code/section", version: "2024" },
} satisfies ToolExample<Input, Output>;
export const publicStatuteVersionTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "criminal-justice/public-statute-version-token",
    title: "Public Statute Version Token Tool",
    description:
      "Split an opaque supplied public statute/version reference without checking current law.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reference: { type: "string", maxLength: 8192 },
        separator: { type: "string", maxLength: 8192 },
      },
      required: ["reference", "separator"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        statute: { type: "string", maxLength: 8192 },
        version: { type: "string", maxLength: 8192 },
      },
      required: ["statute", "version"],
    },
    ports: {
      inputs: [
        {
          id: "reference",
          label: "Reference",
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
        { id: "statute", label: "Statute", valueType: { type: "string" } },
        { id: "version", label: "Version", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = publicStatuteVersionTokenTool.execute;
export default publicStatuteVersionTokenTool;
