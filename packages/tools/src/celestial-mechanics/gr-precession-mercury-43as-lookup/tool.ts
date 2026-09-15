import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch52-shared.js";
export type Input = Readonly<{ readonly reference: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "reference", label: "Reference", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  return {
    reference: pick(
      i.reference,
      { "rounded-relativistic-arcsec-per-century": 43 },
      "reference",
    ),
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { reference: "rounded-relativistic-arcsec-per-century" },
  output: { result: { reference: 43 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "celestial-mechanics/gr-precession-mercury-43as-lookup",
  title: "Apsidal Precession GR 43 arcsec/Century Mercury Reference Lookup",
  description:
    "Rounded Mercury relativistic perihelion contribution only, not total Newtonian-plus-relativistic precession.",
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
