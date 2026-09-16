import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ timestamp: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "timestamp", kind: "string", label: "timestamp" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const m = /^(\d{2,6}):([0-5]\d):([0-5]\d)[.,](\d{3})(?![\s\S])/.exec(
    i.timestamp,
  );
  H.check(m);
  return H.finish({
    milliseconds:
      Number(m![1]) * 3600000 +
      Number(m![2]) * 60000 +
      Number(m![3]) * 1000 +
      Number(m![4]),
  });
};
export const example = {
  input: { timestamp: "01:02:03,004" },
  output: { result: { milliseconds: 3723004 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "caption/cue-timestamp-millisecond-parser",
  title: "Caption Cue Timestamp Millisecond Parser",
  description:
    "Parse a strict caption HH:MM:SS.mmm or comma timestamp into integer milliseconds; hours may exceed 23, no sign or frame notation.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
