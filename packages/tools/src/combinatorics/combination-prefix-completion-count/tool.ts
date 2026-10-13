import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  prefix: readonly number[];
  size: number;
  count: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "prefix", kind: "numberList", label: "prefix" },
  { id: "size", kind: "integer", label: "size" },
  { id: "count", kind: "integer", label: "count" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.combo(i.prefix, i.size);
  H.int(i.count, i.prefix.length, i.size);
  const available = i.prefix.length ? i.size - i.prefix.at(-1)! - 1 : i.size;
  return H.finish({
    completions: String(H.choose(available, i.count - i.prefix.length)),
  });
};
export const example = {
  input: { prefix: [1, 3], size: 6, count: 3 },
  output: { result: { completions: "2" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "combinatorics/combination-prefix-completion-count",
  title: "Combination Prefix Completion Count",
  description:
    "Count exact sorted-combination completions of an explicit prefix, excluding earlier skipped indexes; does not enumerate or assume the prefix is arbitrary subset membership.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { completions: { type: "string" } },
        required: ["completions"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
