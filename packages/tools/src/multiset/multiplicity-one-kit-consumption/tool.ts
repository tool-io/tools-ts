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
  const canConsume = [...kit].every(
    ([k, v]) => (inv.get(k)?.count ?? 0) >= v.count,
  );
  return H.finish({
    canConsume,
    remaining: canConsume
      ? H.msRows(inv)
          .map((v) => ({
            ...v,
            count: v.count - (kit.get(JSON.stringify(v.value))?.count ?? 0),
          }))
          .filter((v) => v.count > 0)
      : H.msRows(inv),
  });
};
export const example = {
  input: {
    inventoryJson: '[{"value":"a","count":3},{"value":"b","count":1}]',
    kitJson: '[{"value":"a","count":2}]',
  },
  output: {
    result: {
      canConsume: true,
      remaining: [
        { value: "a", count: 1 },
        { value: "b", count: 1 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "multiset/multiplicity-one-kit-consumption",
  title: "Multiset One Kit Consumption",
  description:
    "Apply one all-or-nothing typed kit consumption; insufficient inventory remains unchanged rather than partially consumed.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
