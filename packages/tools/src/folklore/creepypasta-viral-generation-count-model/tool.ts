import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  bounded,
  sum,
  finite,
} from "../batch44-shared.js";

export type Input = Readonly<{
  readonly initialSeedReports: number;
  readonly independentlyAssumedNewReportsPerReport: number;
  readonly generations: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "initialSeedReports", label: "Initial seed reports", kind: "number" },
  {
    id: "independentlyAssumedNewReportsPerReport",
    label: "Independently assumed new reports per report",
    kind: "number",
  },
  { id: "generations", label: "Generations", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(input.initialSeedReports, "seeds", 0, 1000000);
  nonnegative(input.independentlyAssumedNewReportsPerReport, "reproduction");
  bounded(input.generations, "generations", 0, 64);
  const values = [input.initialSeedReports];
  for (let i = 0; i < input.generations; i++)
    values.push(
      finite(values.at(-1)! * input.independentlyAssumedNewReportsPerReport),
    );
  return {
    expectedNewReportsByGeneration: values,
    expectedCumulativeReports: sum(values),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    initialSeedReports: 2,
    independentlyAssumedNewReportsPerReport: 3,
    generations: 2,
  },
  output: {
    result: {
      expectedNewReportsByGeneration: [2, 6, 18],
      expectedCumulativeReports: 26,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/creepypasta-viral-generation-count-model",
  title: "Creepypasta Viral Generation Count Model",
  description:
    "Conditional branching expectation for creepypasta reports with constant independently assumed reproduction, no saturation or network overlap. Fractional expectations allowed; reports are not unique people or validated viral predictions.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
