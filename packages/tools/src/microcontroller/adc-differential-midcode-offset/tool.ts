import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ offsetBinaryCode: number; bits: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "offsetBinaryCode", label: "Offset binary code", kind: "integer" },
  { id: "bits", label: "Bits", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.bits, 1, 24);
  H.int(i.offsetBinaryCode, 0, 2 ** i.bits - 1);
  return H.finish({ signedCode: i.offsetBinaryCode - 2 ** (i.bits - 1) });
};
export const example = {
  input: { offsetBinaryCode: 128, bits: 8 },
  output: { result: { signedCode: 0 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "microcontroller/adc-differential-midcode-offset",
  title: "Microcontroller: ADC Differential Midcode Offset Tool",
  description:
    "Crosswalk an explicitly offset-binary differential ADC code to its signed midcode-relative integer; no voltage calibration or device encoding inference.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { signedCode: { type: "number" } },
        required: ["signedCode"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
