import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  simpleError,
} from "../batch52-shared.js";
export type Input = Readonly<{
  readonly cocoonInputKg: number;
  readonly rawSilkOutputKg: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "cocoonInputKg", label: "Cocoon input kg", kind: "number" },
  { id: "rawSilkOutputKg", label: "Raw silk output kg", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  nonnegative(i.cocoonInputKg, "input");
  positive(i.rawSilkOutputKg, "output");
  if (i.rawSilkOutputKg > i.cocoonInputKg)
    simpleError("output", "Silk output exceeds cocoon input.");
  return { renditta: i.cocoonInputKg / i.rawSilkOutputKg };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { cocoonInputKg: 60, rawSilkOutputKg: 10 },
  output: { result: { renditta: 6 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sericulture/renditta-cocoon-silk-ratio",
  title: "Renditta Cocoon Silk Ratio Calculator",
  description:
    "Observed renditta kg cocoon input per kg raw silk output; actual lot/basis must match.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { renditta: { type: "number" } },
        required: ["renditta"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
