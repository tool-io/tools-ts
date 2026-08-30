import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly taxableTanningCharges: number;
  readonly exciseRatePercent: number;
}>;
export type Output = Readonly<{
  readonly exciseTax: number;
  readonly customerTotal: number;
}>;

export const calculate = (input: Input): Output => {
  const exciseTax =
    (input.taxableTanningCharges * input.exciseRatePercent) / 100;
  return { exciseTax, customerTotal: input.taxableTanningCharges + exciseTax };
};

export const exampleInput = {
  taxableTanningCharges: 120,
  exciseRatePercent: 10,
} satisfies Input;
export const exampleOutput = {
  exciseTax: 12,
  customerTotal: 132,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      taxableTanningCharges: input.taxableTanningCharges as number,
      exciseRatePercent: input.exciseRatePercent as number,
    }),
  description:
    "Calculate tanning-service excise tax using a caller-supplied rate.",
  id: "taxation/tanning-excise-tax",
  inputs: [
    {
      id: "taxableTanningCharges",
      label: "Taxable tanning charges",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
    {
      id: "exciseRatePercent",
      label: "Excise rate",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
  ],
  outputs: [
    {
      id: "exciseTax",
      label: "Excise tax",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
    {
      id: "customerTotal",
      label: "Charges plus excise",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
  ],
  title: "Tanning Excise Tax",
});

export const run = tool.execute;
export default tool;
