import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly octet: number };
export type Output = {
  readonly tagClass: number;
  readonly constructed: boolean;
  readonly tagNumber: number;
  readonly highTagNumber: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { octet: { type: "integer", minimum: 0, maximum: 255 } },
  required: ["octet"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tagClass: { type: "integer" },
    constructed: { type: "boolean" },
    tagNumber: { type: "integer" },
    highTagNumber: { type: "boolean" },
  },
  required: ["tagClass", "constructed", "tagNumber", "highTagNumber"],
} as const;
/** Compute ber tag first octet fields from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { octet } = input;
  const compute = (): Output => {
    integer(octet, 0, 255);
    return {
      tagClass: octet >> 6,
      constructed: !!(octet & 32),
      tagNumber: octet & 31,
      highTagNumber: (octet & 31) === 31,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { octet: 48 },
  output: {
    tagClass: 0,
    constructed: true,
    tagNumber: 16,
    highTagNumber: false,
  },
} satisfies ToolExample<Input, Output>;
export const berTagFirstOctetFieldsTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "decode/ber-tag-first-octet-fields",
  title: "BER Tag First Octet Fields Tool",
  description:
    "Compute ber tag first octet fields from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
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
      { id: "tagClass", label: "Tag Class", valueType: { type: "integer" } },
      {
        id: "constructed",
        label: "Constructed",
        valueType: { type: "boolean" },
      },
      { id: "tagNumber", label: "Tag Number", valueType: { type: "integer" } },
      {
        id: "highTagNumber",
        label: "High Tag Number",
        valueType: { type: "boolean" },
      },
    ],
  },
});
export const run = berTagFirstOctetFieldsTool.execute;
export default berTagFirstOctetFieldsTool;
