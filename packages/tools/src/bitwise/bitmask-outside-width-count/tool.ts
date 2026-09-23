import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly mask: number; readonly width: number };
export type Output = {
  readonly outsideBits: number;
  readonly insideBits: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    mask: { type: "integer", minimum: 0 },
    width: { type: "integer", minimum: 0, maximum: 53 },
  },
  required: ["mask", "width"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    outsideBits: { type: "integer" },
    insideBits: { type: "integer" },
  },
  required: ["outsideBits", "insideBits"],
} as const;
/** Calculate bitmask outside width count from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { mask, width } = request;
  const compute = (): Output => {
    H.integer(mask, 0);
    H.integer(width, 0, 53);
    const n = BigInt(mask),
      count = (x: bigint) => {
        let k = 0;
        while (x) {
          k += Number(x & 1n);
          x >>= 1n;
        }
        return k;
      };
    return {
      outsideBits: count(n >> BigInt(width)),
      insideBits: count(n & ((1n << BigInt(width)) - 1n)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { mask: 45, width: 4 },
  output: { outsideBits: 1, insideBits: 3 },
} satisfies ToolExample<Input, Output>;
export const bitmaskOutsideWidthCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bitwise/bitmask-outside-width-count",
    title: "Bitmask Outside Width Count Tool",
    description:
      "Calculate bitmask outside width count from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        mask: { type: "integer", minimum: 0 },
        width: { type: "integer", minimum: 0, maximum: 53 },
      },
      required: ["mask", "width"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        outsideBits: { type: "integer" },
        insideBits: { type: "integer" },
      },
      required: ["outsideBits", "insideBits"],
    },
    ports: {
      inputs: [
        {
          id: "mask",
          label: "Mask",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "width",
          label: "Width",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "outsideBits",
          label: "Outside Bits",
          valueType: { type: "integer" },
        },
        {
          id: "insideBits",
          label: "Inside Bits",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = bitmaskOutsideWidthCountTool.execute;
export default bitmaskOutsideWidthCountTool;
