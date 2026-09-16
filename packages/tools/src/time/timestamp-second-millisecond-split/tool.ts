import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ milliseconds: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "milliseconds", kind: "string", label: "milliseconds" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const t = H.bigint(i.milliseconds),
    s = H.floor(t, 1000n);
  return H.finish({ seconds: String(s), millisecond: Number(t - s * 1000n) });
};
export const example = {
  input: { milliseconds: "-1" },
  output: { result: { seconds: "-1", millisecond: 999 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "time/timestamp-second-millisecond-split",
  title: "Timestamp Second Millisecond Split",
  description:
    "Split an exact signed epoch millisecond integer into floor seconds and a nonnegative millisecond component.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
