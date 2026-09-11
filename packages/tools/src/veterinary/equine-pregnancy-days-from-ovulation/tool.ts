import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  daysBetween,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyEstablishedOvulationDate: string;
  readonly asOfDate: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyEstablishedOvulationDate",
    label: "Independently established ovulation date",
    kind: "string",
  },
  { id: "asOfDate", label: "As of date", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  const d = daysBetween(
    input.independentlyEstablishedOvulationDate,
    input.asOfDate,
  );
  nonnegative(d, "elapsed");
  return { observedDaysSinceEquineOvulation: d };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyEstablishedOvulationDate: "2026-01-01",
    asOfDate: "2026-02-01",
  },
  output: { result: { observedDaysSinceEquineOvulation: 31 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "veterinary/equine-pregnancy-days-from-ovulation",
  title: "Equine Pregnancy Days From Ovulation Calculator",
  description:
    "Actual independently established equine ovulation calendar age, not proof conception, pregnancy viability or fetal maturity.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
