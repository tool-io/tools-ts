import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  integer,
  money,
  bounded,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly programmaticPageviews: number;
  readonly programmaticNetRevenueMinor: number;
  readonly directServedImpressions: number;
  readonly directGrossRevenueMinor: number;
  readonly directSellingCostsMinor: number;
}>;
export type Output = Readonly<{
  readonly observedProgrammaticNetRpmMinor: number;
  readonly observedDirectNetCpmMinor: number;
  readonly observedDirectImpressionsPerProgrammaticPageview: number;
  readonly directRevenueNormalizedToProgrammaticPageviewsMinor: number;
}>;
const inputFields = [
  {
    id: "programmaticPageviews",
    label: "Programmatic pageviews",
    kind: "number",
  },
  {
    id: "programmaticNetRevenueMinor",
    label: "Programmatic net revenue minor",
    kind: "number",
  },
  {
    id: "directServedImpressions",
    label: "Direct served impressions",
    kind: "number",
  },
  {
    id: "directGrossRevenueMinor",
    label: "Direct gross revenue minor",
    kind: "number",
  },
  {
    id: "directSellingCostsMinor",
    label: "Direct selling costs minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  bounded(input.programmaticPageviews, "pageviews", 1, 1000000000);
  bounded(input.directServedImpressions, "impressions", 1, 1000000000);
  money(input.programmaticNetRevenueMinor, "revenue");
  money(input.directGrossRevenueMinor, "revenue");
  money(input.directSellingCostsMinor, "cost");
  const direct = integer(
    input.directGrossRevenueMinor - input.directSellingCostsMinor,
    "netRevenue",
  );
  return {
    observedProgrammaticNetRpmMinor:
      1000 * (input.programmaticNetRevenueMinor / input.programmaticPageviews),
    observedDirectNetCpmMinor: 1000 * (direct / input.directServedImpressions),
    observedDirectImpressionsPerProgrammaticPageview:
      input.directServedImpressions / input.programmaticPageviews,
    directRevenueNormalizedToProgrammaticPageviewsMinor:
      1000 * (direct / input.programmaticPageviews),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  programmaticPageviews: 1000,
  programmaticNetRevenueMinor: 1000,
  directServedImpressions: 500,
  directGrossRevenueMinor: 2000,
  directSellingCostsMinor: 500,
} satisfies Input;
export const exampleOutput = {
  observedProgrammaticNetRpmMinor: 1000,
  observedDirectNetCpmMinor: 3000,
  observedDirectImpressionsPerProgrammaticPageview: 0.5,
  directRevenueNormalizedToProgrammaticPageviewsMinor: 1500,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "journalism/programmatic-rpm-vs-direct-cpm-compare",
  title: "Programmatic RPM vs Direct CPM Compare",
  description:
    "Audit realized programmatic pageview RPM versus direct impression CPM with direct net selling costs and explicit denominator bridge; no assumption RPM and CPM denominators are interchangeable or future fill/yield guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedProgrammaticNetRpmMinor",
      label: "Observed programmatic net rpm minor",
      kind: "number",
    },
    {
      id: "observedDirectNetCpmMinor",
      label: "Observed direct net cpm minor",
      kind: "number",
    },
    {
      id: "observedDirectImpressionsPerProgrammaticPageview",
      label: "Observed direct impressions per programmatic pageview",
      kind: "number",
    },
    {
      id: "directRevenueNormalizedToProgrammaticPageviewsMinor",
      label: "Direct revenue normalized to programmatic pageviews minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      programmaticPageviews: value.programmaticPageviews as number,
      programmaticNetRevenueMinor: value.programmaticNetRevenueMinor as number,
      directServedImpressions: value.directServedImpressions as number,
      directGrossRevenueMinor: value.directGrossRevenueMinor as number,
      directSellingCostsMinor: value.directSellingCostsMinor as number,
    }),
});
export const run = tool.execute;
export default tool;
