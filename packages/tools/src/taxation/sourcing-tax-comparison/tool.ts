import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly serviceRevenue: number;
  readonly originRatePercent: number;
  readonly destinationRatePercent: number;
}>;
export type Output = Readonly<{
  readonly originSourcedTax: number;
  readonly destinationSourcedTax: number;
  readonly taxDifference: number;
}>;

export const calculate = (input: Input): Output => {
  const originSourcedTax =
    (input.serviceRevenue * input.originRatePercent) / 100;
  const destinationSourcedTax =
    (input.serviceRevenue * input.destinationRatePercent) / 100;
  return {
    originSourcedTax,
    destinationSourcedTax,
    taxDifference: destinationSourcedTax - originSourcedTax,
  };
};

export const exampleInput = {
  serviceRevenue: 1000,
  originRatePercent: 5,
  destinationRatePercent: 8,
} satisfies Input;
export const exampleOutput = {
  originSourcedTax: 50,
  destinationSourcedTax: 80,
  taxDifference: 30,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      serviceRevenue: input.serviceRevenue as number,
      originRatePercent: input.originRatePercent as number,
      destinationRatePercent: input.destinationRatePercent as number,
    }),
  description:
    "Compare origin- and destination-sourced tax using caller-supplied rates.",
  id: "taxation/sourcing-tax-comparison",
  inputs: [
    {
      id: "serviceRevenue",
      label: "Service revenue",
      kind: "number",
      minimum: 0,
    },
    {
      id: "originRatePercent",
      label: "Origin jurisdiction rate",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
    {
      id: "destinationRatePercent",
      label: "Destination jurisdiction rate",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
  ],
  outputs: [
    {
      id: "originSourcedTax",
      label: "Origin-sourced tax",
      kind: "number",
      minimum: 0,
    },
    {
      id: "destinationSourcedTax",
      label: "Destination-sourced tax",
      kind: "number",
      minimum: 0,
    },
    {
      id: "taxDifference",
      label: "Destination minus origin tax",
      kind: "number",
    },
  ],
  title: "Sourcing Tax Comparison",
});

export const run = tool.execute;
export default tool;
