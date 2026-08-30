import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LeasingCommissionInput = Readonly<{
  readonly firstYearAnnualRent: number;
  readonly commissionPercent: number;
}>;
export type LeasingCommissionOutput = Readonly<{
  readonly commission: number;
}>;

export const calculateLeasingCommission = (
  x: LeasingCommissionInput,
): LeasingCommissionOutput => {
  if (!Number.isFinite(x.firstYearAnnualRent) || x.firstYearAnnualRent < 0)
    simpleError("firstYearAnnualRent", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.commissionPercent) || x.commissionPercent < 0)
    simpleError("commissionPercent", "Provide a finite nonnegative number.");
  const commission = (x.firstYearAnnualRent * x.commissionPercent) / 100;
  if (!Number.isFinite(commission))
    simpleError(
      "commission",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { commission: Object.is(commission, -0) ? 0 : commission };
};

export const example = {
  input: {
    firstYearAnnualRent: 24000,
    commissionPercent: 5,
  },
  output: { commission: 1200 },
} satisfies ToolExample<LeasingCommissionInput, LeasingCommissionOutput>;

export const tool = createSimpleTool({
  id: "real-estate/leasing-commission",
  title: "Leasing Commission",
  description:
    "Leasing commission from first-year annual rent and a negotiated commission percentage.",
  inputs: [
    {
      id: "firstYearAnnualRent",
      kind: "number",
      label: "First Year Annual Rent",
      unit: "currency",
      minimum: 0,
    },
    {
      id: "commissionPercent",
      kind: "number",
      label: "Commission Percent",
      unit: "percent",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "commission", kind: "number", label: "Commission", unit: "currency" },
  ],
  calculate: (input) =>
    calculateLeasingCommission({
      firstYearAnnualRent: input.firstYearAnnualRent as number,
      commissionPercent: input.commissionPercent as number,
    }),
});
export const leasingCommissionTool = tool;
export const runLeasingCommission = tool.execute;
export default tool;
