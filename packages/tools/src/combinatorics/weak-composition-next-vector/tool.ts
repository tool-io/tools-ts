import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ vector: readonly number[] }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "vector", kind: "numberList", label: "vector" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.check(i.vector.length > 0);
  i.vector.forEach((x) => H.int(x, 0, 128));
  let p = i.vector.length - 2;
  while (p >= 0 && i.vector.slice(p + 1).reduce((s, x) => s + x, 0) === 0) p--;
  if (p < 0) return H.finish({ vector: null });
  const next = [...i.vector],
    tail = next.slice(p + 1).reduce((s, x) => s + x, 0);
  next[p]++;
  next.fill(0, p + 1);
  next[next.length - 1] = tail - 1;
  return H.finish({ vector: next });
};
export const example = {
  input: { vector: [0, 1, 2] },
  output: { result: { vector: [0, 2, 1] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "combinatorics/weak-composition-next-vector",
  title: "Next Weak Composition Vector",
  description:
    "Return the next lexicographically increasing weak composition of the same total and length, preserving nonnegative integer parts; null marks the final vector.",
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
          vector: {
            anyOf: [
              { type: "array", items: { type: "integer" } },
              { type: "null" },
            ],
          },
        },
        required: ["vector"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
