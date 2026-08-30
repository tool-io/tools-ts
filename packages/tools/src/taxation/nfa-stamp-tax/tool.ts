import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly standardItemCount: number;
  readonly standardStampAmount: number;
  readonly reducedItemCount: number;
  readonly reducedStampAmount: number;
}>;
export type Output = Readonly<{
  readonly standardTax: number;
  readonly reducedTax: number;
  readonly totalStampTax: number;
}>;

export const calculate = (input: Input): Output => {
  const standardTax = input.standardItemCount * input.standardStampAmount;
  const reducedTax = input.reducedItemCount * input.reducedStampAmount;
  return { standardTax, reducedTax, totalStampTax: standardTax + reducedTax };
};

export const exampleInput = {
  standardItemCount: 2,
  standardStampAmount: 200,
  reducedItemCount: 1,
  reducedStampAmount: 5,
} satisfies Input;
export const exampleOutput = {
  standardTax: 400,
  reducedTax: 5,
  totalStampTax: 405,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      standardItemCount: input.standardItemCount as number,
      standardStampAmount: input.standardStampAmount as number,
      reducedItemCount: input.reducedItemCount as number,
      reducedStampAmount: input.reducedStampAmount as number,
    }),
  description:
    "Calculate NFA stamp tax using caller-supplied category amounts.",
  id: "taxation/nfa-stamp-tax",
  inputs: [
    {
      id: "standardItemCount",
      label: "Standard taxed item count",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "standardStampAmount",
      label: "Standard stamp amount",
      kind: "number",
      minimum: 0,
    },
    {
      id: "reducedItemCount",
      label: "Reduced-rate item count",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "reducedStampAmount",
      label: "Reduced stamp amount",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "standardTax",
      label: "Standard-category tax",
      kind: "number",
      minimum: 0,
    },
    {
      id: "reducedTax",
      label: "Reduced-category tax",
      kind: "number",
      minimum: 0,
    },
    {
      id: "totalStampTax",
      label: "Total stamp tax",
      kind: "number",
      minimum: 0,
    },
  ],
  title: "NFA Stamp Tax",
});

export const run = tool.execute;
export default tool;
