import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  current: string;
  writtenOnes: string;
  clearableMask: string;
  width: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "current", label: "Current", kind: "string" },
  { id: "writtenOnes", label: "Written ones", kind: "string" },
  { id: "clearableMask", label: "Clearable mask", kind: "string" },
  { id: "width", label: "Width", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const current = H.word(i.current, i.width),
    written = H.word(i.writtenOnes, i.width),
    clearable = H.word(i.clearableMask, i.width),
    all = 2n ** BigInt(i.width) - 1n;
  return H.finish({
    next: String(current & (~(written & clearable) & all)),
    clearedMask: String(current & written & clearable),
  });
};
export const example = {
  input: { current: "255", writtenOnes: "15", clearableMask: "5", width: 8 },
  output: { result: { next: "250", clearedMask: "5" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "microcontroller/register-write-clear-effect",
  title: "Microcontroller: Register Write Clear Effect Tool",
  description:
    "Simulate one write-one-to-clear register operation over an explicit clearable mask, leaving other bits unchanged; pure data calculation, not hardware I/O.",
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
          clearedMask: { type: "string" },
          next: { type: "string" },
        },
        required: ["clearedMask", "next"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
