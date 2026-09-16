import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ seconds: string; millisecond: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "seconds", kind: "string", label: "seconds" },
  { id: "millisecond", kind: "integer", label: "millisecond" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.millisecond, 0, 999);
  return H.finish({
    milliseconds: String(H.bigint(i.seconds) * 1000n + BigInt(i.millisecond)),
  });
};
export const example = {
  input: { seconds: "-1", millisecond: 999 },
  output: { result: { milliseconds: "-1" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "time/timestamp-millisecond-component-join",
  title: "Timestamp Millisecond Component Join",
  description:
    "Join exact signed epoch second text and a 0\u2013999 millisecond component without unsafe numeric conversion.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
