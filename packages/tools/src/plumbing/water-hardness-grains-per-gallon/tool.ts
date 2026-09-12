import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualHardnessMgPerLiterAsCaco3: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualHardnessMgPerLiterAsCaco3",
    label: "Actual hardness mg per liter as caco3",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.actualHardnessMgPerLiterAsCaco3,
    "actualHardnessMgPerLiterAsCaco3",
  );
  return { value: input.actualHardnessMgPerLiterAsCaco3 / 17.1180610432113 };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualHardnessMgPerLiterAsCaco3: 34.2361220864226 },
  output: { result: { value: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/water-hardness-grains-per-gallon",
  title: "Plumbing Water Hardness Grains Per Gallon Calculator",
  description:
    "CaCO3equivalenthardnessmg/L\u2192grains/US gallon via64.79891mg/grain and3.785411784L/USgal, no imperial gallon basis. Actual independently matched units, regime, material/equipment and governing references; not a hydraulic code, safe pressure, water pot ability or operational approval.",
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
