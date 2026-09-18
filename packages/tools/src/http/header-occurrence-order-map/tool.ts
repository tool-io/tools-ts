import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ headersJson: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "headersJson", label: "headersJson", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const r = H.headerPairs(i.headersJson);
  return H.finish({
    canonicalOrder: r
      .map((_, index) => index)
      .sort((a, b) =>
        r[a].name.toLowerCase() < r[b].name.toLowerCase()
          ? -1
          : r[a].name.toLowerCase() > r[b].name.toLowerCase()
            ? 1
            : a - b,
      ),
    occurrenceOrdinals: r.map(
      (v, j) =>
        r
          .slice(0, j)
          .filter((x) => x.name.toLowerCase() === v.name.toLowerCase()).length,
    ),
  });
};
export const example = {
  input: {
    headersJson:
      '[{"name":"X-A","value":"one"},{"name":"x-a","value":"two"},{"name":"Set-Cookie","value":"a=1"}]',
  },
  output: {
    result: { canonicalOrder: [2, 0, 1], occurrenceOrdinals: [0, 1, 0] },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "http/header-occurrence-order-map",
  title: "HTTP Header Occurrence Order Map",
  description:
    "Map explicit field occurrences to stable canonical-name ordering and within-name ordinals without serializing or reordering a request.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
