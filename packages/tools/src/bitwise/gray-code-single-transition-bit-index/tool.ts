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
export type Input = {
  readonly left: string;
  readonly right: string;
  readonly width: number;
};
export type Output = {
  readonly singleTransition: boolean;
  readonly bitIndex: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    left: { type: "string", maxLength: 8192 },
    right: { type: "string", maxLength: 8192 },
    width: { type: "integer", minimum: 1, maximum: 128 },
  },
  required: ["left", "right", "width"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    singleTransition: { type: "boolean" },
    bitIndex: { type: "integer" },
  },
  required: ["singleTransition", "bitIndex"],
} as const;
/** Compute gray code single transition bit index from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { left, right, width } = input;
  const compute = (): Output => {
    integer(width, 1, 128);
    const a = decimal(left),
      b = decimal(right),
      limit = 1n << BigInt(width);
    domain(a >= 0n && a < limit && b >= 0n && b < limit);
    const x = a ^ b,
      singleTransition = x !== 0n && (x & (x - 1n)) === 0n;
    return {
      singleTransition,
      bitIndex: singleTransition ? x.toString(2).length - 1 : -1,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { left: "3", right: "2", width: 4 },
  output: { singleTransition: true, bitIndex: 0 },
} satisfies ToolExample<Input, Output>;
export const grayCodeSingleTransitionBitIndexTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "bitwise/gray-code-single-transition-bit-index",
  title: "Gray Code Single Transition Bit Index Tool",
  description:
    "Compute gray code single transition bit index from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "left",
        label: "Left",
        required: true,
        valueType: { type: "string" },
      },
      {
        id: "right",
        label: "Right",
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
      {
        id: "singleTransition",
        label: "Single Transition",
        valueType: { type: "boolean" },
      },
      { id: "bitIndex", label: "Bit Index", valueType: { type: "integer" } },
    ],
  },
});
export const run = grayCodeSingleTransitionBitIndexTool.execute;
export default grayCodeSingleTransitionBitIndexTool;
