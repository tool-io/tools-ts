import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  pick,
  simpleError,
} from "../batch43-shared.js";

export type Input = Readonly<{
  readonly yearNumber: number;
  readonly era: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "yearNumber", label: "Year number", kind: "number" },
  { id: "era", label: "Era", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(input.yearNumber, "year", 1, 9999);
  const a = pick(
      input.era,
      { BCE: 1 - input.yearNumber, CE: input.yearNumber },
      "era",
    ),
    offset = a + 775;
  if (offset < 0)
    simpleError("year", "Epoch model starts 776 BCE; no pre-epoch Olympiad.");
  return {
    olympiad: Math.floor(offset / 4) + 1,
    yearWithinOlympiad: (offset % 4) + 1,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { yearNumber: 776, era: "BCE" },
  output: { result: { olympiad: 1, yearWithinOlympiad: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/olympiad-counting-year-system-lookup",
  title: "Olympiad Counting Year System Lookup",
  description:
    "Conventional four-year Olympiad arithmetic with first year 776 BCE and no civil year zero; nominal year labels only, not date-of-games or regional new-year conversion.",
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
