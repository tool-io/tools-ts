import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly reportedRoyaltySales: number;
  readonly posRecordedSales: number;
  readonly royaltyRatePercent: number;
  readonly differenceTolerance: number;
}>;
export type Output = Readonly<{
  readonly unreportedSales: number;
  readonly additionalRoyalty: number;
  readonly salesDifferencePercent: number;
  readonly withinTolerance: boolean;
}>;

export const calculate = (input: Input): Output => {
  const unreportedSales = input.posRecordedSales - input.reportedRoyaltySales;
  return {
    unreportedSales,
    additionalRoyalty:
      (Math.max(0, unreportedSales) * input.royaltyRatePercent) / 100,
    salesDifferencePercent:
      input.posRecordedSales === 0
        ? 0
        : (unreportedSales / input.posRecordedSales) * 100,
    withinTolerance: Math.abs(unreportedSales) <= input.differenceTolerance,
  };
};

export const exampleInput = {
  reportedRoyaltySales: 900,
  posRecordedSales: 1000,
  royaltyRatePercent: 5,
  differenceTolerance: 20,
} satisfies Input;
export const exampleOutput = {
  unreportedSales: 100,
  additionalRoyalty: 5,
  salesDifferencePercent: 10,
  withinTolerance: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      reportedRoyaltySales: input.reportedRoyaltySales as number,
      posRecordedSales: input.posRecordedSales as number,
      royaltyRatePercent: input.royaltyRatePercent as number,
      differenceTolerance: input.differenceTolerance as number,
    }),
  description:
    "Cross-check reported franchise royalty sales against POS records.",
  id: "auditing/franchise-sales-crosscheck",
  inputs: [
    {
      id: "reportedRoyaltySales",
      label: "Reported royalty sales",
      kind: "number",
      minimum: 0,
    },
    {
      id: "posRecordedSales",
      label: "POS-recorded sales",
      kind: "number",
      minimum: 0,
    },
    {
      id: "royaltyRatePercent",
      label: "Royalty rate",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
    {
      id: "differenceTolerance",
      label: "Sales difference tolerance",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "unreportedSales",
      label: "POS minus reported sales",
      kind: "number",
    },
    {
      id: "additionalRoyalty",
      label: "Additional royalty from positive difference",
      kind: "number",
      minimum: 0,
    },
    {
      id: "salesDifferencePercent",
      label: "Sales difference as POS share",
      kind: "number",
      unit: "%",
    },
    {
      id: "withinTolerance",
      label: "Within supplied sales tolerance",
      kind: "boolean",
    },
  ],
  title: "Franchise Sales Crosscheck",
});

export const run = tool.execute;
export default tool;
