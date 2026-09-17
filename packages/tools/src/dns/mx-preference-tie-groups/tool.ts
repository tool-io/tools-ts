import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ recordsJson: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "recordsJson", kind: "string", label: "recordsJson" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const r = H.records(i.recordsJson).map((v) => ({
    preference: H.int(H.num(v.preference), 0, 65535),
    exchange: H.str(v.exchange),
  }));
  return H.finish({
    groups: H.groups(r, (v) => String(v.preference))
      .sort((a, b) => Number(a.key) - Number(b.key))
      .map((g) => ({
        preference: Number(g.key),
        indexes: g.indexes,
        exchanges: g.indexes.map((j) => r[j].exchange),
      })),
  });
};
export const example = {
  input: {
    recordsJson:
      '[{"preference":20,"exchange":"b"},{"preference":10,"exchange":"a"},{"preference":10,"exchange":"c"}]',
  },
  output: {
    result: {
      groups: [
        { preference: 10, indexes: [1, 2], exchanges: ["a", "c"] },
        { preference: 20, indexes: [0], exchanges: ["b"] },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dns/mx-preference-tie-groups",
  title: "DNS MX Preference Tie Groups",
  description:
    "Group explicit DNS MX records by ascending unsigned preference, retaining equal-preference alternatives and indexes; no resolver ordering, target validation or mail delivery claim.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
