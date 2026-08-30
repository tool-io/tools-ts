import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly eligiblePremiums: number;
  readonly creditRatePercent: number;
  readonly maximumCredit: number;
  readonly phaseoutPercent: number;
}>;
export type Output = Readonly<{
  readonly grossCredit: number;
  readonly creditAfterPhaseout: number;
}>;

export const calculate = (input: Input): Output => {
  const grossCredit = Math.min(
    input.maximumCredit,
    (input.eligiblePremiums * input.creditRatePercent) / 100,
  );
  return {
    grossCredit,
    creditAfterPhaseout: grossCredit * (1 - input.phaseoutPercent / 100),
  };
};

export const exampleInput = {
  eligiblePremiums: 40000,
  creditRatePercent: 50,
  maximumCredit: 18000,
  phaseoutPercent: 25,
} satisfies Input;
export const exampleOutput = {
  grossCredit: 18000,
  creditAfterPhaseout: 13500,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      eligiblePremiums: input.eligiblePremiums as number,
      creditRatePercent: input.creditRatePercent as number,
      maximumCredit: input.maximumCredit as number,
      phaseoutPercent: input.phaseoutPercent as number,
    }),
  description:
    "Calculate a small-business health credit from caller-supplied rate, cap, and phaseout.",
  id: "taxation/small-business-health-credit",
  inputs: [
    {
      id: "eligiblePremiums",
      label: "Eligible employer premiums",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
    {
      id: "creditRatePercent",
      label: "Credit rate",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
    {
      id: "maximumCredit",
      label: "Maximum credit",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
    {
      id: "phaseoutPercent",
      label: "Computed phaseout",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
  ],
  outputs: [
    {
      id: "grossCredit",
      label: "Gross credit",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
    {
      id: "creditAfterPhaseout",
      label: "Credit after phaseout",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
  ],
  title: "Small-Business Health Credit",
});

export const run = tool.execute;
export default tool;
