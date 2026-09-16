import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded, mod } from "../batch53-shared.js";

export type Input = Readonly<{
  index: number;
  length: number;
  rightRotation: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "index", label: "Index", kind: "number" },
  { id: "length", label: "Length", kind: "number" },
  { id: "rightRotation", label: "Right rotation", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  bounded(i.length, "length", 1, 1e9);
  bounded(i.index, "index", 0, i.length - 1);
  bounded(i.rightRotation, "rotation", -1e9, 1e9);
  return { rotatedIndex: mod(i.index + i.rightRotation, i.length) };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { index: 4, length: 5, rightRotation: 2 },
  output: { result: { rotatedIndex: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "list/rotation-index-mapper",
  title: "Rotation Index Mapper",
  description:
    "Map original position through a signed right rotation, distinct from copying rotated values.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
