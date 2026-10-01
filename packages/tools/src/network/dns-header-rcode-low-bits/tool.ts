import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly flags: number };
export type Output = { readonly rcode: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { flags: { type: "integer", minimum: 0, maximum: 65535 } },
  required: ["flags"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { rcode: { type: "integer" } },
  required: ["rcode"],
} as const;
/** Calculate dns header rcode low bits from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { flags } = request;
  const compute = (): Output => {
    H.integer(flags, 0, 65535);
    return { rcode: flags & 15 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { flags: 33155 },
  output: { rcode: 3 },
} satisfies ToolExample<Input, Output>;
export const dnsHeaderRcodeLowBitsTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "network/dns-header-rcode-low-bits",
    title: "DNS Header Rcode Low Bits Tool",
    description:
      "Calculate dns header rcode low bits from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { flags: { type: "integer", minimum: 0, maximum: 65535 } },
      required: ["flags"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { rcode: { type: "integer" } },
      required: ["rcode"],
    },
    ports: {
      inputs: [
        {
          id: "flags",
          label: "Flags",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "rcode", label: "Rcode", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = dnsHeaderRcodeLowBitsTool.execute;
export default dnsHeaderRcodeLowBitsTool;
