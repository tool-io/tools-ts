import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  properties: readonly string[];
  rulesJson: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "properties", label: "properties", kind: "stringList" },
  { id: "rulesJson", label: "rulesJson", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const r = H.records(i.rulesJson).map((v) => {
    const name = H.str(v.name).toUpperCase();
    H.icalName(name);
    const minimum = H.int(H.num(v.minimum), 0, 128),
      maximum = H.int(H.num(v.maximum), minimum, 128);
    return { name, minimum, maximum };
  });
  i.properties.forEach(H.icalName);
  return H.finish({
    violations: r.flatMap((v) => {
      const count = i.properties.filter(
        (x) => x.toUpperCase() === v.name,
      ).length;
      return count < v.minimum || count > v.maximum ? [{ ...v, count }] : [];
    }),
  });
};
export const example = {
  input: {
    properties: ["UID", "SUMMARY", "UID"],
    rulesJson: '[{"name":"UID","minimum":1,"maximum":1}]',
  },
  output: {
    result: { violations: [{ name: "UID", minimum: 1, maximum: 1, count: 2 }] },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ical/property-cardinality-audit",
  title: "iCalendar Property Cardinality Audit",
  description:
    "Audit property-name occurrence cardinality only against explicitly supplied component rules; no embedded current iCalendar rule table or complete validity claim.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
