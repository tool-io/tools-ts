import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  present: readonly string[];
  dependenciesJson: string;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "present", label: "present", kind: "stringList" },
  { id: "dependenciesJson", label: "dependenciesJson", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const r = H.records(i.dependenciesJson).map((v) => ({
    option: H.str(v.option),
    requires: H.str(v.requires),
  }));
  return H.finish({
    violations: r.filter(
      (v) => i.present.includes(v.option) && !i.present.includes(v.requires),
    ),
  });
};
export const example = {
  input: {
    present: ["a"],
    dependenciesJson: '[{"option":"a","requires":"b"}]',
  },
  output: { result: { violations: [{ option: "a", requires: "b" }] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["Option Dependency Presence Audit"],
    collections: ["encode-decode"],
    fields: ["arguments"],
    keywords: [],
  },
  id: "arguments/option-dependency-presence-audit",
  title: "Option Dependency Presence Audit",
  description:
    "Check explicit one-way option presence dependencies without adding transitive inferred options or applying defaults.",
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
                option: { type: "string" },
                requires: { type: "string" },
              },
              required: ["option", "requires"],
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
