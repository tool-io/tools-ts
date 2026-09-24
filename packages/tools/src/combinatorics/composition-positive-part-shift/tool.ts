import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ positiveParts: readonly number[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "positiveParts", label: "Positive parts", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  i.positiveParts.forEach((x) => H.int(x, 1, 1000000));
  return H.finish({
    weakParts: i.positiveParts.map((x) => x - 1),
    originalTotal: i.positiveParts.reduce((s, x) => s + x, 0),
    shiftedTotal: i.positiveParts.reduce((s, x) => s + x - 1, 0),
  });
};
export const example = {
  input: { positiveParts: [2, 1, 3] },
  output: {
    result: { weakParts: [1, 0, 2], originalTotal: 6, shiftedTotal: 3 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "combinatorics/composition-positive-part-shift",
  title: "Combinatorics: Composition Positive Part Shift Tool",
  description:
    "Map one ordered positive composition to its weak composition by subtracting one per part, retaining both totals; no partition/count enumeration.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          originalTotal: { type: "number" },
          shiftedTotal: { type: "number" },
          weakParts: { type: "array", items: { type: "number" } },
        },
        required: ["originalTotal", "shiftedTotal", "weakParts"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
