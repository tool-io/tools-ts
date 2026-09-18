import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  levels: readonly string[];
  order: readonly string[];
  minimum: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "levels", label: "levels", kind: "stringList" },
  { id: "order", label: "order", kind: "stringList" },
  { id: "minimum", label: "minimum", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(H.unique(i.order).length === i.order.length);
  const threshold = i.order.indexOf(i.minimum);
  H.check(threshold >= 0);
  return H.finish({
    selected: i.levels.flatMap((level, index) => {
      const rank = i.order.indexOf(level);
      return rank >= threshold ? [{ index, level }] : [];
    }),
    unknown: i.levels.flatMap((level, index) =>
      i.order.includes(level) ? [] : [{ index, level }],
    ),
  });
};
export const example = {
  input: {
    levels: ["debug", "error", "other"],
    order: ["debug", "info", "error"],
    minimum: "info",
  },
  output: {
    result: {
      selected: [{ index: 1, level: "error" }],
      unknown: [{ index: 2, level: "other" }],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "log/log-level-order-selector",
  title: "Log Level Order Selector",
  description:
    "Select supplied severity tokens at or above an explicit least-to-most ordered level bank; retain unknown tokens instead of assuming rank.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
