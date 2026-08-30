import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly qualifiedExpenditures: number;
  readonly creditRatePercent: number;
  readonly basisReductionPercent: number;
}>;
export type Output = Readonly<{
  readonly rehabilitationCredit: number;
  readonly basisReduction: number;
  readonly remainingBasis: number;
}>;

export const calculate = (input: Input): Output => {
  const rehabilitationCredit =
    (input.qualifiedExpenditures * input.creditRatePercent) / 100;
  const basisReduction =
    (rehabilitationCredit * input.basisReductionPercent) / 100;
  return {
    rehabilitationCredit,
    basisReduction,
    remainingBasis: input.qualifiedExpenditures - basisReduction,
  };
};

export const exampleInput = {
  qualifiedExpenditures: 1000,
  creditRatePercent: 20,
  basisReductionPercent: 100,
} satisfies Input;
export const exampleOutput = {
  rehabilitationCredit: 200,
  basisReduction: 200,
  remainingBasis: 800,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      qualifiedExpenditures: input.qualifiedExpenditures as number,
      creditRatePercent: input.creditRatePercent as number,
      basisReductionPercent: input.basisReductionPercent as number,
    }),
  description:
    "Estimate rehabilitation credit and basis reduction from caller-supplied rates.",
  id: "taxation/rehabilitation-credit",
  inputs: [
    {
      id: "qualifiedExpenditures",
      label: "Qualified rehabilitation expenditures",
      kind: "number",
      minimum: 0,
    },
    {
      id: "creditRatePercent",
      label: "Caller credit rate",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
    {
      id: "basisReductionPercent",
      label: "Caller basis-reduction percentage",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
  ],
  outputs: [
    {
      id: "rehabilitationCredit",
      label: "Estimated credit",
      kind: "number",
      minimum: 0,
    },
    {
      id: "basisReduction",
      label: "Basis reduction",
      kind: "number",
      minimum: 0,
    },
    {
      id: "remainingBasis",
      label: "Remaining qualified-expenditure basis",
      kind: "number",
      minimum: 0,
    },
  ],
  title: "Rehabilitation Credit",
});

export const run = tool.execute;
export default tool;
