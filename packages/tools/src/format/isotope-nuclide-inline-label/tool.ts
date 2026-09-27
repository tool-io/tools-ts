import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  elementSymbol: string;
  massNumber: number;
  atomicNumber: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "elementSymbol", label: "Element symbol", kind: "string" },
  { id: "massNumber", label: "Mass number", kind: "integer" },
  { id: "atomicNumber", label: "Atomic number", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(/^[A-Z][a-z]?(?![\s\S])/.test(i.elementSymbol));
  H.int(i.atomicNumber, 1, 118);
  H.int(i.massNumber, i.atomicNumber, 1000);
  return H.finish({
    label: "[" + i.massNumber + "," + i.atomicNumber + "]" + i.elementSymbol,
  });
};
export const example = {
  input: { elementSymbol: "C", massNumber: 14, atomicNumber: 6 },
  output: { result: { label: "[14,6]C" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "format/isotope-nuclide-inline-label",
  title: "Formatting: Isotope Nuclide Inline Label Tool",
  description:
    "Format an explicit nuclide label in unambiguous [A,Z]Symbol text with A>=Z; symbol-to-atomic-number consistency and isotope existence are not inferred.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { label: { type: "string" } },
        required: ["label"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
