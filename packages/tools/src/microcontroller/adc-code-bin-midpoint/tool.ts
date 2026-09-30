import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  code: number;
  bits: number;
  referenceVoltage: number;
  coding: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "code", label: "Code", kind: "integer" },
  { id: "bits", label: "Bits", kind: "integer" },
  { id: "referenceVoltage", label: "Reference voltage", kind: "number" },
  {
    id: "coding",
    label: "Coding",
    kind: "string",
    enum: ["unipolar", "twos-complement-bipolar"],
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.bits, 1, 24);
  H.positive(i.referenceVoltage);
  H.choice(i.coding, ["unipolar", "twos-complement-bipolar"]);
  const count = 2 ** i.bits;
  H.int(
    i.code,
    i.coding === "unipolar" ? 0 : -count / 2,
    i.coding === "unipolar" ? count - 1 : count / 2 - 1,
  );
  const step = ((i.coding === "unipolar" ? 1 : 2) * i.referenceVoltage) / count;
  return H.finish({
    midpointVoltage:
      i.coding === "unipolar" ? (i.code + 0.5) * step : (i.code + 0.5) * step,
    binWidthVoltage: step,
  });
};
export const example = {
  input: { code: 0, bits: 3, referenceVoltage: 8, coding: "unipolar" },
  output: { result: { midpointVoltage: 0.5, binWidthVoltage: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "microcontroller/adc-code-bin-midpoint",
  title: "Microcontroller: ADC Code Bin Midpoint Tool",
  description:
    "Return an ideal half-open ADC quantization-bin midpoint for explicitly declared unipolar or signed two-complement codes; references span 0..Vref or -Vref..Vref.",
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
          binWidthVoltage: { type: "number" },
          midpointVoltage: { type: "number" },
        },
        required: ["binWidthVoltage", "midpointVoltage"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
