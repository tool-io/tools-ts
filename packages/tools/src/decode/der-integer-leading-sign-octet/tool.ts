import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly bytes: readonly number[] };
export type Output = {
  readonly negative: boolean;
  readonly redundantPrefix: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bytes: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["bytes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    negative: { type: "boolean" },
    redundantPrefix: { type: "boolean" },
  },
  required: ["negative", "redundantPrefix"],
} as const;
/** Compute der integer leading sign octet from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { bytes } = input;
  const compute = (): Output => {
    domain(bytes.length > 0 && bytes.every((x) => x >= 0 && x <= 255));
    const negative = !!(bytes[0] & 128),
      redundantPrefix =
        bytes.length > 1 &&
        ((bytes[0] === 0 && (bytes[1] & 128) === 0) ||
          (bytes[0] === 255 && (bytes[1] & 128) !== 0));
    return { negative, redundantPrefix };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { bytes: [0, 128] },
  output: { negative: false, redundantPrefix: false },
} satisfies ToolExample<Input, Output>;
export const derIntegerLeadingSignOctetTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "decode/der-integer-leading-sign-octet",
  title: "DER Integer Leading Sign Octet Tool",
  description:
    "Compute der integer leading sign octet from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "bytes",
        label: "Bytes",
        required: true,
        valueType: { type: "list", items: { type: "integer" } },
      },
    ],
    outputs: [
      { id: "negative", label: "Negative", valueType: { type: "boolean" } },
      {
        id: "redundantPrefix",
        label: "Redundant Prefix",
        valueType: { type: "boolean" },
      },
    ],
  },
});
export const run = derIntegerLeadingSignOctetTool.execute;
export default derIntegerLeadingSignOctetTool;
