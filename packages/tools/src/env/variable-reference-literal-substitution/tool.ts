import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ text: string; assignmentsJson: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "text", label: "text", kind: "string" },
  { id: "assignmentsJson", label: "assignmentsJson", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const rows = H.assignments(i.assignmentsJson),
    map = new Map(rows.map((v) => [v.name, v.value])),
    refs = H.envRefs(i.text);
  let text = "",
    p = 0;
  for (const r of refs) {
    text +=
      i.text.slice(p, r.start) +
      (map.get(r.name) ?? i.text.slice(r.start, r.end));
    p = r.end;
  }
  text += i.text.slice(p);
  return H.finish({
    text,
    unknown: H.unique(refs.filter((v) => !map.has(v.name)).map((v) => v.name)),
  });
};
export const example = {
  input: { text: "$A ${B}", assignmentsJson: '[{"name":"A","value":"$B"}]' },
  output: { result: { text: "$B ${B}", unknown: ["B"] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "env/variable-reference-literal-substitution",
  title: "Environment Literal Reference Substitution",
  description:
    "Substitute simple literal environment references once using explicit last-wins values, preserve unknown references and do not recursively expand inserted dollar text.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
