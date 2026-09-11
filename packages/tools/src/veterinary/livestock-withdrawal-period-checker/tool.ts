import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  daysBetween,
  shiftDate,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly actualLastTreatmentDate: string;
  readonly callerVerifiedApplicableWithdrawalDays: number;
  readonly plannedFoodProductReleaseDate: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualLastTreatmentDate",
    label: "Actual last treatment date",
    kind: "string",
  },
  {
    id: "callerVerifiedApplicableWithdrawalDays",
    label: "Caller verified applicable withdrawal days",
    kind: "number",
  },
  {
    id: "plannedFoodProductReleaseDate",
    label: "Planned food product release date",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(
    input.callerVerifiedApplicableWithdrawalDays,
    "verified-period",
    0,
    36500,
  );
  const release = shiftDate(
    input.actualLastTreatmentDate,
    input.callerVerifiedApplicableWithdrawalDays,
  );
  return {
    conditionalCallerCalendarReleaseDate: release,
    signedDaysAfterCallerCalendarRelease: daysBetween(
      release,
      input.plannedFoodProductReleaseDate,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualLastTreatmentDate: "2026-01-01",
    callerVerifiedApplicableWithdrawalDays: 10,
    plannedFoodProductReleaseDate: "2026-01-12",
  },
  output: {
    result: {
      conditionalCallerCalendarReleaseDate: "2026-01-11",
      signedDaysAfterCallerCalendarRelease: 1,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "veterinary/livestock-withdrawal-period-checker",
  title: "Livestock Withdrawal Period Checker",
  description:
    "Calendar-day bookkeeping from independently verified actual last treatment and independently legally/veterinarily applicable product/species/route withdrawal period. Clock-time, dosing, repeated exposure, jurisdiction and food-product rules external; not residue-free, safe/legal release certification.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
