import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ seconds: number; offset: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "seconds", kind: "integer", label: "seconds" },
  { id: "offset", kind: "integer", label: "offset" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.clock(i.seconds);
  H.int(i.offset, -1e9, 1e9);
  const total = i.seconds + i.offset;
  return H.finish({
    seconds: H.mod(total, 86400),
    dayCarry: Math.floor(total / 86400),
  });
};
export const example = {
  input: { seconds: 10, offset: -20 },
  output: { result: { seconds: 86390, dayCarry: -1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "time/clock-offset-with-day-carry",
  title: "Clock Offset with Day Carry",
  description:
    "Offset civil seconds of day and retain signed day carry; no time-zone transitions or date interpretation.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
