import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ContainerPerDiemChargesComputationInput = {
  readonly chargeCapAmount?: number;
  readonly chargeableDays: number;
  readonly perDiemRate: number;
};

export type ContainerPerDiemChargesComputationOutput = {
  readonly capApplied: boolean;
  readonly totalDue: number;
  readonly uncappedTotal: number;
};

export const calculateContainerPerDiemChargesComputation = (
  input: ContainerPerDiemChargesComputationInput,
): ContainerPerDiemChargesComputationOutput => {
  if (!Number.isSafeInteger(input.chargeableDays) || input.chargeableDays < 0)
    return simpleError(
      "chargeableDays",
      "Chargeable days must be a non-negative safe integer.",
      "invalid_days",
    );
  if (!Number.isFinite(input.perDiemRate) || input.perDiemRate < 0)
    return simpleError(
      "perDiemRate",
      "The per-diem rate must be finite and non-negative.",
      "invalid_rate",
    );
  const chargeCapAmount =
    input.chargeCapAmount === undefined ? 0 : input.chargeCapAmount;
  if (!Number.isFinite(chargeCapAmount) || chargeCapAmount < 0)
    return simpleError(
      "chargeCapAmount",
      "The charge cap must be finite and non-negative.",
      "invalid_cap",
    );
  const calculatedUncappedTotal = input.chargeableDays * input.perDiemRate;
  if (!Number.isFinite(calculatedUncappedTotal))
    return simpleError(
      "perDiemRate",
      "The uncapped charge is too large to represent.",
      "charge_out_of_range",
    );
  const uncappedTotal =
    calculatedUncappedTotal === 0 ? 0 : calculatedUncappedTotal;
  const capApplied = chargeCapAmount > 0 && uncappedTotal > chargeCapAmount;
  return {
    capApplied,
    totalDue: capApplied ? chargeCapAmount : uncappedTotal,
    uncappedTotal,
  };
};

export const containerPerDiemChargesComputationExample = {
  input: { chargeCapAmount: 3000, chargeableDays: 14, perDiemRate: 185.5 },
  output: { capApplied: false, totalDue: 2597, uncappedTotal: 2597 },
} satisfies ToolExample<
  ContainerPerDiemChargesComputationInput,
  ContainerPerDiemChargesComputationOutput
>;

export const containerPerDiemChargesComputationTool = createSimpleTool({
  id: "logistics/container-per-diem-charges-computation",
  title: "Container Per Diem Charges Computation",
  description:
    "Multiply chargeable detention or demurrage days by the daily per-diem rate and apply an optional total charge cap, where a cap of zero means uncapped.",
  inputs: [
    {
      default: 0,
      description: "Maximum total charged in currency units; 0 means no cap.",
      id: "chargeCapAmount",
      kind: "number",
      label: "Charge cap",
      minimum: 0,
    },
    {
      description: "Chargeable days beyond free time.",
      id: "chargeableDays",
      kind: "integer",
      label: "Chargeable days",
      minimum: 0,
    },
    {
      description: "Per-diem rate in currency units per day.",
      id: "perDiemRate",
      kind: "number",
      label: "Per-diem rate",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "True when the cap reduced the amount due.",
      id: "capApplied",
      kind: "boolean",
      label: "Cap applied",
    },
    {
      description: "Amount actually due in currency units.",
      id: "totalDue",
      kind: "number",
      label: "Total due",
      minimum: 0,
    },
    {
      description: "Days times rate before any cap in currency units.",
      id: "uncappedTotal",
      kind: "number",
      label: "Uncapped total",
      minimum: 0,
    },
  ],
  calculate: (input) =>
    calculateContainerPerDiemChargesComputation({
      chargeCapAmount: input.chargeCapAmount as number,
      chargeableDays: input.chargeableDays as number,
      perDiemRate: input.perDiemRate as number,
    }),
});

export const runContainerPerDiemChargesComputation =
  containerPerDiemChargesComputationTool.execute;
export default containerPerDiemChargesComputationTool;
