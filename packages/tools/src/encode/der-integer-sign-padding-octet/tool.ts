import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly unsignedBytes: readonly number[] };
export type Output = {
  readonly bytes: readonly number[];
  readonly added: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unsignedBytes: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["unsignedBytes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bytes: { type: "array", maxItems: 256, items: { type: "integer" } },
    added: { type: "boolean" },
  },
  required: ["bytes", "added"],
} as const;
/** Compute der integer sign padding octet from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { unsignedBytes } = input;
  const compute = (): Output => {
    domain(
      unsignedBytes.length > 0 &&
        unsignedBytes.every((x) => x >= 0 && x <= 255),
    );
    const first = unsignedBytes.findIndex((x) => x !== 0),
      b = first < 0 ? [0] : unsignedBytes.slice(first),
      added: boolean = (b[0] & 128) !== 0;
    return { bytes: added ? [0, ...b] : [...b], added };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { unsignedBytes: [128] },
  output: { bytes: [0, 128], added: true },
} satisfies ToolExample<Input, Output>;
export const derIntegerSignPaddingOctetTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "encode/der-integer-sign-padding-octet",
  title: "DER Integer Sign Padding Octet Tool",
  description:
    "Compute der integer sign padding octet from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "unsignedBytes",
        label: "Unsigned Bytes",
        required: true,
        valueType: { type: "list", items: { type: "integer" } },
      },
    ],
    outputs: [
      {
        id: "bytes",
        label: "Bytes",
        valueType: { type: "list", items: { type: "integer" } },
      },
      { id: "added", label: "Added", valueType: { type: "boolean" } },
    ],
  },
});
export const run = derIntegerSignPaddingOctetTool.execute;
export default derIntegerSignPaddingOctetTool;
