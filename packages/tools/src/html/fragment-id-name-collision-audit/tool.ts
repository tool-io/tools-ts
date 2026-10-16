import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  ids: readonly string[];
  names: readonly string[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "ids", label: "ids", kind: "stringList" },
  { id: "names", label: "names", kind: "stringList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  return H.finish({
    collisions: H.unique([...i.ids, ...i.names])
      .filter((x) => i.ids.includes(x) && i.names.includes(x))
      .map((value) => ({
        value,
        idIndexes: i.ids.flatMap((x, j) => (x === value ? [j] : [])),
        nameIndexes: i.names.flatMap((x, j) => (x === value ? [j] : [])),
      })),
  });
};
export const example = {
  input: { ids: ["a", "a"], names: ["a", "b"] },
  output: {
    result: {
      collisions: [{ value: "a", idIndexes: [0, 1], nameIndexes: [0] }],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["HTML Fragment ID Name Collision Audit"],
    collections: ["encode-decode"],
    fields: ["html"],
    keywords: [],
  },
  id: "html/fragment-id-name-collision-audit",
  title: "HTML Fragment ID Name Collision Audit",
  description:
    "Audit exact cross-namespace collisions between supplied HTML IDs and legacy named anchors with both source index lists; no browser target resolution.",
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
          collisions: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                value: { type: "string" },
                idIndexes: { type: "array", items: { type: "number" } },
                nameIndexes: { type: "array", items: { type: "number" } },
              },
              required: ["value", "idIndexes", "nameIndexes"],
            },
          },
        },
        required: ["collisions"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
