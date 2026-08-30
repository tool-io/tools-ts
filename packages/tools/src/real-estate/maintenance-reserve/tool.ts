import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MaintenanceReserveInput = Readonly<{
  readonly annualGrossRent: number;
  readonly reservePercent: number;
}>;
export type MaintenanceReserveOutput = Readonly<{
  readonly annualReserve: number;
}>;

export const calculateMaintenanceReserve = (
  x: MaintenanceReserveInput,
): MaintenanceReserveOutput => {
  if (!Number.isFinite(x.annualGrossRent) || x.annualGrossRent < 0)
    simpleError("annualGrossRent", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.reservePercent) || x.reservePercent < 0)
    simpleError("reservePercent", "Provide a finite nonnegative number.");
  const annualReserve = (x.annualGrossRent * x.reservePercent) / 100;
  if (!Number.isFinite(annualReserve))
    simpleError(
      "annualReserve",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { annualReserve: Object.is(annualReserve, -0) ? 0 : annualReserve };
};

export const example = {
  input: {
    annualGrossRent: 24000,
    reservePercent: 5,
  },
  output: { annualReserve: 1200 },
} satisfies ToolExample<MaintenanceReserveInput, MaintenanceReserveOutput>;

export const tool = createSimpleTool({
  id: "real-estate/maintenance-reserve",
  title: "Maintenance Reserve",
  description:
    "Annual maintenance reserve from annual gross rent and a user-selected reserve percentage.",
  inputs: [
    {
      id: "annualGrossRent",
      kind: "number",
      label: "Annual Gross Rent",
      unit: "currency",
      minimum: 0,
    },
    {
      id: "reservePercent",
      kind: "number",
      label: "Reserve Percent",
      unit: "percent",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "annualReserve",
      kind: "number",
      label: "Annual Reserve",
      unit: "currency",
    },
  ],
  calculate: (input) =>
    calculateMaintenanceReserve({
      annualGrossRent: input.annualGrossRent as number,
      reservePercent: input.reservePercent as number,
    }),
});
export const maintenanceReserveTool = tool;
export const runMaintenanceReserve = tool.execute;
export default tool;
