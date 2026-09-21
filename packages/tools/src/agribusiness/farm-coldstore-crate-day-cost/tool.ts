import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly crates: number;
  readonly days: number;
  readonly dailyRate: number;
  readonly initialCoolingPerCrate: number;
};
export type Output = {
  readonly crateDays: number;
  readonly storageCost: number;
  readonly total: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    crates: { type: "integer", minimum: 0 },
    days: { type: "number", minimum: 0 },
    dailyRate: { type: "number", minimum: 0 },
    initialCoolingPerCrate: { type: "number", minimum: 0 },
  },
  required: ["crates", "days", "dailyRate", "initialCoolingPerCrate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    crateDays: { type: "number" },
    storageCost: { type: "number" },
    total: { type: "number" },
  },
  required: ["crateDays", "storageCost", "total"],
} as const;
/** Calculate farm coldstore crate day cost from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { crates, days, dailyRate, initialCoolingPerCrate } = request;
  const compute = (): Output => {
    H.integer(crates, 0);
    H.domain(days >= 0 && dailyRate >= 0 && initialCoolingPerCrate >= 0);
    return {
      crateDays: crates * days,
      storageCost: crates * days * dailyRate,
      total: crates * (days * dailyRate + initialCoolingPerCrate),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { crates: 100, days: 5, dailyRate: 0.2, initialCoolingPerCrate: 1 },
  output: { crateDays: 500, storageCost: 100, total: 200 },
} satisfies ToolExample<Input, Output>;
export const farmColdstoreCrateDayCostTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agribusiness/farm-coldstore-crate-day-cost",
    title: "Farm Coldstore Crate Day Cost Tool",
    description:
      "Calculate farm coldstore crate day cost from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        crates: { type: "integer", minimum: 0 },
        days: { type: "number", minimum: 0 },
        dailyRate: { type: "number", minimum: 0 },
        initialCoolingPerCrate: { type: "number", minimum: 0 },
      },
      required: ["crates", "days", "dailyRate", "initialCoolingPerCrate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        crateDays: { type: "number" },
        storageCost: { type: "number" },
        total: { type: "number" },
      },
      required: ["crateDays", "storageCost", "total"],
    },
    ports: {
      inputs: [
        {
          id: "crates",
          label: "Crates",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "days",
          label: "Days",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "dailyRate",
          label: "Daily Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "initialCoolingPerCrate",
          label: "Initial Cooling Per Crate",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "crateDays", label: "Crate Days", valueType: { type: "number" } },
        {
          id: "storageCost",
          label: "Storage Cost",
          valueType: { type: "number" },
        },
        { id: "total", label: "Total", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = farmColdstoreCrateDayCostTool.execute;
export default farmColdstoreCrateDayCostTool;
