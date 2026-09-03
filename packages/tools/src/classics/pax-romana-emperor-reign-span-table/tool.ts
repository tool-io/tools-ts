import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  aligned,
  unique,
} from "../batch43-shared.js";

export type Input = Readonly<{
  readonly callerRulerIds: readonly string[];
  readonly verifiedStartYears: readonly number[];
  readonly verifiedEndYearsExclusive: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "callerRulerIds", label: "Caller ruler ids", kind: "stringList" },
  {
    id: "verifiedStartYears",
    label: "Verified start years",
    kind: "numberList",
  },
  {
    id: "verifiedEndYearsExclusive",
    label: "Verified end years exclusive",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  unique(input.callerRulerIds, "rulers");
  aligned(input.callerRulerIds, input.verifiedStartYears, "starts");
  aligned(input.callerRulerIds, input.verifiedEndYearsExclusive, "ends");
  input.verifiedStartYears.forEach((v, i) => {
    bounded(v, "start", 1, 9999);
    bounded(input.verifiedEndYearsExclusive[i], "end", v, 10000);
  });
  return {
    reignSpanYears: input.verifiedStartYears.map(
      (v, i) => input.verifiedEndYearsExclusive[i] - v,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerRulerIds: ["a", "b"],
    verifiedStartYears: [96, 98],
    verifiedEndYearsExclusive: [98, 117],
  },
  output: { result: { reignSpanYears: [2, 19] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/pax-romana-emperor-reign-span-table",
  title: "Pax Romana Emperor Reign Span Table",
  description:
    "Calculate caller verified imperial reign spans with explicit positive-CE half-open nominal year bounds; no PaxRomana definition, exact date duration or historical list fabricated.",
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
