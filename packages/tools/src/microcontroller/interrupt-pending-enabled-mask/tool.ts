import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  pending: string;
  enabled: string;
  width: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "pending", label: "Pending", kind: "string" },
  { id: "enabled", label: "Enabled", kind: "string" },
  { id: "width", label: "Width", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const a = H.word(i.pending, i.width),
    b = H.word(i.enabled, i.width),
    all = 2n ** BigInt(i.width) - 1n;
  return H.finish({
    actionableMask: String(a & b),
    maskedPendingMask: String(a & (~b & all)),
  });
};
export const example = {
  input: { pending: "15", enabled: "5", width: 8 },
  output: { result: { actionableMask: "5", maskedPendingMask: "10" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "microcontroller/interrupt-pending-enabled-mask",
  title: "Microcontroller: Interrupt Pending Enabled Mask Tool",
  description:
    "Partition pending interrupt bits by an explicit enable mask at fixed width, without acknowledging or reading hardware interrupts.",
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
          actionableMask: { type: "string" },
          maskedPendingMask: { type: "string" },
        },
        required: ["actionableMask", "maskedPendingMask"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
