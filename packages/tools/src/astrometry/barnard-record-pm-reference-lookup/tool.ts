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
      { "rounded-proper-motion-arcsec-per-year": 10.3 },
      "reference",
    ),
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { reference: "rounded-proper-motion-arcsec-per-year" },
  output: { result: { reference: 10.3 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrometry/barnard-record-pm-reference-lookup",
  title: "Barnard Star Record Proper Motion 10.3 arcsec/yr Reference Lookup",
  description:
    "Rounded Barnard star proper-motion reference only; not current catalog components, a universal record claim or motion ephemeris.",
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
