import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ cube: readonly number[]; turns: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "cube", label: "cube", kind: "numberList" },
  { id: "turns", label: "turns", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.cube(i.cube);
  H.int(i.turns, -1e9, 1e9);
  let p = [...i.cube];
  for (let j = 0; j < H.mod(i.turns, 6); j++) p = [-p[2], -p[0], -p[1]];
  return H.finish({ cube: p });
};
export const example = {
  input: { cube: [1, -1, 0], turns: 1 },
  output: { result: { cube: [0, -1, 1] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["Hex Cube Sixty Degree Rotation", "hexadecimal", "encoding"],
    collections: ["encode-decode"],
    fields: ["hex", "hexadecimal", "encoding"],
    keywords: ["hexadecimal", "encoding"],
  },
  id: "hex/cube-sixty-degree-rotation",
  title: "Hex Cube Sixty Degree Rotation",
  description:
    "Rotate integer hex cube coordinates by signed multiples of sixty degrees via [x,y,z] -> [-z,-x,-y]; not a Cartesian pixel rotation.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit bounded result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { cube: { type: "array", items: { type: "number" } } },
        required: ["cube"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
