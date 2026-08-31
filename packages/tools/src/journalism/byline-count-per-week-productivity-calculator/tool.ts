import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  unique,
  dateDay,
  bounded,
  aligned,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly articleIds: readonly string[];
  readonly publicationDates: readonly string[];
  readonly windowStartDate: string;
  readonly windowWeekCount: number;
}>;
export type Output = Readonly<{
  readonly bylineCountsBySevenDayBin: readonly number[];
  readonly observedArticlesOutsideWindow: readonly string[];
}>;
const inputFields = [
  { id: "articleIds", label: "Article ids", kind: "stringList" },
  { id: "publicationDates", label: "Publication dates", kind: "stringList" },
  { id: "windowStartDate", label: "Window start date", kind: "string" },
  { id: "windowWeekCount", label: "Window week count", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(input.articleIds, input.publicationDates, "articleIds");
  unique(input.articleIds, "articles");
  bounded(input.windowWeekCount, "weeks", 1, 128);
  const start = dateDay(input.windowStartDate),
    counts = Array<number>(input.windowWeekCount).fill(0),
    outside: string[] = [];
  input.publicationDates.forEach((d, i) => {
    const n = Math.floor((dateDay(d) - start) / 7);
    if (n < 0 || n >= counts.length) outside.push(input.articleIds[i]);
    else counts[n]++;
  });
  return {
    bylineCountsBySevenDayBin: counts,
    observedArticlesOutsideWindow: outside,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  articleIds: ["a", "b", "c"],
  publicationDates: ["2025-01-01", "2025-01-07", "2025-01-08"],
  windowStartDate: "2025-01-01",
  windowWeekCount: 2,
} satisfies Input;
export const exampleOutput = {
  bylineCountsBySevenDayBin: [2, 1],
  observedArticlesOutsideWindow: [],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "journalism/byline-count-per-week-productivity-calculator",
  title: "Byline Count per Week Productivity Calculator",
  description:
    "Count actual distinct publication records in caller anchored seven-day bins, exposing out-of-window articles; not inferred ISO-week numbering, author credit allocation, productivity quality or an average of unobserved weeks.",
  inputs: inputFields,
  outputs: [
    {
      id: "bylineCountsBySevenDayBin",
      label: "Byline counts by seven day bin",
      kind: "numberList",
    },
    {
      id: "observedArticlesOutsideWindow",
      label: "Observed articles outside window",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      articleIds: value.articleIds as readonly string[],
      publicationDates: value.publicationDates as readonly string[],
      windowStartDate: value.windowStartDate as string,
      windowWeekCount: value.windowWeekCount as number,
    }),
});
export const run = tool.execute;
export default tool;
