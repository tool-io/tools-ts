import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ ranges: readonly string[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "ranges", label: "ranges", kind: "stringList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const r = i.ranges.map(H.media);
  r.forEach((v) => {
    H.check(v.type !== "*" || v.subtype === "*");
    H.check(!v.type.includes("*") || v.type === "*");
    H.check(!v.subtype.includes("*") || v.subtype === "*");
  });
  return H.finish({
    ranges: r
      .map((v, index) => ({
        range: i.ranges[index],
        index,
        specificity: v.type === "*" ? 0 : v.subtype === "*" ? 1 : 2,
      }))
      .sort((a, b) => b.specificity - a.specificity || a.index - b.index),
  });
};
export const example = {
  input: { ranges: ["*/*", "text/*", "text/html"] },
  output: {
    result: {
      ranges: [
        { range: "text/html", index: 2, specificity: 2 },
        { range: "text/*", index: 1, specificity: 1 },
        { range: "*/*", index: 0, specificity: 0 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mime/media-type-offer-specificity-order",
  title: "Media Type Offer Specificity Order",
  description:
    "Stable-order bare MIME ranges by exact/type-wildcard/all-wildcard specificity only; excludes qualities, parameters and offer preference.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
