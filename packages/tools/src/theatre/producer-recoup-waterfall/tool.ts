import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly grossRevenue: number;
  readonly operatingCosts: number;
  readonly investorCapital: number;
  readonly producerPointPercent: number;
}>;
export type Output = Readonly<{
  readonly netRevenue: number;
  readonly investorRecoupment: number;
  readonly remainingProfit: number;
  readonly producerPointPayment: number;
}>;

export const calculate = (input: Input): Output => {
  const netRevenue = Math.max(0, input.grossRevenue - input.operatingCosts),
    investorRecoupment = Math.min(netRevenue, input.investorCapital),
    remainingProfit = Math.max(0, netRevenue - investorRecoupment);
  return {
    netRevenue,
    investorRecoupment,
    remainingProfit,
    producerPointPayment: (remainingProfit * input.producerPointPercent) / 100,
  };
};

export const exampleInput = {
  grossRevenue: 1000,
  operatingCosts: 200,
  investorCapital: 500,
  producerPointPercent: 10,
} satisfies Input;
export const exampleOutput = {
  netRevenue: 800,
  investorRecoupment: 500,
  remainingProfit: 300,
  producerPointPayment: 30,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      grossRevenue: input.grossRevenue as number,
      operatingCosts: input.operatingCosts as number,
      investorCapital: input.investorCapital as number,
      producerPointPercent: input.producerPointPercent as number,
    }),
  description:
    "Apply a simple producer recoupment waterfall to supplied revenue and costs.",
  id: "theatre/producer-recoup-waterfall",
  inputs: [
    {
      id: "grossRevenue",
      label: "Gross producer revenue",
      kind: "number",
      minimum: 0,
    },
    {
      id: "operatingCosts",
      label: "Operating costs",
      kind: "number",
      minimum: 0,
    },
    {
      id: "investorCapital",
      label: "Unrecouped investor capital",
      kind: "number",
      minimum: 0,
    },
    {
      id: "producerPointPercent",
      label: "Producer point percentage",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
  ],
  outputs: [
    {
      id: "netRevenue",
      label: "Revenue after operating costs",
      kind: "number",
    },
    {
      id: "investorRecoupment",
      label: "Investor recoupment",
      kind: "number",
      minimum: 0,
    },
    {
      id: "remainingProfit",
      label: "Profit after recoupment",
      kind: "number",
      minimum: 0,
    },
    {
      id: "producerPointPayment",
      label: "Producer point payment",
      kind: "number",
      minimum: 0,
    },
  ],
  title: "Producer Recoup Waterfall",
});

export const run = tool.execute;
export default tool;
