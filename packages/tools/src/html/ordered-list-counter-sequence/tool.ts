import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  itemsJson: string;
  start: number;
  reversed: boolean;
  useDefaultStart: boolean;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "itemsJson", kind: "string", label: "itemsJson" },
  { id: "start", kind: "integer", label: "start" },
  { id: "reversed", kind: "boolean", label: "reversed" },
  { id: "useDefaultStart", kind: "boolean", label: "useDefaultStart" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const rows = H.records(i.itemsJson);
  H.int(i.start, -1e9, 1e9);
  let next = i.useDefaultStart ? (i.reversed ? rows.length : 1) : i.start;
  const step = i.reversed ? -1 : 1;
  const counters = rows.map((r) => {
    if (Object.hasOwn(r, "value")) next = H.int(H.num(r.value), -1e9, 1e9);
    const value = next;
    next += step;
    return value;
  });
  return H.finish({ counters, next });
};
export const example = {
  input: {
    itemsJson: '[{},{"value":7},{},{}]',
    start: 3,
    reversed: true,
    useDefaultStart: false,
  },
  output: { result: { counters: [3, 7, 6, 5], next: 4 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "html/ordered-list-counter-sequence",
  title: "HTML Ordered List Counter Sequence",
  description:
    "Calculate ordered-list counters with explicit start, reversed/default-start policy and per-item integer value overrides; operates on supplied item records, not a DOM tree.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
