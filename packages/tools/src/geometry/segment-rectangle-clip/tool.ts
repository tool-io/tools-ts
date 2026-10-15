import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  start: readonly number[];
  end: readonly number[];
  rectangle: readonly number[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "start", label: "start", kind: "numberList" },
  { id: "end", label: "end", kind: "numberList" },
  { id: "rectangle", label: "rectangle", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  return H.finish({ segment: H.clipSegment(i.start, i.end, i.rectangle) });
};
export const example = {
  input: { start: [-1, 1], end: [3, 1], rectangle: [0, 0, 2, 2] },
  output: {
    result: {
      segment: [
        [0, 1],
        [2, 1],
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["Segment Rectangle Clip", "mathematics"],
    collections: ["data", "learn"],
    fields: ["geometry", "mathematics"],
    keywords: ["mathematics"],
  },
  id: "geometry/segment-rectangle-clip",
  title: "Segment Rectangle Clip",
  description:
    "Clip one closed planar segment to an inclusive axis-aligned rectangle using parameter bounds; null means no intersection.",
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
          segment: {
            anyOf: [
              {
                type: "array",
                items: { type: "array", items: { type: "number" } },
              },
              { type: "null" },
            ],
          },
        },
        required: ["segment"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
