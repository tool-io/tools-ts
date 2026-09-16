import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  nonnegative,
} from "../batch53-shared.js";

export type Input = Readonly<{ strokeWidth: number; cap: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "strokeWidth", label: "Stroke width", kind: "number" },
  { id: "cap", label: "Cap", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  nonnegative(i.strokeWidth, "width");
  if (!["butt", "round", "square"].includes(i.cap))
    simpleError("cap", "Supported SVG line cap.");
  return {
    extensionPerEnd: i.cap === "butt" ? 0 : i.strokeWidth / 2,
    totalAxialExtension: i.cap === "butt" ? 0 : i.strokeWidth,
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { strokeWidth: 4, cap: "round" },
  output: { result: { extensionPerEnd: 2, totalAxialExtension: 4 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "svg/line-cap-extension-budget",
  title: "Line Cap Extension Budget",
  description:
    "Compute ideal axial line-cap extension budget for straight segments; round caps are not rectangular area bounds and joins are outside scope.",
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
