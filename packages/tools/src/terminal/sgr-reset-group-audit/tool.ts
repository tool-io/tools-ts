import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ parameters: readonly number[] }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "parameters", label: "parameters", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  i.parameters.forEach((x) => H.int(x, 0, 107));
  H.check(!i.parameters.includes(38) && !i.parameters.includes(48));
  return H.finish({
    resets: i.parameters.flatMap((value, index) =>
      [0, 22, 23, 24, 27, 29, 39, 49].includes(value)
        ? [
            {
              index,
              value,
              groups:
                value === 0
                  ? ["all"]
                  : value === 22
                    ? ["bold", "faint"]
                    : [String(value)],
            },
          ]
        : [],
    ),
  });
};
export const example = {
  input: { parameters: [1, 22, 0] },
  output: {
    result: {
      resets: [
        { index: 1, value: 22, groups: ["bold", "faint"] },
        { index: 2, value: 0, groups: ["all"] },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "Terminal SGR Reset Group Audit",
      "terminal escape sequences",
      "software development",
    ],
    collections: ["encode-decode"],
    fields: ["terminal", "terminal escape sequences", "software development"],
    keywords: ["terminal escape sequences", "software development"],
  },
  id: "terminal/sgr-reset-group-audit",
  title: "Terminal SGR Reset Group Audit",
  description:
    "Audit reset-group occurrences in a simple SGR list without extended colors; 22 resets bold and faint together, 0 resets all supported style groups.",
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
          resets: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                index: { type: "number" },
                value: { type: "number" },
                groups: { type: "array", items: { type: "string" } },
              },
              required: ["index", "value", "groups"],
            },
          },
        },
        required: ["resets"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
