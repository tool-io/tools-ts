import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ inventoryJson: string; kitJson: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "inventoryJson", kind: "string", label: "inventoryJson" },
  { id: "kitJson", kind: "string", label: "kitJson" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const inv = H.multiset(i.inventoryJson),
    kit = H.multiset(i.kitJson);
  H.check(kit.size > 0);
  return H.finish({
    kits: Math.min(
      ...[...kit].map(([k, v]) =>
        Math.floor((inv.get(k)?.count ?? 0) / v.count),
      ),
    ),
  });
};
export const example = {
  input: {
    inventoryJson: '[{"value":"a","count":3},{"value":"b","count":1}]',
    kitJson: '[{"value":"a","count":2},{"value":"b","count":1}]',
  },
  output: { result: { kits: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "multiset/multiplicity-complete-kit-count",
  title: "Multiset Complete Kit Count",
  description:
    "Count complete typed kits consumable from an explicit inventory using the limiting required multiplicity; empty kit requirements are rejected.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
