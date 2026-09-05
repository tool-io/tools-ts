import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch43-shared.js";

export type Input = Readonly<{ readonly observedFoilLobeCount: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "observedFoilLobeCount",
    label: "Observed foil lobe count",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    conventionalName: pick(
      String(input.observedFoilLobeCount),
      { "3": "trefoil", "4": "quatrefoil", "5": "cinquefoil" },
      "lobes",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { observedFoilLobeCount: 3 },
  output: { result: { conventionalName: "trefoil" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "heraldry/foil-petal-name-mapper",
  title: "Trefoil Quatrefoil Cinquefoil Petal Name Mapper",
  description:
    "Map only independently counted3/4/5 lobes to common foil terms; no automated flower identification.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
