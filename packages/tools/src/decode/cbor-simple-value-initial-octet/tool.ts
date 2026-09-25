import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly octet: number };
export type Output = {
  readonly simpleValue: number;
  readonly followingByte: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { octet: { type: "integer", minimum: 224, maximum: 248 } },
  required: ["octet"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    simpleValue: { type: "integer" },
    followingByte: { type: "boolean" },
  },
  required: ["simpleValue", "followingByte"],
} as const;
/** Classify CBOR major-type-seven simple-value initial octets; 0xf8 requires the next byte. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { octet } = input;
  const compute = (): Output => {
    H.integer(octet, 224, 248);
    H.domain(octet !== 247 || true);
    return {
      simpleValue: octet === 248 ? -1 : octet - 224,
      followingByte: octet === 248,
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { octet: 245 },
  output: { simpleValue: 21, followingByte: false },
} satisfies ToolExample<Input, Output>;
export const cborSimpleValueInitialOctetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "decode/cbor-simple-value-initial-octet",
    title: "CBOR Simple Value Initial Octet Tool",
    description:
      "Classify CBOR major-type-seven simple-value initial octets; 0xf8 requires the next byte.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { octet: { type: "integer", minimum: 224, maximum: 248 } },
      required: ["octet"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        simpleValue: { type: "integer" },
        followingByte: { type: "boolean" },
      },
      required: ["simpleValue", "followingByte"],
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
        {
          id: "simpleValue",
          label: "Simple Value",
          valueType: { type: "integer" },
        },
        {
          id: "followingByte",
          label: "Following Byte",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = cborSimpleValueInitialOctetTool.execute;
export default cborSimpleValueInitialOctetTool;
