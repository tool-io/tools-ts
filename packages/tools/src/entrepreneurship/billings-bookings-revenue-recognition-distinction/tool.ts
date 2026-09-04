import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, money, signedSum } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedBookingsMinor: number;
  readonly observedBillingsMinor: number;
  readonly observedRecognizedRevenueMinor: number;
  readonly callerMatchedContractPeriodVerified: boolean;
}>;
export type Output = Readonly<{
  readonly signedUnbilledBookingGapMinor: number;
  readonly signedBilledUnrecognizedGapMinor: number;
}>;
const inputFields = [
  {
    id: "observedBookingsMinor",
    label: "Observed bookings minor",
    kind: "number",
  },
  {
    id: "observedBillingsMinor",
    label: "Observed billings minor",
    kind: "number",
  },
  {
    id: "observedRecognizedRevenueMinor",
    label: "Observed recognized revenue minor",
    kind: "number",
  },
  {
    id: "callerMatchedContractPeriodVerified",
    label: "Caller matched contract period verified",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(input.observedBookingsMinor, "bookings");
  money(input.observedBillingsMinor, "billings");
  money(input.observedRecognizedRevenueMinor, "recognized revenue");
  if (!input.callerMatchedContractPeriodVerified)
    simpleError(
      "basis",
      "Same contract universe/period definitions independently verified.",
    );
  return {
    signedUnbilledBookingGapMinor: signedSum([
      input.observedBookingsMinor,
      -input.observedBillingsMinor,
    ]),
    signedBilledUnrecognizedGapMinor: signedSum([
      input.observedBillingsMinor,
      -input.observedRecognizedRevenueMinor,
    ]),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedBookingsMinor: 100,
  observedBillingsMinor: 80,
  observedRecognizedRevenueMinor: 60,
  callerMatchedContractPeriodVerified: true,
} satisfies Input;
export const exampleOutput = {
  signedUnbilledBookingGapMinor: 20,
  signedBilledUnrecognizedGapMinor: 20,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "entrepreneurship/billings-bookings-revenue-recognition-distinction",
  title: "Billings Bookings Revenue Recognition Distinction",
  description:
    "Actual exact bookings/billings/recognized revenue differences on independently reconciled universe; signed gaps not automatically receivables/deferred revenue or accrual recognition decision. Caller independently verifies policy, evidence, dates and applicability; not legal/compliance advice or causal business-success prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedUnbilledBookingGapMinor",
      label: "Signed unbilled booking gap minor",
      kind: "number",
    },
    {
      id: "signedBilledUnrecognizedGapMinor",
      label: "Signed billed unrecognized gap minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedBookingsMinor: value.observedBookingsMinor as number,
      observedBillingsMinor: value.observedBillingsMinor as number,
      observedRecognizedRevenueMinor:
        value.observedRecognizedRevenueMinor as number,
      callerMatchedContractPeriodVerified:
        value.callerMatchedContractPeriodVerified as boolean,
    }),
});
export const run = tool.execute;
export default tool;
