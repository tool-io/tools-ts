import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch52-shared.js";
export type Input = Readonly<{ readonly tex: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "tex", label: "Tex", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  nonnegative(i.tex, "density");
  return { convertedLinearDensity: i.tex * 9 };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { tex: 10 },
  output: { result: { convertedLinearDensity: 90 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sericulture/tex-to-denier-converter",
  title: "Tex to Denier Converter",
  description:
    "Convert linear yarn density; denier is g/9000m, tex is g/1000m.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
