import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ leftAxis: number; rightAxis: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "leftAxis", label: "Left axis", kind: "integer" },
  { id: "rightAxis", label: "Right axis", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.leftAxis, 0, 1000000);
  H.int(i.rightAxis, 0, 1000000);
  const compatible =
    i.leftAxis === i.rightAxis || i.leftAxis === 1 || i.rightAxis === 1;
  return H.finish({
    compatible: compatible,
    outputAxis: compatible
      ? i.leftAxis === 1
        ? i.rightAxis
        : i.rightAxis === 1
          ? i.leftAxis
          : i.leftAxis
      : -1,
  });
};
export const example = {
  input: { leftAxis: 1, rightAxis: 0 },
  output: { result: { compatible: true, outputAxis: 0 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "matrix/matrix-broadcast-singleton-axis-check",
  title: "Matrix: Matrix Broadcast Singleton Axis Check Tool",
  description:
    "Resolve one NumPy-style broadcast axis, preserving zero axes and using -1 only when unequal non-singleton axes are incompatible.",
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
          compatible: { type: "boolean" },
          outputAxis: { type: "number" },
        },
        required: ["compatible", "outputAxis"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
