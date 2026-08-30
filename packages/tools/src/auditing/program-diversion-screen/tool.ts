import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly programPurchases: number;
  readonly eligiblePatientPurchases: number;
  readonly duplicateDiscountPurchases: number;
  readonly maximumExceptionPercent: number;
}>;
export type Output = Readonly<{
  readonly diversionAmount: number;
  readonly exceptionAmount: number;
  readonly exceptionPercent: number;
  readonly exceedsThreshold: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (input.eligiblePatientPurchases > input.programPurchases)
    simpleError(
      "eligiblePatientPurchases",
      "Eligible purchases cannot exceed program purchases.",
      "invalid_purchases",
    );
  const diversionAmount =
      input.programPurchases - input.eligiblePatientPurchases,
    exceptionAmount = diversionAmount + input.duplicateDiscountPurchases,
    exceptionPercent =
      input.programPurchases === 0
        ? 0
        : (exceptionAmount / input.programPurchases) * 100;
  return {
    diversionAmount,
    exceptionAmount,
    exceptionPercent,
    exceedsThreshold: exceptionPercent > input.maximumExceptionPercent,
  };
};

export const exampleInput = {
  programPurchases: 1000,
  eligiblePatientPurchases: 950,
  duplicateDiscountPurchases: 10,
  maximumExceptionPercent: 5,
} satisfies Input;
export const exampleOutput = {
  diversionAmount: 50,
  exceptionAmount: 60,
  exceptionPercent: 6,
  exceedsThreshold: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      programPurchases: input.programPurchases as number,
      eligiblePatientPurchases: input.eligiblePatientPurchases as number,
      duplicateDiscountPurchases: input.duplicateDiscountPurchases as number,
      maximumExceptionPercent: input.maximumExceptionPercent as number,
    }),
  description:
    "Screen program purchases for diversion and duplicate-discount exceptions.",
  id: "auditing/program-diversion-screen",
  inputs: [
    {
      id: "programPurchases",
      label: "Program purchases",
      kind: "number",
      minimum: 0,
    },
    {
      id: "eligiblePatientPurchases",
      label: "Eligible patient purchases",
      kind: "number",
      minimum: 0,
    },
    {
      id: "duplicateDiscountPurchases",
      label: "Duplicate-discount purchases",
      kind: "number",
      minimum: 0,
    },
    {
      id: "maximumExceptionPercent",
      label: "Maximum exception rate",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
  ],
  outputs: [
    {
      id: "diversionAmount",
      label: "Potential diversion amount",
      kind: "number",
      minimum: 0,
    },
    {
      id: "exceptionAmount",
      label: "Diversion plus duplicate discounts",
      kind: "number",
      minimum: 0,
    },
    {
      id: "exceptionPercent",
      label: "Exception rate",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
    {
      id: "exceedsThreshold",
      label: "Exceeds supplied threshold",
      kind: "boolean",
    },
  ],
  title: "Program Diversion Screen",
});

export const run = tool.execute;
export default tool;
