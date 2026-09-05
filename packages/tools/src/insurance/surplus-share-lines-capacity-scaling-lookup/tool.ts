import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  money,
  roundMinor,
} from "../batch45-shared.js";
export type Input = Readonly<{
  readonly retainedLineMinor: number;
  readonly surplusLines: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "retainedLineMinor", label: "Retained line minor", kind: "number" },
  { id: "surplusLines", label: "Surplus lines", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  money(input.retainedLineMinor, "line");
  bounded(input.surplusLines, "lines", 0, 1000000);
  return {
    surplusCapacityMinor: roundMinor(
      BigInt(input.retainedLineMinor) * BigInt(input.surplusLines),
      1n,
    ),
    totalCapacityMinor: roundMinor(
      BigInt(input.retainedLineMinor) * BigInt(input.surplusLines + 1),
      1n,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { retainedLineMinor: 10000, surplusLines: 4 },
  output: {
    result: { surplusCapacityMinor: 40000, totalCapacityMinor: 50000 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/surplus-share-lines-capacity-scaling-lookup",
  title: "Surplus Share Lines Capacity Scaling Lookup",
  description:
    "Conditional surplus-share maximum capacity for integer lines and one retained line. Exact safe integer minor units; actual treaty acceptance, policy limits and risk retention are independently verified, not placement eligibility.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
