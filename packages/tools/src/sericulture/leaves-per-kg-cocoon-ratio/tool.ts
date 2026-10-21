import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch52-shared.js";
export type Input = Readonly<{
  readonly consumedLeafKg: number;
  readonly cocoonKg: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "consumedLeafKg", label: "Consumed leaf kg", kind: "number" },
  { id: "cocoonKg", label: "Cocoon kg", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  nonnegative(i.consumedLeafKg, "leaves");
  positive(i.cocoonKg, "cocoons");
  return { leafKgPerCocoonKg: i.consumedLeafKg / i.cocoonKg };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { consumedLeafKg: 200, cocoonKg: 10 },
  output: { result: { leafKgPerCocoonKg: 20 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sericulture/leaves-per-kg-cocoon-ratio",
  title: "Leaves Per KG Cocoon Ratio Calculator",
  description:
    "Measured feed conversion ratio in kg leaves per kg cocoons; moisture basis must be matched.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { leafKgPerCocoonKg: { type: "number" } },
        required: ["leafKgPerCocoonKg"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
