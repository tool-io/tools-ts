import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ token: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "token", kind: "string", label: "token" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const m = /^([+-]?(?:\d+(?:\.\d*)?|\.\d+))(ms|s|min|h|d)(?![\s\S])/.exec(
    i.token,
  );
  H.check(m);
  const unit = m![2],
    value = H.numericToken(m![1]);
  const factors: Record<string, number> = {
    ms: 0.001,
    s: 1,
    min: 60,
    h: 3600,
    d: 86400,
  };
  return H.finish({ value, unit, seconds: value * factors[unit] });
};
export const example = {
  input: { token: "-1.5min" },
  output: { result: { value: -1.5, unit: "min", seconds: -90 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "parse/signed-duration-unit-token",
  title: "Signed Duration Unit Token Parser",
  description:
    "Parse a strict signed duration token with explicit ms,s,min,h,d suffix; d is exactly 86400 seconds, not a calendar-day interval.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
