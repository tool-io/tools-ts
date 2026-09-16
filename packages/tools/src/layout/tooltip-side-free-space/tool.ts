import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, rectangle } from "../batch53-shared.js";

export type Input = Readonly<{
  anchor: readonly number[];
  viewport: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "anchor", label: "Anchor", kind: "numberList" },
  { id: "viewport", label: "Viewport", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  rectangle(i.anchor);
  rectangle(i.viewport);
  return {
    left: i.anchor[0] - i.viewport[0],
    right: i.viewport[0] + i.viewport[2] - i.anchor[0] - i.anchor[2],
    top: i.anchor[1] - i.viewport[1],
    bottom: i.viewport[1] + i.viewport[3] - i.anchor[1] - i.anchor[3],
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { anchor: [4, 4, 2, 2], viewport: [0, 0, 10, 10] },
  output: { result: { left: 4, right: 4, top: 4, bottom: 4 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "layout/tooltip-side-free-space",
  title: "Tooltip Side Free Space",
  description:
    "Measure signed free space on four sides of an anchor rectangle inside a viewport; negative values retain overflow evidence.",
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
