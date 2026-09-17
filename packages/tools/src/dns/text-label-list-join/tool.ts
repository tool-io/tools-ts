import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ labelsJson: string; absolute: boolean }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "labelsJson", kind: "string", label: "labelsJson" },
  { id: "absolute", kind: "boolean", label: "absolute" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const labels = H.dnsLabels(i.labelsJson);
  H.check(labels.length > 0 || i.absolute);
  return H.finish({ name: H.dnsTextJoin(labels, i.absolute) });
};
export const example = {
  input: { labelsJson: "[[97,46,98],[101]]", absolute: true },
  output: { result: { name: "a\\046b.e." } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dns/text-label-list-join",
  title: "DNS Text Label List Joiner",
  description:
    "Join explicit DNS label octets into ASCII presentation text using decimal escapes for dots, backslashes and nonprintable octets; root is a single dot.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
