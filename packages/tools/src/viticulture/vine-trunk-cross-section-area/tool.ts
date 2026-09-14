import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch52-shared.js";
export type Input = Readonly<{
  readonly diameterAxisACm: number;
  readonly diameterAxisBCm: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "diameterAxisACm", label: "Diameter axis a cm", kind: "number" },
  { id: "diameterAxisBCm", label: "Diameter axis b cm", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  positive(i.diameterAxisACm, "diameter");
  positive(i.diameterAxisBCm, "diameter");
  return { areaCm2: (Math.PI * i.diameterAxisACm * i.diameterAxisBCm) / 4 };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { diameterAxisACm: 2, diameterAxisBCm: 4 },
  output: { result: { areaCm2: 6.283185307179586 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "viticulture/vine-trunk-cross-section-area",
  title: "Vine Trunk Cross Section Area Calculator",
  description:
    "Elliptical measured vine-trunk cross-sectional area, not vigor or health assessment.",
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
