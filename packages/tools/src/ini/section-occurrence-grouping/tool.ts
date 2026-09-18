import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ sections: readonly string[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "sections", label: "sections", kind: "stringList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  return H.finish({
    occurrences: H.runs(i.sections, (x) => x).map((r, occurrence) => ({
      ...r,
      occurrence,
    })),
  });
};
export const example = {
  input: { sections: ["a", "a", "b", "a"] },
  output: {
    result: {
      occurrences: [
        { key: "a", start: 0, end: 2, occurrence: 0 },
        { key: "b", start: 2, end: 3, occurrence: 1 },
        { key: "a", start: 3, end: 4, occurrence: 2 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ini/section-occurrence-grouping",
  title: "INI Section Occurrence Grouping",
  description:
    "Group adjacent supplied INI section labels into distinct occurrence runs, preserving later returns to the same name rather than globally merging sections.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
