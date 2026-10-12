import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ q: number; r: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "q", kind: "integer", label: "q" },
  { id: "r", kind: "integer", label: "r" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.int(i.q, -1e9, 1e9);
  H.int(i.r, -1e9, 1e9);
  return H.finish({ x: i.q, y: -i.q - i.r, z: i.r });
};
export const example = {
  input: { q: 2, r: -1 },
  output: { result: { x: 2, y: -1, z: -1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "board/board-hex-axial-cube-converter",
  title: "Board Hex Axial Cube Converter",
  description:
    "Convert integer axial hex coordinates q,r to cube x=q,z=r,y=-q-r, preserving the zero-sum invariant.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          x: { type: "number" },
          y: { type: "number" },
          z: { type: "number" },
        },
        required: ["x", "y", "z"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
