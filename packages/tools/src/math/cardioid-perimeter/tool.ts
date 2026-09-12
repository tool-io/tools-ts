import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch49-shared.js";
export type Input = Readonly<{ readonly polarCoefficient: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "polarCoefficient", label: "Polar coefficient", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.polarCoefficient, "polarCoefficient");
  return { value: 8 * input.polarCoefficient };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { polarCoefficient: 1 },
  output: { result: { value: 8 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/cardioid-perimeter",
  title: "Cardioid Perimeter Calculator",
  description:
    "Cardioidr=a(1+cos\u03b8)perimeter8a,samecoefficientnotmaximumradius2a.",
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
