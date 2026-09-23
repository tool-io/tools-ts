import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  integer,
  decimal,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly discarded: string; readonly width: number };
export type Output = {
  readonly guard: boolean;
  readonly round: boolean;
  readonly sticky: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    discarded: { type: "string", maxLength: 8192 },
    width: { type: "integer", minimum: 2, maximum: 128 },
  },
  required: ["discarded", "width"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    guard: { type: "boolean" },
    round: { type: "boolean" },
    sticky: { type: "boolean" },
  },
  required: ["guard", "round", "sticky"],
} as const;
/** Compute binary sticky round guard triplet from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { discarded, width } = input;
  const compute = (): Output => {
    integer(width, 2, 128);
    const w = decimal(discarded);
    domain(w >= 0n && w < 1n << BigInt(width));
    return {
      guard: !!(w & (1n << BigInt(width - 1))),
      round: !!(w & (1n << BigInt(width - 2))),
      sticky: !!(w & ((1n << BigInt(width - 2)) - 1n)),
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { discarded: "13", width: 4 },
  output: { guard: true, round: true, sticky: true },
} satisfies ToolExample<Input, Output>;
export const binaryStickyRoundGuardTripletTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "bitwise/binary-sticky-round-guard-triplet",
  title: "Binary Sticky Round Guard Triplet Tool",
  description:
    "Compute binary sticky round guard triplet from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "discarded",
        label: "Discarded",
        required: true,
        valueType: { type: "string" },
      },
      {
        id: "width",
        label: "Width",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      { id: "guard", label: "Guard", valueType: { type: "boolean" } },
      { id: "round", label: "Round", valueType: { type: "boolean" } },
      { id: "sticky", label: "Sticky", valueType: { type: "boolean" } },
    ],
  },
});
export const run = binaryStickyRoundGuardTripletTool.execute;
export default binaryStickyRoundGuardTripletTool;
