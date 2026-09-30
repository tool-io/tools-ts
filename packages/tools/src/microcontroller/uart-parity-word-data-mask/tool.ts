import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  word: string;
  dataBits: number;
  parityPresent: boolean;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "word", label: "Word", kind: "string" },
  { id: "dataBits", label: "Data bits", kind: "integer" },
  { id: "parityPresent", label: "Parity present", kind: "boolean" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.dataBits, 5, 9);
  const x = H.word(i.word, i.dataBits + (i.parityPresent ? 1 : 0));
  return H.finish({
    dataWord: String(x & (2n ** BigInt(i.dataBits) - 1n)),
    parityBit: i.parityPresent ? Number(x >> BigInt(i.dataBits)) : -1,
  });
};
export const example = {
  input: { word: "257", dataBits: 8, parityPresent: true },
  output: { result: { dataWord: "1", parityBit: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "microcontroller/uart-parity-word-data-mask",
  title: "Microcontroller: Uart Parity Word Data Mask Tool",
  description:
    "Extract UART data and an optional adjacent parity bit from an explicitly packed word, without asserting parity correctness or parsing start/stop bits.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          dataWord: { type: "string" },
          parityBit: { type: "number" },
        },
        required: ["dataWord", "parityBit"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
