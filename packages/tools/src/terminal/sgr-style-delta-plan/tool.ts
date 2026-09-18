import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ fromJson: string; toJson: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "fromJson", label: "fromJson", kind: "string" },
  { id: "toJson", label: "toJson", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  return H.finish({
    parameters: H.sgrDelta(H.styleRecord(i.fromJson), H.styleRecord(i.toJson)),
  });
};
export const example = {
  input: {
    fromJson:
      '{"bold": false, "faint": false, "italic": false, "underline": false, "inverse": false, "strike": false, "foreground": "default", "background": "default"}',
    toJson:
      '{"bold": true, "faint": false, "italic": false, "underline": false, "inverse": false, "strike": false, "foreground": "default", "background": "default"}',
  },
  output: { result: { parameters: [22, 1] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "terminal/sgr-style-delta-plan",
  title: "Terminal SGR Style Delta Plan",
  description:
    "Plan supported SGR style-group deltas between complete explicit records, resetting/reapplying shared intensity group as needed; not guaranteed minimal byte encoding.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
