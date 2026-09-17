import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ name: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "name", kind: "string", label: "name" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  return H.finish(H.dnsTextParse(i.name));
};
export const example = {
  input: { name: "a\\046b.example." },
  output: {
    result: {
      labels: [
        [97, 46, 98],
        [101, 120, 97, 109, 112, 108, 101],
      ],
      absolute: true,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dns/text-label-list-split",
  title: "DNS Text Label List Splitter",
  description:
    "Split ASCII DNS presentation text into explicit label octets with \\DDD or escaped-character spelling; no Unicode IDNA conversion and root/absolute status is explicit.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
