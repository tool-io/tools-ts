import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  sections: readonly string[];
  assignmentSectionIndexes: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "sections", label: "sections", kind: "stringList" },
  {
    id: "assignmentSectionIndexes",
    label: "assignmentSectionIndexes",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  i.sections.forEach(H.iniName);
  i.assignmentSectionIndexes.forEach((x) => H.int(x, 0, i.sections.length - 1));
  return H.finish({
    emptyOccurrenceIndexes: i.sections.flatMap((_, index) =>
      i.assignmentSectionIndexes.includes(index) ? [] : [index],
    ),
  });
};
export const example = {
  input: { sections: ["a", "a", "b"], assignmentSectionIndexes: [1] },
  output: { result: { emptyOccurrenceIndexes: [0, 2] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ini/section-empty-occurrence-audit",
  title: "INI Empty Section Occurrence Audit",
  description:
    "Audit empty INI section occurrences by explicit occurrence-index assignment ownership, distinguishing repeated section headings with the same name.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
