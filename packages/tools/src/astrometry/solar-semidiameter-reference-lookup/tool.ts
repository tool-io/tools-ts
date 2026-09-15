import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, mean, pick } from "../batch52-shared.js";
export type Input = Readonly<{ readonly reference: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "reference", label: "Reference", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  return {
    reference: pick(i.reference, { "rounded-mean-arcmin": 16 }, "reference"),
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { reference: "rounded-mean-arcmin" },
  output: { result: { reference: 16 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrometry/solar-semidiameter-reference-lookup",
  title: "Solar Semi-Diameter 16 arcmin Reference Lookup",
  description:
    "Illustrative rounded mean solar angular semidiameter in arcminutes; actual ephemeris varies with distance.",
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
