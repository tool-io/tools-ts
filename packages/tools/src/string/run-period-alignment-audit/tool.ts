import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ text: string; period: number; origin: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "text", kind: "string", label: "text" },
  { id: "period", kind: "integer", label: "period" },
  { id: "origin", kind: "integer", label: "origin" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.text.length <= 128);
  H.int(i.period, 1, 128);
  H.int(i.origin, -1e9, 1e9);
  const boundaries = i.text
    .split("")
    .flatMap((x, j) => (j > 0 && x !== i.text[j - 1] ? [j] : []));
  return H.finish({
    boundaries,
    unaligned: boundaries.filter((j) => H.mod(j - i.origin, i.period) !== 0),
  });
};
export const example = {
  input: { text: "aabbccc", period: 2, origin: 0 },
  output: { result: { boundaries: [2, 4], unaligned: [] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "string/run-period-alignment-audit",
  title: "Run Period Alignment Audit",
  description:
    "Audit exact code-unit run boundaries against an explicit periodic grid and origin; text length itself is not an additional run boundary.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
