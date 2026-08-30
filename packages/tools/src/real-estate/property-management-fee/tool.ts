import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PropertyManagementFeeInput = Readonly<{
  readonly collectedRent: number;
  readonly feePercent: number;
}>;
export type PropertyManagementFeeOutput = Readonly<{
  readonly managementFee: number;
}>;

export const calculatePropertyManagementFee = (
  x: PropertyManagementFeeInput,
): PropertyManagementFeeOutput => {
  if (!Number.isFinite(x.collectedRent) || x.collectedRent < 0)
    simpleError("collectedRent", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.feePercent) || x.feePercent < 0)
    simpleError("feePercent", "Provide a finite nonnegative number.");
  const managementFee = (x.collectedRent * x.feePercent) / 100;
  if (!Number.isFinite(managementFee))
    simpleError(
      "managementFee",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { managementFee: Object.is(managementFee, -0) ? 0 : managementFee };
};

export const example = {
  input: {
    collectedRent: 20000,
    feePercent: 8,
  },
  output: { managementFee: 1600 },
} satisfies ToolExample<
  PropertyManagementFeeInput,
  PropertyManagementFeeOutput
>;

export const tool = createSimpleTool({
  id: "real-estate/property-management-fee",
  title: "Property Management Fee",
  description:
    "Management fee from collected rent and a user-supplied percentage of collected rent.",
  inputs: [
    {
      id: "collectedRent",
      kind: "number",
      label: "Collected Rent",
      unit: "currency",
      minimum: 0,
    },
    {
      id: "feePercent",
      kind: "number",
      label: "Fee Percent",
      unit: "percent",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "managementFee",
      kind: "number",
      label: "Management Fee",
      unit: "currency",
    },
  ],
  calculate: (input) =>
    calculatePropertyManagementFee({
      collectedRent: input.collectedRent as number,
      feePercent: input.feePercent as number,
    }),
});
export const propertyManagementFeeTool = tool;
export const runPropertyManagementFee = tool.execute;
export default tool;
