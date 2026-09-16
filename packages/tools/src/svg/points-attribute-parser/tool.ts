import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  points,
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
  if (a.length % 2) simpleError("points", "Even number of x,y coordinates.");
  return {
    points: Array.from({ length: a.length / 2 }, (_, j) => [
      a[2 * j],
      a[2 * j + 1],
    ]),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { value: "0,0 1,2" },
  output: {
    result: {
      points: [
        [0, 0],
        [1, 2],
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "svg/points-attribute-parser",
  title: "SVG Points Attribute Parser",
  description:
    "Parse finite SVG points-attribute number pairs with comma/whitespace or sign separators; reject incomplete pairs and malformed separators.",
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
