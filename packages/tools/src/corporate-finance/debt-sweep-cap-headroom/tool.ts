import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly availableCash: number;
  readonly protectedCash: number;
  readonly sweepFraction: number;
  readonly outstandingDebt: number;
  readonly periodCap: number;
};
export type Output = {
  readonly eligibleCash: number;
  readonly requestedSweep: number;
  readonly appliedSweep: number;
  readonly unusedCap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    availableCash: { type: "number", minimum: 0 },
    protectedCash: { type: "number", minimum: 0 },
    sweepFraction: { type: "number", minimum: 0, maximum: 1 },
    outstandingDebt: { type: "number", minimum: 0 },
    periodCap: { type: "number", minimum: 0 },
  },
  required: [
    "availableCash",
    "protectedCash",
    "sweepFraction",
    "outstandingDebt",
    "periodCap",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligibleCash: { type: "number" },
    requestedSweep: { type: "number" },
    appliedSweep: { type: "number" },
    unusedCap: { type: "number" },
  },
  required: ["eligibleCash", "requestedSweep", "appliedSweep", "unusedCap"],
} as const;
/** Apply explicit cash protection, sweep fraction, debt balance and period cap; no financing recommendation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    availableCash,
    protectedCash,
    sweepFraction,
    outstandingDebt,
    periodCap,
  } = request;
  const compute = (): Output => {
    H.domain(
      availableCash >= 0 &&
        protectedCash >= 0 &&
        outstandingDebt >= 0 &&
        periodCap >= 0,
    );
    H.probability(sweepFraction);
    return (() => {
      const eligibleCash = Math.max(0, availableCash - protectedCash),
        requestedSweep = eligibleCash * sweepFraction,
        appliedSweep = Math.min(requestedSweep, outstandingDebt, periodCap);
      return {
        eligibleCash,
        requestedSweep,
        appliedSweep,
        unusedCap: periodCap - appliedSweep,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    availableCash: 100,
    protectedCash: 20,
    sweepFraction: 0.5,
    outstandingDebt: 30,
    periodCap: 50,
  },
  output: {
    eligibleCash: 80,
    requestedSweep: 40,
    appliedSweep: 30,
    unusedCap: 20,
  },
} satisfies ToolExample<Input, Output>;
export const debtSweepCapHeadroomTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "corporate-finance/debt-sweep-cap-headroom",
    title: "Debt Sweep Cap Headroom Tool",
    description:
      "Apply explicit cash protection, sweep fraction, debt balance and period cap; no financing recommendation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        availableCash: { type: "number", minimum: 0 },
        protectedCash: { type: "number", minimum: 0 },
        sweepFraction: { type: "number", minimum: 0, maximum: 1 },
        outstandingDebt: { type: "number", minimum: 0 },
        periodCap: { type: "number", minimum: 0 },
      },
      required: [
        "availableCash",
        "protectedCash",
        "sweepFraction",
        "outstandingDebt",
        "periodCap",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eligibleCash: { type: "number" },
        requestedSweep: { type: "number" },
        appliedSweep: { type: "number" },
        unusedCap: { type: "number" },
      },
      required: ["eligibleCash", "requestedSweep", "appliedSweep", "unusedCap"],
    },
    ports: {
      inputs: [
        {
          id: "availableCash",
          label: "Available Cash",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "protectedCash",
          label: "Protected Cash",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sweepFraction",
          label: "Sweep Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "outstandingDebt",
          label: "Outstanding Debt",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "periodCap",
          label: "Period Cap",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "eligibleCash",
          label: "Eligible Cash",
          valueType: { type: "number" },
        },
        {
          id: "requestedSweep",
          label: "Requested Sweep",
          valueType: { type: "number" },
        },
        {
          id: "appliedSweep",
          label: "Applied Sweep",
          valueType: { type: "number" },
        },
        { id: "unusedCap", label: "Unused Cap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = debtSweepCapHeadroomTool.execute;
export default debtSweepCapHeadroomTool;
