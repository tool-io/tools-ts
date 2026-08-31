import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  dateDay,
  addDays,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly stopPaymentEffectiveDate: string;
  readonly callerValidCivilDays: number;
  readonly asOfDate: string;
}>;
export type Output = Readonly<{
  readonly exclusiveStopPaymentExpiryDate: string;
  readonly signedCivilDaysUntilExpiry: number;
  readonly withinDeclaredStopPaymentWindow: boolean;
}>;
const inputFields = [
  {
    id: "stopPaymentEffectiveDate",
    label: "Stop payment effective date",
    kind: "string",
  },
  {
    id: "callerValidCivilDays",
    label: "Caller valid civil days",
    kind: "number",
  },
  { id: "asOfDate", label: "As of date", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  bounded(input.callerValidCivilDays, "days", 1, 3660);
  const start = dateDay(input.stopPaymentEffectiveDate),
    today = dateDay(input.asOfDate),
    expiry = addDays(
      input.stopPaymentEffectiveDate,
      input.callerValidCivilDays,
    );
  return {
    exclusiveStopPaymentExpiryDate: expiry,
    signedCivilDaysUntilExpiry: dateDay(expiry) - today,
    withinDeclaredStopPaymentWindow: today >= start && today < dateDay(expiry),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  stopPaymentEffectiveDate: "2025-01-01",
  callerValidCivilDays: 30,
  asOfDate: "2025-01-30",
} satisfies Input;
export const exampleOutput = {
  exclusiveStopPaymentExpiryDate: "2025-01-31",
  signedCivilDaysUntilExpiry: 1,
  withinDeclaredStopPaymentWindow: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/stop-payment-duration-lookup",
  title: "Stop Payment Duration Lookup",
  description:
    "Audit caller civil-day stop-payment validity as [effective, exclusive expiry), not assumed bank-specific renewal duration, check payment prevention guarantee or legal effectiveness.",
  inputs: inputFields,
  outputs: [
    {
      id: "exclusiveStopPaymentExpiryDate",
      label: "Exclusive stop payment expiry date",
      kind: "string",
    },
    {
      id: "signedCivilDaysUntilExpiry",
      label: "Signed civil days until expiry",
      kind: "number",
    },
    {
      id: "withinDeclaredStopPaymentWindow",
      label: "Within declared stop payment window",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      stopPaymentEffectiveDate: value.stopPaymentEffectiveDate as string,
      callerValidCivilDays: value.callerValidCivilDays as number,
      asOfDate: value.asOfDate as string,
    }),
});
export const run = tool.execute;
export default tool;
