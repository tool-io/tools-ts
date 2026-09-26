import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  totalCurrent: number;
  branchResistance: number;
  otherConductance: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "totalCurrent", label: "Total current", kind: "number" },
  { id: "branchResistance", label: "Branch resistance", kind: "number" },
  { id: "otherConductance", label: "Other conductance", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.positive(i.branchResistance);
  H.check(i.otherConductance >= 0);
  return H.finish({
    branchCurrent:
      i.totalCurrent / (1 + i.branchResistance * i.otherConductance),
  });
};
export const example = {
  input: { totalCurrent: 6, branchResistance: 2, otherConductance: 1 },
  output: { result: { branchCurrent: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "electricity/resistor-conductance-weighted-current-share",
  title: "Electricity: Resistor Conductance Weighted Current Share Tool",
  description:
    "Compute one parallel-resistor branch current from total current, its resistance and the independently summed other-branch conductance; ideal resistive split only.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { branchCurrent: { type: "number" } },
        required: ["branchCurrent"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
