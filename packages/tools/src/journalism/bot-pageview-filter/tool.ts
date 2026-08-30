import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly pageviews: readonly number[];
  readonly trafficClasses: readonly string[];
}>;
export type Output = Readonly<{
  readonly reportedPageviews: number;
  readonly filteredPageviews: number;
  readonly removedPageviews: number;
  readonly inflationPercent: number;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.pageviews.length === 0 ||
    input.pageviews.length !== input.trafficClasses.length ||
    input.pageviews.some((value) => value < 0)
  )
    simpleError(
      "pageviews",
      "Counts and classes must be nonempty, aligned, and nonnegative.",
      "invalid_rows",
    );
  const reportedPageviews = input.pageviews.reduce((a, b) => a + b, 0);
  const filteredPageviews = input.pageviews.reduce(
    (sum, value, index) =>
      input.trafficClasses[index].trim().toLowerCase() === "human"
        ? sum + value
        : sum,
    0,
  );
  const removedPageviews = reportedPageviews - filteredPageviews;
  return {
    reportedPageviews,
    filteredPageviews,
    removedPageviews,
    inflationPercent:
      filteredPageviews === 0
        ? reportedPageviews === 0
          ? 0
          : 100
        : (removedPageviews / filteredPageviews) * 100,
  };
};

export const exampleInput = {
  pageviews: [800, 150, 50],
  trafficClasses: ["human", "bot", "unknown"],
} satisfies Input;
export const exampleOutput = {
  reportedPageviews: 1000,
  filteredPageviews: 800,
  removedPageviews: 200,
  inflationPercent: 25,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      pageviews: input.pageviews as readonly number[],
      trafficClasses: input.trafficClasses as readonly string[],
    }),
  description:
    "Remove caller-classified automated and unknown traffic from pageview totals and quantify inflation.",
  id: "journalism/bot-pageview-filter",
  inputs: [
    { id: "pageviews", label: "Pageview counts", kind: "numberList" },
    { id: "trafficClasses", label: "Traffic classes", kind: "stringList" },
  ],
  outputs: [
    {
      id: "reportedPageviews",
      label: "Reported pageviews",
      kind: "number",
      minimum: 0,
    },
    {
      id: "filteredPageviews",
      label: "Filtered human pageviews",
      kind: "number",
      minimum: 0,
    },
    {
      id: "removedPageviews",
      label: "Removed automated pageviews",
      kind: "number",
      minimum: 0,
    },
    {
      id: "inflationPercent",
      label: "Reported-view inflation",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
  ],
  title: "Bot Pageview Filter",
});

export const run = tool.execute;
export default tool;
