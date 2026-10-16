import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  selected: readonly number[];
  multiple: boolean;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "selected", label: "selected", kind: "numberList" },
  { id: "multiple", label: "multiple", kind: "boolean" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.check(i.selected.every((x) => x === 0 || x === 1));
  const on = i.selected.flatMap((x, j) => (x ? [j] : []));
  return H.finish({
    selectedIndexes: i.multiple
      ? on
      : on.length
        ? [on.at(-1)!]
        : i.selected.length
          ? [0]
          : [],
  });
};
export const example = {
  input: { selected: [1, 1, 0], multiple: false },
  output: { result: { selectedIndexes: [1] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["HTML Option Selected State Reconciliation"],
    collections: ["encode-decode"],
    fields: ["html"],
    keywords: [],
  },
  id: "html/option-selected-state-reconciliation",
  title: "HTML Option Selected State Reconciliation",
  description:
    "Reconcile explicit option selected flags for a static single/multiple select; last selected wins in single mode and first defaults, excluding disabled-option and live-dirty-state behavior.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit bounded result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          selectedIndexes: { type: "array", items: { type: "number" } },
        },
        required: ["selectedIndexes"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
