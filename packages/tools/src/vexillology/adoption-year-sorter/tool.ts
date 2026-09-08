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
  readonly flagDesignIds: readonly string[];
  readonly callerVerifiedAdoptionYears: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "flagDesignIds", label: "Flag design ids", kind: "stringList" },
  {
    id: "callerVerifiedAdoptionYears",
    label: "Caller verified adoption years",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  unique(input.flagDesignIds, "designs");
  aligned(input.flagDesignIds, input.callerVerifiedAdoptionYears, "years");
  input.callerVerifiedAdoptionYears.forEach((v) =>
    bounded(v, "CE year", 1, 9999),
  );
  const indices = input.flagDesignIds
    .map((_, i) => i)
    .sort(
      (a, b) =>
        input.callerVerifiedAdoptionYears[a] -
          input.callerVerifiedAdoptionYears[b] || a - b,
    );
  return {
    sortedDesignIds: indices.map((i) => input.flagDesignIds[i]),
    sortedYears: indices.map((i) => input.callerVerifiedAdoptionYears[i]),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    flagDesignIds: ["a", "b", "c"],
    callerVerifiedAdoptionYears: [2000, 1900, 2000],
  },
  output: {
    result: {
      sortedDesignIds: ["b", "a", "c"],
      sortedYears: [1900, 2000, 2000],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vexillology/adoption-year-sorter",
  title: "Historical Adoption Year Sorter",
  description:
    "Stable chronological order of independently verified positive-CE adoption years, retaining caller order for equal-year ties; no live national adoption catalogue.",
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
