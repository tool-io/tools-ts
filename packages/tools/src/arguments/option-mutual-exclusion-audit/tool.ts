import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  present: readonly string[];
  groupsJson: string;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "present", label: "present", kind: "stringList" },
  { id: "groupsJson", label: "groupsJson", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const r = H.arr(i.groupsJson).map((x) => {
    H.check(Array.isArray(x));
    const g = (x as unknown[]).map(H.str);
    H.check(H.unique(g).length === g.length);
    return g;
  });
  return H.finish({
    violations: r.flatMap((g, index) => {
      const names = g.filter((x) => i.present.includes(x));
      return names.length > 1 ? [{ index, names }] : [];
    }),
  });
};
export const example = {
  input: { present: ["a", "b"], groupsJson: '[["a","b"],["c","d"]]' },
  output: { result: { violations: [{ index: 0, names: ["a", "b"] }] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["Option Mutual Exclusion Audit"],
    collections: ["encode-decode"],
    fields: ["arguments"],
    keywords: [],
  },
  id: "arguments/option-mutual-exclusion-audit",
  title: "Option Mutual Exclusion Audit",
  description:
    "Audit caller-declared mutually exclusive option groups against explicit present names, not shell or argv syntax.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit bounded result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          violations: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                index: { type: "number" },
                names: { type: "array", items: { type: "string" } },
              },
              required: ["index", "names"],
            },
          },
        },
        required: ["violations"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
