import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ bytes: readonly number[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "bytes", label: "bytes", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.bytes(i.bytes);
  let p = 0,
    status = 0;
  const r: { status: number; data: number[] }[] = [];
  while (p < i.bytes.length) {
    if (i.bytes[p] >= 128) {
      status = i.bytes[p++];
      H.midiCount(status);
    }
    H.check(status !== 0);
    const n = H.midiCount(status),
      data = i.bytes.slice(p, p + n);
    H.check(data.length === n && data.every((x) => x < 128));
    r.push({ status, data });
    p += n;
  }
  return H.finish({ messages: r });
};
export const example = {
  input: { bytes: [144, 60, 100, 62, 0] },
  output: {
    result: {
      messages: [
        { status: 144, data: [60, 100] },
        { status: 144, data: [62, 0] },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "midi/running-status-token-expander",
  title: "MIDI Running Status Token Expander",
  description:
    "Expand channel-only MIDI running status into complete message records; incomplete data, system messages and realtime interleaving are rejected.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
