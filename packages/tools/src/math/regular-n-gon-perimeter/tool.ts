import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  bounded,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualSideCount: number;
  readonly actualSideLength: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualSideCount", label: "Actual side count", kind: "number" },
  { id: "actualSideLength", label: "Actual side length", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(input.actualSideCount, "actualSideCount", 1, 1000000);
  positive(input.actualSideLength, "actualSideLength");
  if (input.actualSideCount < 3) simpleError("sides", "n≥3.");
  return { value: input.actualSideCount * input.actualSideLength };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualSideCount: 3, actualSideLength: 2 },
  output: { result: { value: 6 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/regular-n-gon-perimeter",
  title: "Regular N-Gon Perimeter Calculator",
  description:
    "Regularn-gon perimeter n\u00d7s, integern\u22653, not circumradius or area.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
