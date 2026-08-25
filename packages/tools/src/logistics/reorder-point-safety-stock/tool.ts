import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ReorderPointSafetyStockInput = {
  readonly demandPerPeriod: number;
  readonly demandStdDevPerPeriod: number;
  readonly leadTimePeriods: number;
  readonly serviceLevelZ?: number;
};

export type ReorderPointSafetyStockOutput = {
  readonly reorderPointUnits: number;
  readonly safetyStockUnits: number;
};

export const calculateReorderPointSafetyStock = (
  input: ReorderPointSafetyStockInput,
): ReorderPointSafetyStockOutput => {
  if (!Number.isFinite(input.demandPerPeriod) || input.demandPerPeriod < 0)
    return simpleError(
      "demandPerPeriod",
      "Average demand must be finite and non-negative.",
      "invalid_demand",
    );
  if (
    !Number.isFinite(input.demandStdDevPerPeriod) ||
    input.demandStdDevPerPeriod < 0
  )
    return simpleError(
      "demandStdDevPerPeriod",
      "Demand standard deviation must be finite and non-negative.",
      "invalid_deviation",
    );
  if (!Number.isFinite(input.leadTimePeriods) || input.leadTimePeriods <= 0)
    return simpleError(
      "leadTimePeriods",
      "Lead time must be greater than zero.",
      "invalid_lead_time",
    );
  const serviceLevelZ = input.serviceLevelZ ?? 1.645;
  if (!Number.isFinite(serviceLevelZ) || serviceLevelZ < 0)
    return simpleError(
      "serviceLevelZ",
      "The service-level factor must be finite and non-negative.",
      "invalid_service_factor",
    );
  const safetyStockUnits =
    serviceLevelZ *
    input.demandStdDevPerPeriod *
    Math.sqrt(input.leadTimePeriods);
  const reorderPointUnits =
    input.demandPerPeriod * input.leadTimePeriods + safetyStockUnits;
  if (!Number.isFinite(safetyStockUnits) || !Number.isFinite(reorderPointUnits))
    return simpleError(
      "demandPerPeriod",
      "The reorder point is outside the representable range.",
      "result_out_of_range",
    );
  return { safetyStockUnits, reorderPointUnits };
};

export const reorderPointSafetyStockExample = {
  input: {
    demandPerPeriod: 50,
    demandStdDevPerPeriod: 10,
    leadTimePeriods: 4,
    serviceLevelZ: 2,
  },
  output: { reorderPointUnits: 240, safetyStockUnits: 40 },
} satisfies ToolExample<
  ReorderPointSafetyStockInput,
  ReorderPointSafetyStockOutput
>;

export const reorderPointSafetyStockTool = createSimpleTool({
  id: "logistics/reorder-point-safety-stock",
  title: "Reorder Point and Safety Stock Calculator",
  description:
    "Compute the classic reorder point demand times lead time plus z times sigma times the square root of lead time.",
  inputs: [
    {
      description: "Average demand per period.",
      id: "demandPerPeriod",
      kind: "number",
      label: "Demand/period",
      minimum: 0,
    },
    {
      description: "Standard deviation of demand per period.",
      id: "demandStdDevPerPeriod",
      kind: "number",
      label: "Demand sigma",
      minimum: 0,
    },
    {
      description: "Replenishment lead time in periods.",
      id: "leadTimePeriods",
      kind: "number",
      label: "Lead time",
      minimum: Number.MIN_VALUE,
    },
    {
      default: 1.645,
      description:
        "Service-level factor z from the standard normal distribution.",
      id: "serviceLevelZ",
      kind: "number",
      label: "z",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Safety stock units z * sigma * sqrt(lead time).",
      id: "safetyStockUnits",
      kind: "number",
      label: "Safety stock",
    },
    {
      description: "Reorder point in units.",
      id: "reorderPointUnits",
      kind: "number",
      label: "Reorder point",
    },
  ],
  calculate: (input) =>
    calculateReorderPointSafetyStock({
      demandPerPeriod: input.demandPerPeriod as number,
      demandStdDevPerPeriod: input.demandStdDevPerPeriod as number,
      leadTimePeriods: input.leadTimePeriods as number,
      serviceLevelZ: input.serviceLevelZ as number | undefined,
    }),
});

export const runReorderPointSafetyStock = reorderPointSafetyStockTool.execute;
export default reorderPointSafetyStockTool;
