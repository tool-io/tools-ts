import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  directivesJson: string;
  knownNames: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "directivesJson", label: "directivesJson", kind: "string" },
  { id: "knownNames", label: "knownNames", kind: "stringList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const r = H.directives(i.directivesJson);
  i.knownNames.forEach((s) => H.check(H.token(s)));
  return H.finish({
    extensions: r.flatMap((v, index) =>
      i.knownNames.map((x) => x.toLowerCase()).includes(v.name)
        ? []
        : [{ ...v, index }],
    ),
  });
};
export const example = {
  input: {
    directivesJson:
      '[{"name":"max-age","value":"5"},{"name":"custom","value":null}]',
    knownNames: ["max-age"],
  },
  output: {
    result: { extensions: [{ name: "custom", value: null, index: 1 }] },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cache/directive-extension-inventory",
  title: "Cache Directive Extension Inventory",
  description:
    "Inventory explicit cache directive names outside a caller-provided known-name bank; no hardcoded current registry or automatic extension semantics.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
