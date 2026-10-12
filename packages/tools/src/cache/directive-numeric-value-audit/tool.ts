import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  directivesJson: string;
  numericNames: readonly string[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "directivesJson", label: "directivesJson", kind: "string" },
  { id: "numericNames", label: "numericNames", kind: "stringList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const r = H.directives(i.directivesJson);
  i.numericNames.forEach((s) => H.check(H.token(s)));
  return H.finish({
    values: r.flatMap((v, index) =>
      i.numericNames.map((x) => x.toLowerCase()).includes(v.name)
        ? [
            {
              index,
              name: v.name,
              valid: v.value !== null && /^[0-9]+(?![\s\S])/.test(v.value),
              value: v.value,
            },
          ]
        : [],
    ),
  });
};
export const example = {
  input: {
    directivesJson:
      '[{"name":"max-age","value":"5"},{"name":"max-age","value":"-1"}]',
    numericNames: ["max-age"],
  },
  output: {
    result: {
      values: [
        { index: 0, name: "max-age", valid: true, value: "5" },
        { index: 1, name: "max-age", valid: false, value: "-1" },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "Cache Directive Numeric Value Audit",
      "caching",
      "software development",
    ],
    collections: ["data", "learn"],
    fields: ["cache", "caching", "software development"],
    keywords: ["caching", "software development"],
  },
  id: "cache/directive-numeric-value-audit",
  title: "Cache Directive Numeric Value Audit",
  description:
    "Audit unsigned decimal syntax of caller-declared numeric cache directives without coercing or accepting signs, quotes or defaults; values remain raw strings.",
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
          values: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                index: { type: "number" },
                name: { type: "string" },
                valid: { type: "boolean" },
                value: { anyOf: [{ type: "string" }, { type: "null" }] },
              },
              required: ["index", "name", "valid", "value"],
            },
          },
        },
        required: ["values"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
