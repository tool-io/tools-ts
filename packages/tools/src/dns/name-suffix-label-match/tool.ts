import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ nameJson: string; suffixJson: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "nameJson", kind: "string", label: "nameJson" },
  { id: "suffixJson", kind: "string", label: "suffixJson" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  return H.finish({
    matches: H.suffixLabels(H.dnsLabels(i.nameJson), H.dnsLabels(i.suffixJson)),
  });
};
export const example = {
  input: { nameJson: "[[65],[98]]", suffixJson: "[[66]]" },
  output: { result: { matches: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dns/name-suffix-label-match",
  title: "DNS Name Suffix Label Match",
  description:
    "Check DNS suffix membership by complete labels with ASCII case-insensitive octet comparison; avoids misleading textual substring suffix matches.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
