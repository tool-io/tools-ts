import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  varyNames: readonly string[];
  requestHeadersJson: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "varyNames", label: "varyNames", kind: "stringList" },
  { id: "requestHeadersJson", label: "requestHeadersJson", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const names = H.unique(i.varyNames.map((x) => x.toLowerCase()));
  names.forEach((s) => H.check(s === "*" || H.token(s)));
  const r = H.headerPairs(i.requestHeadersJson);
  return H.finish({
    fingerprint: names.includes("*")
      ? null
      : JSON.stringify(
          [...names]
            .sort()
            .map((name) => [
              name,
              r
                .filter((v) => v.name.toLowerCase() === name)
                .map((v) => v.value),
            ]),
        ),
    reusable: names.includes("*") ? false : true,
  });
};
export const example = {
  input: {
    varyNames: ["X-A"],
    requestHeadersJson:
      '[{"name":"X-A","value":"one"},{"name":"x-a","value":"two"},{"name":"Set-Cookie","value":"a=1"}]',
  },
  output: {
    result: { fingerprint: '[["x-a",["one","two"]]]', reusable: true },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cache/vary-request-value-fingerprint",
  title: "Vary Request Value Fingerprint",
  description:
    "Fingerprint explicit Vary request field occurrence arrays, distinguishing absent from empty fields and returning null for Vary star; reusable means no star only, not full cache reuse authorization.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
