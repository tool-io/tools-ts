import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ milliseconds: number; comma: boolean }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "milliseconds", kind: "integer", label: "milliseconds" },
  { id: "comma", kind: "boolean", label: "comma" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.milliseconds, 0, 1e12);
  const h = Math.floor(i.milliseconds / 3600000),
    m = Math.floor(i.milliseconds / 60000) % 60,
    s = Math.floor(i.milliseconds / 1000) % 60,
    ms = i.milliseconds % 1000;
  return H.finish({
    timestamp:
      String(h).padStart(2, "0") +
      ":" +
      String(m).padStart(2, "0") +
      ":" +
      String(s).padStart(2, "0") +
      (i.comma ? "," : ".") +
      String(ms).padStart(3, "0"),
  });
};
export const example = {
  input: { milliseconds: 3723004, comma: true },
  output: { result: { timestamp: "01:02:03,004" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "caption/cue-timestamp-millisecond-formatter",
  title: "Caption Cue Timestamp Millisecond Formatter",
  description:
    "Format nonnegative integer caption milliseconds with a caller-selected decimal separator; no frame-rate or cue-file serialization.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
