import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly octet: number };
export type Output = {
  readonly mode: string;
  readonly followingOctets: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { octet: { type: "integer", minimum: 0, maximum: 254 } },
  required: ["octet"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    mode: { type: "string", maxLength: 8192 },
    followingOctets: { type: "integer" },
  },
  required: ["mode", "followingOctets"],
} as const;
/** Classify one BER length octet, rejecting the reserved 0xff value. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { octet } = input;
  const compute = (): Output => {
    H.integer(octet, 0, 254);
    return {
      mode: octet < 128 ? "short" : octet === 128 ? "indefinite" : "long",
      followingOctets: octet < 129 ? 0 : octet - 128,
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { octet: 130 },
  output: { mode: "long", followingOctets: 2 },
} satisfies ToolExample<Input, Output>;
export const berLengthShortLongDiscriminatorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "decode/ber-length-short-long-discriminator",
    title: "BER Length Short Long Discriminator Tool",
    description:
      "Classify one BER length octet, rejecting the reserved 0xff value.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { octet: { type: "integer", minimum: 0, maximum: 254 } },
      required: ["octet"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        mode: { type: "string", maxLength: 8192 },
        followingOctets: { type: "integer" },
      },
      required: ["mode", "followingOctets"],
    },
    ports: {
      inputs: [
        {
          id: "octet",
          label: "Octet",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "mode", label: "Mode", valueType: { type: "string" } },
        {
          id: "followingOctets",
          label: "Following Octets",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = berLengthShortLongDiscriminatorTool.execute;
export default berLengthShortLongDiscriminatorTool;
