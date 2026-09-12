import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  nonnegative,
  daysBetween,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualCurrentQuantityUnits: number;
  readonly callerClinicianPrescribedUnitsPerDay: number;
  readonly actualInventoryAsOfDate: string;
  readonly callerNextRecordedFillDate: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualCurrentQuantityUnits",
    label: "Actual current quantity units",
    kind: "number",
  },
  {
    id: "callerClinicianPrescribedUnitsPerDay",
    label: "Caller clinician prescribed units per day",
    kind: "number",
  },
  {
    id: "actualInventoryAsOfDate",
    label: "Actual inventory as of date",
    kind: "string",
  },
  {
    id: "callerNextRecordedFillDate",
    label: "Caller next recorded fill date",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.actualCurrentQuantityUnits, "quantity");
  positive(input.callerClinicianPrescribedUnitsPerDay, "actualdirections");
  const d = daysBetween(
    input.actualInventoryAsOfDate,
    input.callerNextRecordedFillDate,
  );
  if (d < 0) simpleError("dates", "Actualnextfillnotbeforeasof.");
  const s =
    input.actualCurrentQuantityUnits /
    input.callerClinicianPrescribedUnitsPerDay;
  return {
    recordedDaysUntilNextFill: d,
    conditionalAvailableSupplyDays: s,
    signedSupplyMinusDaysToNextFill: s - d,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualCurrentQuantityUnits: 10,
    callerClinicianPrescribedUnitsPerDay: 2,
    actualInventoryAsOfDate: "2026-01-01",
    callerNextRecordedFillDate: "2026-01-07",
  },
  output: {
    result: {
      recordedDaysUntilNextFill: 6,
      conditionalAvailableSupplyDays: 5,
      signedSupplyMinusDaysToNextFill: -1,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pharmacy/refills-until-next-fill-date",
  title: "Refills Until Next Fill Calculator",
  description:
    "Actual supply ledger and recorded next fill date discrepancy, no refill authorization, controlled substance eligibility, route/frequency changes or guarantee of fill.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
