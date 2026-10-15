import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ weights: readonly number[]; tolerance: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "weights", label: "weights", kind: "numberList" },
  { id: "tolerance", label: "tolerance", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.check(i.weights.length === 3 && i.tolerance >= 0);
  const sum = i.weights.reduce((s, x) => s + x, 0);
  return H.finish({
    sum,
    member:
      Math.abs(sum - 1) <= i.tolerance &&
      i.weights.every((x) => x >= -i.tolerance && x <= 1 + i.tolerance),
  });
};
export const example = {
  input: { weights: [0.5, 0.25, 0.25], tolerance: 0 },
  output: { result: { sum: 1, member: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["Triangle Barycentric Membership", "mathematics"],
    collections: ["data", "learn"],
    fields: ["geometry", "mathematics"],
    keywords: ["mathematics"],
  },
  id: "geometry/triangle-barycentric-membership",
  title: "Triangle Barycentric Membership",
  description:
    "Audit supplied three-coordinate barycentric closed-triangle membership with an explicit nonnegative absolute tolerance; does not validate a triangle\u2019s geometry.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit bounded result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { sum: { type: "number" }, member: { type: "boolean" } },
        required: ["sum", "member"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
