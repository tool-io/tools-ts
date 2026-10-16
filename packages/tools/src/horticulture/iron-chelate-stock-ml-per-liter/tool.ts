import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch52-shared.js";
export type Input = Readonly<{
  readonly targetElementMgPerLiter: number;
  readonly stockElementMgPerMl: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "targetElementMgPerLiter",
    label: "Target element mg per liter",
    kind: "number",
  },
  {
    id: "stockElementMgPerMl",
    label: "Stock element mg per ml",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  nonnegative(i.targetElementMgPerLiter, "target");
  positive(i.stockElementMgPerMl, "stock");
  return {
    stockMlPerFinalLiter: i.targetElementMgPerLiter / i.stockElementMgPerMl,
  };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { targetElementMgPerLiter: 2, stockElementMgPerMl: 4 },
  output: { result: { stockMlPerFinalLiter: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horticulture/iron-chelate-stock-ml-per-liter",
  title: "Iron Chelate Stock ML Per Liter Calculator",
  description:
    "Stock dilution volume from actual elemental iron concentration and independently selected target; does not select chelate or crop-safe concentration.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { stockMlPerFinalLiter: { type: "number" } },
        required: ["stockMlPerFinalLiter"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
