import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError, mask } from "../batch53-shared.js";

export type Input = Readonly<{
  left: readonly (readonly number[])[];
  right: readonly (readonly number[])[];
  operation: string;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "left", label: "Left", kind: "matrix" },
  { id: "right", label: "Right", kind: "matrix" },
  { id: "operation", label: "Operation", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input, context?: ToolExecutionContext) => {
  const a = mask(i.left),
    b = mask(i.right);
  if (
    a.rows !== b.rows ||
    a.columns !== b.columns ||
    !["and", "or", "xor", "left-minus-right"].includes(i.operation)
  )
    simpleError("masks", "Matched shapes and supported Boolean operation.");
  return {
    mask: i.left.map((r, y) =>
      r.map((v, x) => {
        const w = i.right[y][x];
        return i.operation === "and"
          ? v & w
          : i.operation === "or"
            ? v | w
            : i.operation === "xor"
              ? v ^ w
              : v && !w
                ? 1
                : 0;
      }),
    ),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext) => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { left: [[1, 0]], right: [[1, 1]], operation: "xor" },
  output: { result: { mask: [[0, 1]] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "grid/grid-mask-boolean-combination",
  title: "Grid Mask Boolean Combination",
  description:
    "Combine identically shaped binary masks by explicit AND, OR, XOR or left difference; no resampling or alignment inference.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          mask: {
            type: "array",
            items: { type: "array", items: { type: "number" } },
          },
        },
        required: ["mask"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
