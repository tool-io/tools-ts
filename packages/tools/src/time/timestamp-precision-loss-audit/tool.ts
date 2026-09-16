import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ timestamp: string; quantum: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "timestamp", kind: "string", label: "timestamp" },
  { id: "quantum", kind: "string", label: "quantum" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const t = H.bigint(i.timestamp),
    q = H.bigint(i.quantum);
  H.check(q > 0n);
  const rounded = H.floor(t, q) * q;
  return H.finish({
    truncatedTimestamp: String(rounded),
    lostUnits: String(t - rounded),
    loss: t !== rounded,
  });
};
export const example = {
  input: { timestamp: "-1", quantum: "1000" },
  output: {
    result: { truncatedTimestamp: "-1000", lostUnits: "999", loss: true },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "time/timestamp-precision-loss-audit",
  title: "Timestamp Precision Loss Audit",
  description:
    "Audit exact integer timestamp precision loss when flooring to a positive unit quantum, retaining signed-era behavior.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
