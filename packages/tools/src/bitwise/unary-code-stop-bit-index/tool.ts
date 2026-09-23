import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly bits: string };
export type Output = { readonly count: number; readonly consumed: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { bits: { type: "string", maxLength: 8192 } },
  required: ["bits"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { count: { type: "integer" }, consumed: { type: "integer" } },
  required: ["count", "consumed"],
} as const;
/** Calculate unary code stop bit index from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { bits } = input;
  const compute = (): Output => {
    H.domain(/^1*0[01]*(?![\s\S])/.test(bits));
    const count = bits.indexOf("0");
    return { count, consumed: count + 1 };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { bits: "111001" },
  output: { count: 3, consumed: 4 },
} satisfies ToolExample<Input, Output>;
export const unaryCodeStopBitIndexTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bitwise/unary-code-stop-bit-index",
    title: "Unary Code Stop Bit Index Tool",
    description:
      "Calculate unary code stop bit index from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { bits: { type: "string", maxLength: 8192 } },
      required: ["bits"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { count: { type: "integer" }, consumed: { type: "integer" } },
      required: ["count", "consumed"],
    },
    ports: {
      inputs: [
        {
          id: "bits",
          label: "Bits",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "count", label: "Count", valueType: { type: "integer" } },
        { id: "consumed", label: "Consumed", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = unaryCodeStopBitIndexTool.execute;
export default unaryCodeStopBitIndexTool;
