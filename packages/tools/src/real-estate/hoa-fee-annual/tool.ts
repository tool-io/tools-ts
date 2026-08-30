import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HoaFeeAnnualInput = Readonly<{
  readonly monthlyHoaFee: number;
}>;
export type HoaFeeAnnualOutput = Readonly<{
  readonly annualHoaFee: number;
}>;

export const calculateHoaFeeAnnual = (
  x: HoaFeeAnnualInput,
): HoaFeeAnnualOutput => {
  if (!Number.isFinite(x.monthlyHoaFee) || x.monthlyHoaFee < 0)
    simpleError("monthlyHoaFee", "Provide a finite nonnegative number.");
  const annualHoaFee = 12 * x.monthlyHoaFee;
  if (!Number.isFinite(annualHoaFee))
    simpleError(
      "annualHoaFee",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { annualHoaFee: Object.is(annualHoaFee, -0) ? 0 : annualHoaFee };
};

export const example = {
  input: {
    monthlyHoaFee: 200,
  },
  output: { annualHoaFee: 2400 },
} satisfies ToolExample<HoaFeeAnnualInput, HoaFeeAnnualOutput>;

export const tool = createSimpleTool({
  id: "real-estate/hoa-fee-annual",
  title: "Hoa Fee Annual",
  description: "Annual HOA dues from a constant monthly association fee.",
  inputs: [
    {
      id: "monthlyHoaFee",
      kind: "number",
      label: "Monthly Hoa Fee",
      unit: "currency",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "annualHoaFee",
      kind: "number",
      label: "Annual Hoa Fee",
      unit: "currency",
    },
  ],
  calculate: (input) =>
    calculateHoaFeeAnnual({
      monthlyHoaFee: input.monthlyHoaFee as number,
    }),
});
export const hoaFeeAnnualTool = tool;
export const runHoaFeeAnnual = tool.execute;
export default tool;
