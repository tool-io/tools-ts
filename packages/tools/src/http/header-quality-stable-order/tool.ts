import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ qualitiesJson: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "qualitiesJson", label: "qualitiesJson", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  return H.finish({
    qualities: H.qualities(i.qualitiesJson)
      .map((v, index) => ({ ...v, index }))
      .sort((a, b) => b.q - a.q || a.index - b.index),
  });
};
export const example = {
  input: {
    qualitiesJson:
      '[{"token":"a","q":0},{"token":"b","q":0.5},{"token":"c","q":1}]',
  },
  output: {
    result: {
      qualities: [
        { token: "c", q: 1, index: 2 },
        { token: "b", q: 0.5, index: 1 },
        { token: "a", q: 0, index: 0 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "http/header-quality-stable-order",
  title: "HTTP Quality Stable Order",
  description:
    "Stable descending explicit HTTP quality ordering with original indexes and zero-quality entries retained; not full Accept specificity negotiation.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
