import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  money,
  sumMoney,
  bounded,
  weightedMinor,
  dateDay,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly callerPenaltyWindowStartDate: string;
  readonly callerExclusivePenaltyExpiryDate: string;
  readonly prepaymentDate: string;
  readonly principalPrepaidMinor: number;
  readonly callerPenaltyBasisPoints: number;
  readonly callerFixedPenaltyMinor: number;
}>;
export type Output = Readonly<{
  readonly withinDeclaredPrepaymentPenaltyWindow: boolean;
  readonly modeledContractPrepaymentPenaltyMinor: number;
}>;
const inputFields = [
  {
    id: "callerPenaltyWindowStartDate",
    label: "Caller penalty window start date",
    kind: "string",
  },
  {
    id: "callerExclusivePenaltyExpiryDate",
    label: "Caller exclusive penalty expiry date",
    kind: "string",
  },
  { id: "prepaymentDate", label: "Prepayment date", kind: "string" },
  {
    id: "principalPrepaidMinor",
    label: "Principal prepaid minor",
    kind: "number",
  },
  {
    id: "callerPenaltyBasisPoints",
    label: "Caller penalty basis points",
    kind: "number",
  },
  {
    id: "callerFixedPenaltyMinor",
    label: "Caller fixed penalty minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(input.principalPrepaidMinor, "principalPrepaidMinor");
  money(input.callerFixedPenaltyMinor, "callerFixedPenaltyMinor");
  const start = dateDay(input.callerPenaltyWindowStartDate),
    end = dateDay(input.callerExclusivePenaltyExpiryDate),
    date = dateDay(input.prepaymentDate);
  if (end <= start || date < start)
    simpleError(
      "dates",
      "Positive caller penalty window and no prepayment before loan-window start required.",
    );
  bounded(input.callerPenaltyBasisPoints, "rate", 0, 10000);
  const within = date < end,
    penalty =
      within && input.principalPrepaidMinor > 0
        ? sumMoney([
            weightedMinor(
              input.principalPrepaidMinor,
              input.callerPenaltyBasisPoints,
              10000,
            ),
            input.callerFixedPenaltyMinor,
          ])
        : 0;
  return {
    withinDeclaredPrepaymentPenaltyWindow: within,
    modeledContractPrepaymentPenaltyMinor: penalty,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerPenaltyWindowStartDate: "2025-01-01",
  callerExclusivePenaltyExpiryDate: "2025-03-01",
  prepaymentDate: "2025-02-28",
  principalPrepaidMinor: 1000,
  callerPenaltyBasisPoints: 200,
  callerFixedPenaltyMinor: 10,
} satisfies Input;
export const exampleOutput = {
  withinDeclaredPrepaymentPenaltyWindow: true,
  modeledContractPrepaymentPenaltyMinor: 30,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/prepayment-penalty-window-checker",
  title: "Prepayment Penalty Window Checker",
  description:
    "Audit explicit [start, exclusive expiry) contractual prepayment window and caller percentage/fixed fee; zero prepayment carries no fixed fee, no determination that penalty is legally enforceable or allowed for this loan.",
  inputs: inputFields,
  outputs: [
    {
      id: "withinDeclaredPrepaymentPenaltyWindow",
      label: "Within declared prepayment penalty window",
      kind: "boolean",
    },
    {
      id: "modeledContractPrepaymentPenaltyMinor",
      label: "Modeled contract prepayment penalty minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerPenaltyWindowStartDate:
        value.callerPenaltyWindowStartDate as string,
      callerExclusivePenaltyExpiryDate:
        value.callerExclusivePenaltyExpiryDate as string,
      prepaymentDate: value.prepaymentDate as string,
      principalPrepaidMinor: value.principalPrepaidMinor as number,
      callerPenaltyBasisPoints: value.callerPenaltyBasisPoints as number,
      callerFixedPenaltyMinor: value.callerFixedPenaltyMinor as number,
    }),
});
export const run = tool.execute;
export default tool;
