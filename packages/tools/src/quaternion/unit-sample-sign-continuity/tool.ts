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
  let previous: number[] = [];
  return H.finish({
    samples: i.samples.map((v, j) => {
      H.qUnit(v);
      const q =
        j && previous.reduce((s, x, k) => s + x * v[k], 0) < 0
          ? v.map((x) => -x)
          : [...v];
      previous = q;
      return q;
    }),
  });
};
export const example = {
  input: {
    samples: [
      [1, 0, 0, 0],
      [-1, 0, 0, 0],
      [1, 0, 0, 0],
    ],
  },
  output: {
    result: {
      samples: [
        [1, 0, 0, 0],
        [1, 0, 0, 0],
        [1, 0, 0, 0],
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "Unit Quaternion Sample Sign Continuity",
      "quaternions",
      "3D rotations",
    ],
    collections: ["data", "learn"],
    fields: ["quaternion", "quaternions", "3D rotations"],
    keywords: ["quaternions", "3D rotations"],
  },
  id: "quaternion/unit-sample-sign-continuity",
  title: "Unit Quaternion Sample Sign Continuity",
  description:
    "Quaternion order is scalar-first [w,x,y,z], Hamilton product and right-handed active rotations; choose consecutive sample signs to keep dot products nonnegative, preserving the first input sign; no smoothing or missing-motion recovery.",
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
