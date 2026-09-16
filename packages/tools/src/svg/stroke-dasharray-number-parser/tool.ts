import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  finite,
  svgNumbers,
} from "../batch53-shared.js";

export type Input = Readonly<{ value: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "value", label: "Value", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  if (i.value.trim() === "none") return { none: true, dashArray: [] };
  const a = svgNumbers(i.value);
  if (!a.length || a.some((v) => v < 0))
    simpleError("dasharray", "Nonnegative finite number-only dash list.");
  return { none: false, dashArray: a };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { value: "2,1 3" },
  output: { result: { none: false, dashArray: [2, 1, 3] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "svg/stroke-dasharray-number-parser",
  title: "SVG Stroke Dasharray Number Parser",
  description:
    "Parse the unitless finite-number SVG stroke-dasharray branch or none; lengths with units and percentages require a separate context.",
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
