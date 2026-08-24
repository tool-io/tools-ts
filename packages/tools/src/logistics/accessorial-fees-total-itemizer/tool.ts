import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AccessorialFeesTotalItemizerInput = {
  readonly liftgateUsd?: number;
  readonly residentialDeliveryUsd?: number;
  readonly insideDeliveryUsd?: number;
  readonly limitedAccessUsd?: number;
  readonly appointmentSchedulingUsd?: number;
  readonly otherUsd?: number;
};

export type AccessorialFeesTotalItemizerOutput = {
  readonly totalAccessorialUsd: number;
  readonly appliedCount: number;
};

const FEE_KEYS = [
  "liftgateUsd",
  "residentialDeliveryUsd",
  "insideDeliveryUsd",
  "limitedAccessUsd",
  "appointmentSchedulingUsd",
  "otherUsd",
] as const;

export const calculateAccessorialFeesTotalItemizer = (
  input: AccessorialFeesTotalItemizerInput,
): AccessorialFeesTotalItemizerOutput => {
  let totalAccessorialUsd = 0;
  let appliedCount = 0;
  for (const key of FEE_KEYS) {
    const value = input[key] === undefined ? 0 : input[key];
    if (!Number.isFinite(value))
      return simpleError(key, "Fees must be finite numbers.", "invalid_fee");
    if (value < 0)
      return simpleError(key, "Fees cannot be negative.", "invalid_fee");
    if (value > Number.MAX_VALUE - totalAccessorialUsd)
      return simpleError(
        key,
        "The accessorial fee total is too large to represent.",
        "fee_total_overflow",
      );
    totalAccessorialUsd += value;
    if (value > 0) appliedCount += 1;
  }
  return { totalAccessorialUsd, appliedCount };
};

const optionalNumber = (value: unknown): number | undefined =>
  typeof value === "number" ? value : undefined;

export const accessorialFeesTotalItemizerExample = {
  input: { liftgateUsd: 82, residentialDeliveryUsd: 5.25 },
  output: { totalAccessorialUsd: 87.25, appliedCount: 2 },
} satisfies ToolExample<
  AccessorialFeesTotalItemizerInput,
  AccessorialFeesTotalItemizerOutput
>;

export const accessorialFeesTotalItemizerTool = createSimpleTool({
  id: "logistics/accessorial-fees-total-itemizer",
  title: "Accessorial Fees Total Itemizer",
  description:
    "Sum the accessorial fee line items on a freight invoice and count how many fees were applied.",
  inputs: [
    {
      default: 0,
      description: "Liftgate fee in US dollars.",
      id: "liftgateUsd",
      kind: "number",
      label: "Liftgate",
      minimum: 0,
      unit: "USD",
    },
    {
      default: 0,
      description: "Residential delivery fee in US dollars.",
      id: "residentialDeliveryUsd",
      kind: "number",
      label: "Residential",
      minimum: 0,
      unit: "USD",
    },
    {
      default: 0,
      description: "Inside delivery fee in US dollars.",
      id: "insideDeliveryUsd",
      kind: "number",
      label: "Inside delivery",
      minimum: 0,
      unit: "USD",
    },
    {
      default: 0,
      description: "Limited-access location fee in US dollars.",
      id: "limitedAccessUsd",
      kind: "number",
      label: "Limited access",
      minimum: 0,
      unit: "USD",
    },
    {
      default: 0,
      description: "Appointment scheduling fee in US dollars.",
      id: "appointmentSchedulingUsd",
      kind: "number",
      label: "Appointment",
      minimum: 0,
      unit: "USD",
    },
    {
      default: 0,
      description: "Any other accessorial fee in US dollars.",
      id: "otherUsd",
      kind: "number",
      label: "Other",
      minimum: 0,
      unit: "USD",
    },
  ],
  outputs: [
    {
      description: "Sum of all applied accessorial fees in US dollars.",
      id: "totalAccessorialUsd",
      kind: "number",
      label: "Total",
      unit: "USD",
    },
    {
      description: "Number of fee line items greater than zero.",
      id: "appliedCount",
      kind: "integer",
      label: "Applied",
    },
  ],
  calculate: (input) =>
    calculateAccessorialFeesTotalItemizer({
      appointmentSchedulingUsd: optionalNumber(input.appointmentSchedulingUsd),
      insideDeliveryUsd: optionalNumber(input.insideDeliveryUsd),
      liftgateUsd: optionalNumber(input.liftgateUsd),
      limitedAccessUsd: optionalNumber(input.limitedAccessUsd),
      otherUsd: optionalNumber(input.otherUsd),
      residentialDeliveryUsd: optionalNumber(input.residentialDeliveryUsd),
    }),
});

export const runAccessorialFeesTotalItemizer =
  accessorialFeesTotalItemizerTool.execute;
export default accessorialFeesTotalItemizerTool;
