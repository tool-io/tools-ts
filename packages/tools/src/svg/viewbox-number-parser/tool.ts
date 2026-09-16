import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  nonnegative,
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
  const a = svgNumbers(i.value);
  if (a.length !== 4) simpleError("viewBox", "Exactly four finite numbers.");
  nonnegative(a[2], "width");
  nonnegative(a[3], "height");
  return {
    minX: a[0],
    minY: a[1],
    width: a[2],
    height: a[3],
    renderable: a[2] > 0 && a[3] > 0,
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { value: "0 0 10 20" },
  output: {
    result: { minX: 0, minY: 0, width: 10, height: 20, renderable: true },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "svg/viewbox-number-parser",
  title: "SVG ViewBox Number Parser",
  description:
    "Parse an SVG viewBox with explicit nonnegative width/height; zero dimensions are retained as nonrenderable, not a valid aspect-ratio divisor.",
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
