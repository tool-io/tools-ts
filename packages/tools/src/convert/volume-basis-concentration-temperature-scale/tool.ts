import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  concentration: number;
  volumeExpansionFactor: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "concentration", label: "Concentration", kind: "number" },
  {
    id: "volumeExpansionFactor",
    label: "Volume expansion factor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.concentration >= 0);
  H.positive(i.volumeExpansionFactor);
  return H.finish({
    adjustedConcentration: i.concentration / i.volumeExpansionFactor,
  });
};
export const example = {
  input: { concentration: 10, volumeExpansionFactor: 2 },
  output: { result: { adjustedConcentration: 5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "convert/volume-basis-concentration-temperature-scale",
  title: "Conversion: Volume Basis Concentration Temperature Scale Tool",
  description:
    "Adjust a conserved-amount volume-basis concentration by an explicit state-to-state volume expansion factor; no thermal coefficient or material model inferred.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { adjustedConcentration: { type: "number" } },
        required: ["adjustedConcentration"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
