import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  formAttribute: string;
  ancestorForm: string;
  forms: readonly string[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "formAttribute", label: "formAttribute", kind: "string" },
  { id: "ancestorForm", label: "ancestorForm", kind: "string" },
  { id: "forms", label: "forms", kind: "stringList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  return H.finish({
    owner: i.formAttribute
      ? i.forms.includes(i.formAttribute)
        ? i.formAttribute
        : null
      : i.ancestorForm || null,
    explicit: i.formAttribute !== "",
    matches: i.formAttribute
      ? i.forms.filter((x) => x === i.formAttribute).length
      : 0,
  });
};
export const example = {
  input: { formAttribute: "x", ancestorForm: "a", forms: ["a"] },
  output: { result: { owner: null, explicit: true, matches: 0 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["HTML Form Associated Owner Reference"],
    collections: ["encode-decode"],
    fields: ["html"],
    keywords: [],
  },
  id: "html/form-associated-owner-reference",
  title: "HTML Form Associated Owner Reference",
  description:
    "Resolve a supplied explicit form attribute before a supplied ancestor form; missing/duplicate owner evidence is retained, no DOM lookup or first-element claim.",
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
          owner: { anyOf: [{ type: "string" }, { type: "null" }] },
          explicit: { type: "boolean" },
          matches: { type: "number" },
        },
        required: ["owner", "explicit", "matches"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
