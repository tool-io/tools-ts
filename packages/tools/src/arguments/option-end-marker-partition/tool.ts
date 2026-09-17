import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ arguments: readonly string[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "arguments", label: "arguments", kind: "stringList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const at = i.arguments.indexOf("--");
  return H.finish({
    before: at < 0 ? [...i.arguments] : i.arguments.slice(0, at),
    after: at < 0 ? [] : i.arguments.slice(at + 1),
    markerIndex: at < 0 ? null : at,
  });
};
export const example = {
  input: { arguments: ["-x", "--", "--value"] },
  output: { result: { before: ["-x"], after: ["--value"], markerIndex: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "arguments/option-end-marker-partition",
  title: "Option End Marker Partition",
  description:
    "Partition an explicit argv at its first exact -- end-of-options marker; no shell tokenization or reclassification of later tokens.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
