import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly indexStartValue: number;
  readonly indexEndValue: number;
  readonly participationRatePercent: number;
  readonly creditingCapPercent: number;
  readonly floorPercent: number;
  readonly accountValue: number;
}>;
export type Output = Readonly<{
  readonly indexReturnPercent: number;
  readonly participatedReturnPercent: number;
  readonly creditedRatePercent: number;
  readonly interestCredit: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.indexStartValue <= 0)
    simpleError(
      "indexStartValue",
      "Index start value must be positive.",
      "invalid_index",
    );
  const indexReturnPercent =
      (input.indexEndValue / input.indexStartValue - 1) * 100,
    participatedReturnPercent =
      (indexReturnPercent * input.participationRatePercent) / 100,
    creditedRatePercent = Math.max(
      input.floorPercent,
      Math.min(input.creditingCapPercent, participatedReturnPercent),
    );
  return {
    indexReturnPercent,
    participatedReturnPercent,
    creditedRatePercent,
    interestCredit: (input.accountValue * creditedRatePercent) / 100,
  };
};

export const exampleInput = {
  indexStartValue: 100,
  indexEndValue: 120,
  participationRatePercent: 50,
  creditingCapPercent: 8,
  floorPercent: 0,
  accountValue: 100000,
} satisfies Input;
export const exampleOutput = {
  indexReturnPercent: 19.999999999999996,
  participatedReturnPercent: 9.999999999999998,
  creditedRatePercent: 8,
  interestCredit: 8000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      indexStartValue: input.indexStartValue as number,
      indexEndValue: input.indexEndValue as number,
      participationRatePercent: input.participationRatePercent as number,
      creditingCapPercent: input.creditingCapPercent as number,
      floorPercent: input.floorPercent as number,
      accountValue: input.accountValue as number,
    }),
  description:
    "Apply participation, cap, and floor to an indexed-annuity return.",
  id: "insurance/indexed-annuity-credit",
  inputs: [
    {
      id: "indexStartValue",
      label: "Index start value",
      kind: "number",
      minimum: 0,
    },
    {
      id: "indexEndValue",
      label: "Index end value",
      kind: "number",
      minimum: 0,
    },
    {
      id: "participationRatePercent",
      label: "Participation rate",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
    {
      id: "creditingCapPercent",
      label: "Crediting cap",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
    { id: "floorPercent", label: "Crediting floor", kind: "number", unit: "%" },
    { id: "accountValue", label: "Account value", kind: "number", minimum: 0 },
  ],
  outputs: [
    {
      id: "indexReturnPercent",
      label: "Index return",
      kind: "number",
      unit: "%",
    },
    {
      id: "participatedReturnPercent",
      label: "Participated return",
      kind: "number",
      unit: "%",
    },
    {
      id: "creditedRatePercent",
      label: "Credited rate",
      kind: "number",
      unit: "%",
    },
    { id: "interestCredit", label: "Interest credit", kind: "number" },
  ],
  title: "Indexed-Annuity Credit",
});

export const run = tool.execute;
export default tool;
