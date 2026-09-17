import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  candidateTags: readonly string[];
  target: string;
  weak: boolean;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "candidateTags", label: "candidateTags", kind: "stringList" },
  { id: "target", label: "target", kind: "string" },
  { id: "weak", label: "weak", kind: "boolean" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const r = i.candidateTags.map(H.tag),
    t = H.tag(i.target);
  return H.finish({
    indexes: r.flatMap((v, j) =>
      v.opaqueValue === t.opaqueValue && (i.weak || (!v.weak && !t.weak))
        ? [j]
        : [],
    ),
  });
};
export const example = {
  input: { candidateTags: ['W/"a"', '"a"', '"b"'], target: '"a"', weak: false },
  output: { result: { indexes: [1] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cache/etag-candidate-match-indexes",
  title: "Entity Tag Candidate Match Indexes",
  description:
    "Return all entity-tag comparison candidate indexes under an explicit weak/strong rule, retaining ties and rejecting malformed tags; not If-Match/If-None-Match wildcard evaluation.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
