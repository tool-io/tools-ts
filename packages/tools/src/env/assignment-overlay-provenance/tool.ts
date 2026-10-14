import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ baseJson: string; overlayJson: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "baseJson", label: "baseJson", kind: "string" },
  { id: "overlayJson", label: "overlayJson", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const a = H.assignments(i.baseJson),
    b = H.assignments(i.overlayJson),
    r = [...a, ...b];
  return H.finish({
    assignments: H.groups(r, (v) => v.name).map((g) => {
      const index = g.indexes.at(-1)!;
      return {
        ...r[index],
        side: index < a.length ? "base" : "overlay",
        sourceIndex: index < a.length ? index : index - a.length,
        shadowed: g.indexes.slice(0, -1),
      };
    }),
  });
};
export const example = {
  input: {
    baseJson: '[{"name":"A","value":"1"}]',
    overlayJson: '[{"name":"A","value":"2"}]',
  },
  output: {
    result: {
      assignments: [
        {
          name: "A",
          value: "2",
          side: "overlay",
          sourceIndex: 0,
          shadowed: [0],
        },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "Environment Assignment Overlay Provenance",
      "environment variables",
      "software development",
    ],
    collections: ["encode-decode"],
    fields: ["env", "environment variables", "software development"],
    keywords: ["environment variables", "software development"],
  },
  id: "env/assignment-overlay-provenance",
  title: "Environment Assignment Overlay Provenance",
  description:
    "Overlay two explicit environment occurrence lists with last-wins shadow provenance; case-sensitive portable names, no process environment mutation.",
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
          assignments: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                name: { type: "string" },
                value: { type: "string" },
                side: { type: "string" },
                sourceIndex: { type: "number" },
                shadowed: { type: "array", items: { type: "number" } },
              },
              required: ["name", "value", "side", "sourceIndex", "shadowed"],
            },
          },
        },
        required: ["assignments"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
