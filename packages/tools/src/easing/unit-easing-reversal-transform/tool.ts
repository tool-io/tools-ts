import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ samples: readonly (readonly number[])[] }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "samples", label: "samples", kind: "matrix" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  i.samples.forEach((r) => {
    H.point(r);
    r.forEach(H.unit);
  });
  H.check(i.samples.every((r, j) => j === 0 || r[0] >= i.samples[j - 1][0]));
  return H.finish({
    samples: i.samples.map(([t, v]) => [1 - t, 1 - v]).reverse(),
  });
};
export const example = {
  input: {
    samples: [
      [0, 0],
      [0.25, 0.1],
      [1, 1],
    ],
  },
  output: {
    result: {
      samples: [
        [0, 0],
        [0.75, 0.9],
        [1, 1],
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["Unit Easing Reversal Transform", "mathematics"],
    collections: ["data", "learn"],
    fields: ["easing", "mathematics"],
    keywords: ["mathematics"],
  },
  id: "easing/unit-easing-reversal-transform",
  title: "Unit Easing Reversal Transform",
  description:
    "Reverse supplied ordered unit easing samples in both time and value, preserving an ascending sample sequence; does not evaluate an unknown easing function.",
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
          samples: {
            type: "array",
            items: { type: "array", items: { type: "number" } },
          },
        },
        required: ["samples"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
