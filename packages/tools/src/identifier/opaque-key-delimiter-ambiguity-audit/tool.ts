import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  components: readonly string[];
  delimiter: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "components", label: "components", kind: "stringList" },
  { id: "delimiter", label: "delimiter", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.delimiter.length > 0);
  return H.finish({
    ambiguousComponents: i.components.flatMap((value, index) =>
      value.includes(i.delimiter) ? [index] : [],
    ),
    emptyComponents: i.components.flatMap((value, index) =>
      value === "" ? [index] : [],
    ),
  });
};
export const example = {
  input: { components: ["a:b", "", "c"], delimiter: ":" },
  output: { result: { ambiguousComponents: [0], emptyComponents: [1] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "identifier/opaque-key-delimiter-ambiguity-audit",
  title: "Opaque Key Delimiter Ambiguity Audit",
  description:
    "Audit literal delimiter occurrences and empty components before naive opaque composite-key joining; reports hazards without inventing an escaping dialect.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
