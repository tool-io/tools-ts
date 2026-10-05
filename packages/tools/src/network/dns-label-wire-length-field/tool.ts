import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly label: string };
export type Output = { readonly lengthOctet: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { lengthOctet: { type: "integer" } },
  required: ["lengthOctet"],
} as const;
/** Return an uncompressed DNS label length octet for an explicit ASCII octet string, including the empty root label. This is not IDNA or hostname validation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { label } = request;
  const compute = (): Output => {
    H.domain(
      /^[\x00-\x7f]*(?![\s\S])/.test(label) && label.length <= 63,
      "label",
    );
    return { lengthOctet: label.length };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { label: "example" },
  output: { lengthOctet: 7 },
} satisfies ToolExample<Input, Output>;
export const dnsLabelWireLengthFieldTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "network/dns-label-wire-length-field",
    title: "DNS Label Wire Length Field Tool",
    description:
      "Return an uncompressed DNS label length octet for an explicit ASCII octet string, including the empty root label. This is not IDNA or hostname validation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { lengthOctet: { type: "integer" } },
      required: ["lengthOctet"],
    },
    ports: {
      inputs: [
        {
          id: "label",
          label: "Label",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "lengthOctet",
          label: "Length Octet",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = dnsLabelWireLengthFieldTool.execute;
export default dnsLabelWireLengthFieldTool;
