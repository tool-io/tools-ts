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
  readonly queryYear: number;
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
  { id: "queryYear", label: "Query year", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  unique(input.callerRulerIds, "rulers");
  aligned(input.callerRulerIds, input.verifiedStartYears, "starts");
  aligned(input.callerRulerIds, input.verifiedEndYearsExclusive, "ends");
  bounded(input.queryYear, "query", 1, 9999);
  input.verifiedStartYears.forEach((v, i) => {
    bounded(v, "start", 1, 9999);
    bounded(input.verifiedEndYearsExclusive[i], "end", v + 1, 10000);
  });
  return {
    matchingRulerIds: input.callerRulerIds.filter(
      (_, i) =>
        input.queryYear >= input.verifiedStartYears[i] &&
        input.queryYear < input.verifiedEndYearsExclusive[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerRulerIds: ["a", "b", "c"],
    verifiedStartYears: [96, 98, 98],
    verifiedEndYearsExclusive: [98, 117, 100],
    queryYear: 99,
  },
  output: { result: { matchingRulerIds: ["b", "c"] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/roman-emperor-by-year-imperial-list-lookup",
  title: "Roman Emperor by Year Imperial List Lookup",
  description:
    "Match every caller verified imperial year interval using half-open positive-CE bounds, retaining co-rule and rival overlaps; no invented complete imperial list or partial-year date inference.",
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
