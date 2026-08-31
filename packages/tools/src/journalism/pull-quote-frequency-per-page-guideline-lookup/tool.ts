import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, unique, bounded } from "../batch-shared.js";
export type Input = Readonly<{
  readonly pageIds: readonly string[];
  readonly observedPullQuotePageIds: readonly string[];
  readonly callerMaximumPullQuotesPerPage: number;
}>;
export type Output = Readonly<{
  readonly pullQuoteCountsByPage: readonly number[];
  readonly pagesExceedingCallerQuotePolicy: readonly string[];
  readonly pullQuoteRecordsOnUnknownPages: readonly string[];
}>;
const inputFields = [
  { id: "pageIds", label: "Page ids", kind: "stringList" },
  {
    id: "observedPullQuotePageIds",
    label: "Observed pull quote page ids",
    kind: "stringList",
  },
  {
    id: "callerMaximumPullQuotesPerPage",
    label: "Caller maximum pull quotes per page",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  unique(input.pageIds, "pages");
  bounded(input.callerMaximumPullQuotesPerPage, "maximum", 0, 128);
  const counts = input.pageIds.map(
    (s) => input.observedPullQuotePageIds.filter((v) => v === s).length,
  );
  return {
    pullQuoteCountsByPage: counts,
    pagesExceedingCallerQuotePolicy: input.pageIds.filter(
      (_, i) => counts[i] > input.callerMaximumPullQuotesPerPage,
    ),
    pullQuoteRecordsOnUnknownPages: input.observedPullQuotePageIds.filter(
      (s) => !input.pageIds.includes(s),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  pageIds: ["A", "B", "C"],
  observedPullQuotePageIds: ["A", "A", "B"],
  callerMaximumPullQuotesPerPage: 1,
} satisfies Input;
export const exampleOutput = {
  pullQuoteCountsByPage: [2, 1, 0],
  pagesExceedingCallerQuotePolicy: ["A"],
  pullQuoteRecordsOnUnknownPages: [],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "journalism/pull-quote-frequency-per-page-guideline-lookup",
  title: "Pull Quote Frequency per Page Guideline Lookup",
  description:
    "Audit actual quote-placement records per known page and unknown-page references under caller cap; no static pullquote frequency, inferred page layout or repeated quote deduplication without record evidence.",
  inputs: inputFields,
  outputs: [
    {
      id: "pullQuoteCountsByPage",
      label: "Pull quote counts by page",
      kind: "numberList",
    },
    {
      id: "pagesExceedingCallerQuotePolicy",
      label: "Pages exceeding caller quote policy",
      kind: "stringList",
    },
    {
      id: "pullQuoteRecordsOnUnknownPages",
      label: "Pull quote records on unknown pages",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      pageIds: value.pageIds as readonly string[],
      observedPullQuotePageIds:
        value.observedPullQuotePageIds as readonly string[],
      callerMaximumPullQuotesPerPage:
        value.callerMaximumPullQuotesPerPage as number,
    }),
});
export const run = tool.execute;
export default tool;
